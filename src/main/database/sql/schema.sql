-- ========================================================
-- Database Versioning Table
-- Tracks changes made to the database schema over time.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS db_version (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the version entry
        version INTEGER NOT NULL, -- Schema version number
        description TEXT, -- Description of the changes made
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the version was applied
    );

-- ========================================================
-- App Settings Table
-- Stores global, application-wide settings.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the setting
        key TEXT NOT NULL UNIQUE, -- Unique key for the setting
        value TEXT NOT NULL -- Value associated with the setting
    );

-- ========================================================
-- Categories Table
-- Groups sub-budgets into broader categories.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the category
        name TEXT NOT NULL UNIQUE, -- Unique name of the category
        description TEXT DEFAULT '', -- Short description of the category
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- Soft deletion flag
        deleted_at DATETIME, -- Timestamp of deletion
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Last update timestamp
    );

-- ========================================================
-- Sub-Budgets Table
-- Represents individual budgets under a category.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS sub_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the sub-budget
        category_id INTEGER NOT NULL, -- Foreign key to categories
        name TEXT NOT NULL, -- Name of the sub-budget
        description TEXT DEFAULT '', -- Description of the sub-budget
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Last update timestamp
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- Soft deletion flag
        deleted_at DATETIME, -- Timestamp of deletion
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE, -- Relation to categories
        UNIQUE (category_id, name) -- Ensure unique sub-budget names within a category
    );

-- ========================================================
-- Incomes Table
-- Tracks income transactions for sub-budgets.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the income transaction
        sub_budget_id INTEGER NOT NULL, -- Foreign key to sub-budgets
        title TEXT NOT NULL, -- Title of the income transaction
        description TEXT DEFAULT '', -- Description of the income
        source TEXT DEFAULT '', -- Source of the income
        amount REAL NOT NULL, -- Income amount
        payment_type TEXT CHECK (payment_type IN ('cash', 'bank')), -- Type of payment
        transaction_date DATE NOT NULL, -- Date of the transaction
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Last update timestamp
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- Soft deletion flag
        deleted_at DATETIME, -- Timestamp of deletion
        FOREIGN KEY (sub_budget_id) REFERENCES sub_budgets (id) ON DELETE CASCADE -- Relation to sub-budgets
    );

-- ========================================================
-- Expenses Table
-- Tracks expense transactions for sub-budgets.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for the expense transaction
        sub_budget_id INTEGER NOT NULL, -- Foreign key to sub-budgets
        title TEXT NOT NULL, -- Title of the expense transaction
        description TEXT DEFAULT '', -- Description of the expense
        recipient TEXT DEFAULT '', -- Recipient of the expense
        amount REAL NOT NULL, -- Expense amount
        payment_type TEXT CHECK (payment_type IN ('cash', 'bank')), -- Type of payment
        transaction_date DATE NOT NULL, -- Date of the transaction
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Last update timestamp
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- Soft deletion flag
        deleted_at DATETIME, -- Timestamp of deletion
        FOREIGN KEY (sub_budget_id) REFERENCES sub_budgets (id) ON DELETE CASCADE -- Relation to sub-budgets
    );

-- ========================================================
-- Indexes for Query Optimization
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_incomes_sub_budget_id ON incomes (sub_budget_id);

CREATE INDEX IF NOT EXISTS idx_expenses_sub_budget_id ON expenses (sub_budget_id);

CREATE INDEX IF NOT EXISTS idx_sub_budgets_category_id ON sub_budgets (category_id);

-- ========================================================
-- Views for Frequent Queries
-- ========================================================
-- View: Total Income and Expenses for Each Category (Excludes Deleted Items)
CREATE VIEW
    IF NOT EXISTS category_totals AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    COALESCE(SUM(i.amount), 0) AS total_incomes,
    COALESCE(SUM(e.amount), 0) AS total_expenses
FROM
    categories c
    LEFT JOIN sub_budgets sb ON c.id = sb.category_id
    AND sb.is_deleted = 0
    LEFT JOIN incomes i ON sb.id = i.sub_budget_id
    AND i.is_deleted = 0
    LEFT JOIN expenses e ON sb.id = e.sub_budget_id
    AND e.is_deleted = 0
WHERE
    c.is_deleted = 0
GROUP BY
    c.id;

-- View: Total Income and Expenses for Each Sub-Budget (Excludes Deleted Items)
CREATE VIEW
    IF NOT EXISTS sub_budget_totals AS
SELECT
    sb.id AS sub_budget_id,
    sb.name AS sub_budget_name,
    sb.category_id,
    COALESCE(SUM(i.amount), 0) AS total_incomes,
    COALESCE(SUM(e.amount), 0) AS total_expenses
FROM
    sub_budgets sb
    LEFT JOIN incomes i ON sb.id = i.sub_budget_id
    AND i.is_deleted = 0
    LEFT JOIN expenses e ON sb.id = e.sub_budget_id
    AND e.is_deleted = 0
WHERE
    sb.is_deleted = 0
GROUP BY
    sb.id;

-- ========================================================
-- Trigger: Soft Delete Sub-Budgets and Related Transactions for Category
-- ========================================================
CREATE TRIGGER IF NOT EXISTS soft_delete_subbudgets_and_transactions AFTER
UPDATE OF is_deleted ON categories WHEN NEW.is_deleted = 1 BEGIN
-- Soft delete sub-budgets linked to the deleted category
UPDATE sub_budgets
SET
    is_deleted = 1,
    deleted_at = CURRENT_TIMESTAMP
WHERE
    category_id = NEW.id
    AND is_deleted = 0;

-- Soft delete incomes linked to sub-budgets of the deleted category
UPDATE incomes
SET
    is_deleted = 1,
    deleted_at = CURRENT_TIMESTAMP
WHERE
    sub_budget_id IN (
        SELECT
            id
        FROM
            sub_budgets
        WHERE
            category_id = NEW.id
    )
    AND is_deleted = 0;

-- Soft delete expenses linked to sub-budgets of the deleted category
UPDATE expenses
SET
    is_deleted = 1,
    deleted_at = CURRENT_TIMESTAMP
WHERE
    sub_budget_id IN (
        SELECT
            id
        FROM
            sub_budgets
        WHERE
            category_id = NEW.id
    )
    AND is_deleted = 0;

END;

-- ========================================================
-- Trigger: Soft Delete Incomes and Expenses for Sub-Budget
-- ========================================================
CREATE TRIGGER IF NOT EXISTS soft_delete_incomes_expenses AFTER
UPDATE OF is_deleted ON sub_budgets WHEN NEW.is_deleted = 1 BEGIN
-- Soft delete incomes linked to the deleted sub-budget
UPDATE incomes
SET
    is_deleted = 1,
    deleted_at = CURRENT_TIMESTAMP
WHERE
    sub_budget_id = NEW.id
    AND is_deleted = 0;

-- Soft delete expenses linked to the deleted sub-budget
UPDATE expenses
SET
    is_deleted = 1,
    deleted_at = CURRENT_TIMESTAMP
WHERE
    sub_budget_id = NEW.id
    AND is_deleted = 0;

END;