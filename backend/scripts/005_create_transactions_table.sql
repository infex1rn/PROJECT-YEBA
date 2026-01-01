-- Create Transactions table for purchase tracking
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    design_id INTEGER NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('stripe', 'paystack', 'paypal')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for transaction queries
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_design_id ON transactions(design_id);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Ensure a buyer can only purchase the same design once
CREATE UNIQUE INDEX idx_unique_buyer_design ON transactions(buyer_id, design_id) 
WHERE payment_status = 'completed';
