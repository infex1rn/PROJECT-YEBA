-- Create Withdrawals table for designer earnings management
CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,
    designer_id INTEGER NOT NULL REFERENCES designers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for withdrawal queries
CREATE INDEX idx_withdrawals_designer_id ON withdrawals(designer_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_requested_at ON withdrawals(requested_at DESC);
