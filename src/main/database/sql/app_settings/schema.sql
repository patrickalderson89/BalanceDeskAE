-- ========================================================
-- Table: app_settings
-- Description: Stores global, application-wide settings.
-- These settings are independent of any specific user and 
-- apply to the entire application.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each setting
        key TEXT NOT NULL UNIQUE, -- Name of the setting (must be unique, e.g., 'theme', 'language')
        value TEXT NOT NULL -- Value of the setting (e.g., 'dark', 'en-US')
    );