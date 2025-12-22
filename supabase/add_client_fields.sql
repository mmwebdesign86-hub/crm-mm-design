-- Add new fields to clients table
ALTER TABLE clients
ADD COLUMN trade_name text,
ADD COLUMN mobile_phone text,
ADD COLUMN website_url text,
ADD COLUMN province text;