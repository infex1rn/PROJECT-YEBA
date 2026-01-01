-- Create function to update designer ratings when reviews are added
CREATE OR REPLACE FUNCTION update_designer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE designers 
    SET rating = (
        SELECT ROUND(AVG(rating::numeric), 2)
        FROM reviews 
        WHERE designer_id = COALESCE(NEW.designer_id, OLD.designer_id)
    )
    WHERE id = COALESCE(NEW.designer_id, OLD.designer_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update designer ratings
CREATE TRIGGER trigger_update_designer_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_designer_rating();

-- Create function to update designer earnings when transactions are completed
CREATE OR REPLACE FUNCTION update_designer_earnings()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
        UPDATE designers 
        SET earnings = earnings + NEW.amount
        WHERE id = (SELECT designer_id FROM designs WHERE id = NEW.design_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update designer earnings
CREATE TRIGGER trigger_update_designer_earnings
    AFTER UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_designer_earnings();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
