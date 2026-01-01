-- Insert sample data for testing

-- Sample users
INSERT INTO users (name, email, password_hash, role) VALUES
('John Designer', 'john@example.com', '$2b$10$hash1', 'designer'),
('Jane Buyer', 'jane@example.com', '$2b$10$hash2', 'buyer'),
('Admin User', 'admin@yeba.com', '$2b$10$hash3', 'admin'),
('Alice Designer', 'alice@example.com', '$2b$10$hash4', 'designer'),
('Bob Buyer', 'bob@example.com', '$2b$10$hash5', 'buyer');

-- Sample designers
INSERT INTO designers (id, bio, portfolio_link, rating, earnings) VALUES
(1, 'Professional graphic designer with 5+ years experience', 'https://portfolio.john.com', 4.5, 1250.00),
(4, 'UI/UX specialist focusing on modern web design', 'https://alice-designs.com', 4.8, 2100.00);

-- Sample buyers
INSERT INTO buyers (id, extra_info) VALUES
(2, '{"company": "Tech Startup", "industry": "Software"}'),
(5, '{"preferences": ["minimalist", "modern"], "budget": "medium"}');

-- Sample designs
INSERT INTO designs (designer_id, title, description, category, price, file_url, watermarked_preview_url) VALUES
(1, 'Modern Logo Design', 'Clean and professional logo design for tech companies', 'Logo', 99.99, '/files/logo1.ai', '/previews/logo1_watermarked.jpg'),
(1, 'Business Card Template', 'Elegant business card design template', 'Print', 29.99, '/files/business_card1.psd', '/previews/business_card1_watermarked.jpg'),
(4, 'Mobile App UI Kit', 'Complete UI kit for mobile applications', 'UI/UX', 149.99, '/files/mobile_ui_kit.sketch', '/previews/mobile_ui_kit_watermarked.jpg'),
(4, 'Website Landing Page', 'Modern landing page design for SaaS products', 'Web', 199.99, '/files/landing_page.figma', '/previews/landing_page_watermarked.jpg');

-- Sample transactions
INSERT INTO transactions (buyer_id, design_id, amount, payment_status, payment_method) VALUES
(2, 1, 99.99, 'completed', 'stripe'),
(5, 3, 149.99, 'completed', 'paystack'),
(2, 4, 199.99, 'pending', 'stripe');

-- Sample reviews
INSERT INTO reviews (designer_id, buyer_id, rating, comment) VALUES
(1, 2, 5, 'Excellent work! Very professional and delivered on time.'),
(4, 5, 5, 'Amazing UI kit with great attention to detail. Highly recommended!');

-- Sample messages
INSERT INTO messages (sender_id, receiver_id, message) VALUES
(2, 1, 'Hi John, I love your logo design! Can you make some minor adjustments?'),
(1, 2, 'Of course! What changes would you like me to make?'),
(5, 4, 'The UI kit is perfect for my project. Thank you!');

-- Sample withdrawals
INSERT INTO withdrawals (designer_id, amount, status) VALUES
(1, 500.00, 'approved'),
(4, 1000.00, 'pending');
