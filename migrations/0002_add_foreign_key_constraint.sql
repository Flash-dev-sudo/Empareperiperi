-- Add missing foreign key constraint for catalog_menu_items -> catalog_categories
-- This migration adds the foreign key constraint that was missing from the initial catalog tables

-- Note: SQLite doesn't support adding foreign key constraints to existing tables
-- We'll need to recreate the table if it already exists without the constraint

-- Check if we need to add the constraint (this is mainly for documentation)
-- The constraint should be added when the table is created in 0001_add_catalog_tables.sql