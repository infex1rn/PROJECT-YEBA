-- Create Designs table for marketplace products
CREATE TABLE designs (
    id SERIAL PRIMARY KEY,
    designer_id INTEGER NOT NULL REFERENCES designers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    file_url VARCHAR(500) NOT NULL,
    watermarked_preview_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_designs_designer_id ON designs(designer_id);
CREATE INDEX idx_designs_category ON designs(category);
CREATE INDEX idx_designs_price ON designs(price);
CREATE INDEX idx_designs_created_at ON designs(created_at DESC);
