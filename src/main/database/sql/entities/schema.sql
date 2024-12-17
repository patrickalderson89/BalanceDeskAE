-- ========================================================
-- SQLite Optimized Schema for Budget Management Application
-- ========================================================
-- Database Versioning Table
CREATE TABLE
    IF NOT EXISTS db_version (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        description TEXT,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- ========================================================
-- Categories Table
-- A category groups sub-budgets.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE, -- Unique name
        description TEXT DEFAULT '', -- Short descriptions
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- 0 means not deleted, 1 means deleted
        deleted_at DATETIME, -- Timestamp for soft deletion
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- ========================================================
-- Sub-Budgets Table
-- Sub-budgets belong to a category and can have incomes/expenses.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS sub_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL, -- Foreign key to categories
        name TEXT NOT NULL, -- Name can repeat across categories
        description TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- 0 means not deleted, 1 means deleted
        deleted_at DATETIME, -- Timestamp for soft deletion
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

-- ========================================================
-- Incomes Table
-- Represents all income transactions for sub-budgets.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sub_budget_id INTEGER NOT NULL, -- Foreign key to sub_budgets
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        source TEXT DEFAULT '', -- "From" field
        amount REAL NOT NULL, -- Using REAL for monetary values
        payment_type TEXT CHECK (payment_type IN ('cash', 'bank')),
        transaction_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- 0 means not deleted, 1 means deleted
        deleted_at DATETIME, -- Timestamp for soft deletion
        FOREIGN KEY (sub_budget_id) REFERENCES sub_budgets (id) ON DELETE CASCADE
    );

-- ========================================================
-- Expenses Table
-- Represents all expense transactions for sub-budgets.
-- ========================================================
CREATE TABLE
    IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sub_budget_id INTEGER NOT NULL, -- Foreign key to sub_budgets
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        recipient TEXT DEFAULT '', -- "To" field
        amount REAL NOT NULL, -- Monetary value
        payment_type TEXT CHECK (payment_type IN ('cash', 'bank')),
        transaction_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0 CHECK (is_deleted IN (0, 1)), -- 0 means not deleted, 1 means deleted
        deleted_at DATETIME, -- Timestamp for soft deletion
        FOREIGN KEY (sub_budget_id) REFERENCES sub_budgets (id) ON DELETE CASCADE
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
-- 1. View to Get Total Income and Expenses for Each Sub-Budget
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
    LEFT JOIN expenses e ON sb.id = e.sub_budget_id
GROUP BY
    sb.id;

-- Usage:
-- SELECT * FROM sub_budget_totals WHERE sub_budget_id = ?;
-- 2. View to Get Total Income and Expenses for Each Category
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
    LEFT JOIN incomes i ON sb.id = i.sub_budget_id
    LEFT JOIN expenses e ON sb.id = e.sub_budget_id
GROUP BY
    c.id;