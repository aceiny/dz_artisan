-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for status
CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE job_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Artisan profiles
CREATE TABLE artisan_profiles (
    artisan_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    trade_type VARCHAR(100) NOT NULL,
    description TEXT,
    years_experience INTEGER CHECK (years_experience >= 0),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    available_for_work BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_artisan_profiles_timestamp
    BEFORE UPDATE ON artisan_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Certifications
CREATE TABLE certifications (
    certification_id BIGSERIAL PRIMARY KEY,
    artisan_id BIGINT REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiry_date DATE CHECK (expiry_date > issue_date),
    document_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio items
CREATE TABLE portfolio_items (
    item_id BIGSERIAL PRIMARY KEY,
    artisan_id BIGINT REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completion_date DATE,
    image_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quote requests
CREATE TABLE quote_requests (
    request_id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    required_date DATE CHECK (required_date >= CURRENT_DATE),
    status quote_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE quotes (
    quote_id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES quote_requests(request_id) ON DELETE CASCADE,
    artisan_id BIGINT REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    validity_period INTEGER CHECK (validity_period > 0),
    status quote_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
    job_id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT REFERENCES quotes(quote_id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE CHECK (end_date >= start_date),
    status job_status DEFAULT 'scheduled',
    final_amount DECIMAL(10,2) CHECK (final_amount > 0),
    payment_status payment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_jobs_timestamp
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Messages
CREATE TABLE messages (
    message_id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ,
    CHECK (sender_id != receiver_id)
);

-- Reviews
CREATE TABLE reviews (
    review_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES jobs(job_id) ON DELETE CASCADE,
    client_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    artisan_id BIGINT REFERENCES artisan_profiles(artisan_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_artisan_trade ON artisan_profiles(trade_type);
CREATE INDEX idx_quote_status ON quotes(status);
CREATE INDEX idx_job_status ON jobs(status);
CREATE INDEX idx_messages_users ON messages(sender_id, receiver_id);
CREATE INDEX idx_reviews_artisan ON reviews(artisan_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);