-- Create Reviews table for designer ratings
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    designer_id INTEGER NOT NULL REFERENCES designers(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for review queries
CREATE INDEX idx_reviews_designer_id ON reviews(designer_id);
CREATE INDEX idx_reviews_buyer_id ON reviews(buyer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Ensure a buyer can only review a designer once
CREATE UNIQUE INDEX idx_unique_buyer_designer_review ON reviews(buyer_id, designer_id);
