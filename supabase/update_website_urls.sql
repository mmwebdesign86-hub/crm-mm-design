-- Rename the column and change type to array, converting existing data
ALTER TABLE clients
RENAME COLUMN website_url TO website_urls;

ALTER TABLE clients
ALTER COLUMN website_urls TYPE text[] 
USING CASE 
    WHEN website_urls IS NULL THEN NULL 
    WHEN website_urls = '' THEN NULL
    ELSE ARRAY[website_urls] 
END;