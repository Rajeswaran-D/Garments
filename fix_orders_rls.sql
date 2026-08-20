-- Enable RLS for anonymous checkout
-- Allow anyone (including non-logged in users) to insert orders
CREATE POLICY "Allow anonymous insert to orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Allow anyone to insert order items
CREATE POLICY "Allow anonymous insert to order items"
ON order_items FOR INSERT
WITH CHECK (true);
