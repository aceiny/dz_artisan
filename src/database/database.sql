-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
CREATE TYPE user_role AS ENUM ('client', 'artisan');
CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE job_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE employment_status AS ENUM ('student', 'employed', 'self_employed', 'freelancer', 'unemployed', 'retired');
CREATE TYPE job_type AS ENUM ('one_time', 'contract', 'temporary', 'volunteer');

-- Timestamp Trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users Table
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    wilaya VARCHAR(100),
    birthday DATE, 
    bio TEXT, 
    profile_picture TEXT, 
    employment_status employment_status,
    role user_role NOT NULL DEFAULT 'client',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Artisan Portfolios
CREATE TABLE artisan_portfolios (
    portfolio_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE UNIQUE,
    job_title VARCHAR(255) NOT NULL,
    years_experience DECIMAL(4,1) CHECK (years_experience >= 0),
    hourly_rate DECIMAL(10,2),
    cv_document_url TEXT,
    profile_summary TEXT,
    skills TEXT[],
    service_areas TEXT[],
    languages TEXT[],
    availability_status VARCHAR(50) DEFAULT 'available',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Certifications
CREATE TABLE certifications (
    certification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (expiry_date > issue_date)
);

-- Experiences
CREATE TABLE experiences (
    experience_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Jobs
CREATE TABLE jobs (
    job_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type job_type NOT NULL DEFAULT 'one_time',
    status job_status NOT NULL DEFAULT 'pending',
    tags TEXT[],
    minimum_price DECIMAL(10,2) NOT NULL CHECK (minimum_price > 0),
    estimated_duration VARCHAR(100),
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Chat System
CREATE TABLE chats (
    chat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    user2_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_users CHECK (user1_id != user2_id)
);
CREATE TABLE messages (
    message_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id uuid REFERENCES chats(chat_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ,
    CONSTRAINT valid_sender CHECK (user_id IN (
        SELECT user1_id FROM chats WHERE chat_id = messages.chat_id
        UNION
        SELECT user2_id FROM chats WHERE chat_id = messages.chat_id
    ))
);

-- Quote System
CREATE TABLE quote_requests (
    request_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id uuid REFERENCES jobs(job_id) ON DELETE CASCADE,
    client_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    preferred_date DATE,
    status quote_status DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotes (
    quote_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid REFERENCES quote_requests(request_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    validity_period INTEGER CHECK (validity_period > 0),
    status quote_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- Reviews
CREATE TABLE reviews (
    review_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id uuid REFERENCES jobs(job_id) ON DELETE CASCADE,
    client_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    artisan_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_review UNIQUE (job_id, client_id, artisan_id),
    CONSTRAINT valid_client CHECK (client_id != artisan_id)
);
CREATE TABLE contracts (
    contract_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id uuid REFERENCES quotes(quote_id) ON DELETE CASCADE,
    job_id uuid REFERENCES jobs(job_id) ON DELETE CASCADE,
    client_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    artisan_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    agreed_price DECIMAL(10,2) NOT NULL CHECK (agreed_price > 0),
    start_date DATE NOT NULL,
    end_date DATE,
    status job_status NOT NULL DEFAULT 'scheduled', -- Use the existing job_status enum
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Trigger for updating timestamp
CREATE TRIGGER update_contracts_timestamp
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
-- Triggers
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_jobs_timestamp
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_artisan_portfolios_timestamp
    BEFORE UPDATE ON artisan_portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wilaya ON users(wilaya);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_artisan_portfolios_user_id ON artisan_portfolios(user_id);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_quote_requests_client_id ON quote_requests(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_chats_users ON chats(user1_id, user2_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Safe User View to avoid sending user password back 
CREATE VIEW user_info AS
SELECT 
    user_id,
    username,
    full_name,
    email,
    phone_number,
    address,
    wilaya,
    birthday,
    bio,
    profile_picture,
    employment_status,
    email_verified,
    role,
    created_at,
    updated_at
FROM users;

