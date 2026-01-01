-- Create Buyers table extending Users
CREATE TABLE buyers (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    extra_info JSONB
);
