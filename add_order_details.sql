-- Run this in your Supabase SQL Editor if the columns don't already exist.
-- It ensures that the orders table has all the necessary customer detail columns.

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text;

-- Ensure order_items can store size if applicable
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS size text;
