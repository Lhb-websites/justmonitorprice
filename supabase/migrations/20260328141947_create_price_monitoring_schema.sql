/*
  # Philippine Price Monitoring System

  ## Overview
  Database schema for tracking prices of essential food products in the Philippines.
  
  ## New Tables
  
  ### `products`
  Stores information about essential products being monitored
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Product name (e.g., "Cooking Oil", "Eggs")
  - `category` (text) - Product category (e.g., "Oils & Fats", "Poultry")
  - `unit` (text) - Measurement unit (e.g., "per liter", "per dozen")
  - `description` (text) - Additional product details
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `price_history`
  Tracks historical price data for products
  - `id` (uuid, primary key) - Unique identifier
  - `product_id` (uuid, foreign key) - References products table
  - `price` (decimal) - Price in Philippine Pesos
  - `source` (text) - Data source (e.g., "PSA", "DA", "Manual Entry")
  - `location` (text) - Location/market where price was recorded
  - `recorded_at` (timestamptz) - When the price was observed
  - `created_at` (timestamptz) - When the record was created
  
  ## Security
  
  ### Products Table
  - Enable RLS
  - Public read access for monitoring purposes
  - Insert/update/delete restricted to authenticated users
  
  ### Price History Table
  - Enable RLS
  - Public read access for monitoring purposes
  - Insert restricted to authenticated users (for data collection)
  - Update/delete restricted to authenticated users (for corrections)
  
  ## Notes
  - All timestamps use Philippine timezone awareness
  - Price data is public for transparency
  - Indexes added for common query patterns
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL,
  source text DEFAULT 'Manual Entry',
  location text DEFAULT 'National Capital Region',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Price history policies
CREATE POLICY "Anyone can view price history"
  ON price_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert price history"
  ON price_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update price history"
  ON price_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete price history"
  ON price_history FOR DELETE
  TO authenticated
  USING (true);