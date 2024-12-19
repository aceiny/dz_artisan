-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'artisan');
CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE job_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- Create timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    wilaya VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create view for safe user data
CREATE VIEW user_info AS
SELECT 
    user_id,
    full_name,
    email,
    phone_number,
    address,
    wilaya,
    role,
    created_at,
    updated_at
FROM users;

-- Artisan profiles (now part of users)
-- Certifications
CREATE TABLE certifications (
    certification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiry_date DATE CHECK (expiry_date > issue_date),
    document_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Experiences
CREATE TABLE experiences (
    experience_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completion_date DATE,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Chat system
CREATE TABLE chats (
    chat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    user2_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    message_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id uuid REFERENCES chats(chat_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ
);


-- Quote Requests
CREATE TABLE quote_requests (
    request_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id uuid REFERENCES jobs(job_id) ON DELETE CASCADE, -- Job ID
    client_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Client who requests the quote
    preferred_date DATE, -- Preferred Installation Date
    status quote_status DEFAULT 'pending', -- Request Status
    note TEXT, -- Additional Note
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE quotes (
    quote_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid REFERENCES quote_requests(request_id) ON DELETE CASCADE, -- Quote Request ID
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Artisan providing the quote
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0), -- Quoted Amount
    description TEXT, -- Quote Description
    validity_period INTEGER CHECK (validity_period > 0), -- Validity Period in Days
    status quote_status DEFAULT 'pending', -- Quote Status
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- Jobs
CREATE TABLE jobs (
    job_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Artisan who posted the job
    title VARCHAR(255) NOT NULL, -- Job Title
    description TEXT NOT NULL, -- Job Description
    location VARCHAR(255) NOT NULL, -- Job Location
    price_range VARCHAR(50) NOT NULL, -- Price Range
    status job_status DEFAULT 'scheduled', -- Job Status
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    review_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id uuid REFERENCES jobs(job_id) ON DELETE CASCADE,
    client_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add triggers
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_jobs_timestamp
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wilaya ON users(wilaya);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_quote_status ON quotes(status);
CREATE INDEX idx_job_status ON jobs(status);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);