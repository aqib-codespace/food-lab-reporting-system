-- Migration: Add image field to container_types table
-- Purpose: Allow users to add images to container types (like sender shops and sample names)
-- Date: 2024

-- Add image column to container_types table
ALTER TABLE container_types
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add comment to the column
COMMENT ON COLUMN container_types.image IS 'Storage path for container type image in Supabase Storage';

-- No indexes needed for image field as it won't be used in queries
