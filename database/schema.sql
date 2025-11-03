-- BlogApp Database Schema
-- This file contains the SQL schema for the BlogApp Supabase database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), -- For email/password auth (hashed)
    google_id VARCHAR(255), -- For Google OAuth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for posts table
-- Anyone can read posts
CREATE POLICY "Anyone can read posts" ON posts
    FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
-- Note: You should create users through the application, not directly in SQL
-- This is just for testing purposes

-- Sample user (password is 'password123' hashed with bcrypt)
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK')
ON CONFLICT (email) DO NOTHING;

-- Sample posts (you'll need to replace the author_id with actual user IDs)
-- INSERT INTO posts (title, content, excerpt, author_id) VALUES 
-- ('Welcome to BlogApp', 'This is a sample blog post to demonstrate the functionality of our blogging platform. You can create, edit, and delete posts once you''re logged in.', 'This is a sample blog post to demonstrate the functionality...', 'user-id-here')
-- ON CONFLICT DO NOTHING;