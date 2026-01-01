-- Create Designers table extending Users
CREATE TABLE designers (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    portfolio_link VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    earnings DECIMAL(12,2) DEFAULT 0.00 CHECK (earnings >= 0)
);

-- Create index on rating for sorting/filtering
CREATE INDEX idx_designers_rating ON designers(rating DESC);
