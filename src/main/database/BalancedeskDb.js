const sqlite3 = require("sqlite3").verbose();
const fs = require("fs/promises");
const path = require("path");
const Migrator = require("./Migrator");
const SimpleORM = require("./SimpleORM");

class BalancedeskDb {
    constructor(dbName) {
        this.dbName = dbName;
        this.dbPath = path.join(__dirname, "sql", `${dbName}.db`);
        this.schemaPath = path.join(__dirname, "sql", "schema.sql");
        this.migrationsPath = path.join(__dirname, "sql", "migrations");
        this.rollbacksPath = path.join(__dirname, "sql", "rollbacks");
        this.db = null; // Holds the database instance
        this.migrator = null; // Holds the Migrator instance
        this.orm = null; // Holds the SimpleORM instance
    }

    /**
     * Initialize the SQLite database and run migrations.
     */
    async init() {
        try {
            const dbExists = await this.databaseFileExists();
            this.db = new sqlite3.Database(this.dbPath);
            this.migrator = new Migrator(this.db, this.migrationsPath, this.rollbacksPath);
            this.orm = new SimpleORM(this.db);

            if (!dbExists) {
                await this.initializeDatabase();
            }

            // Initialize migrator and apply migrations
            await this.migrator.applyMigrations();
            return true;
        } catch (err) {
            // Check if the database file exists and delete it if there was an error during initialization
            try {
                await this.close(); // Close the database connection if it was opened
                await fs.unlink(this.dbPath); // Delete the partially created database file
            } catch (deleteErr) {
                // Throw error during cleanup
                throw new Error(`Error during database file cleanup: ${deleteErr.message}`);
            }

            throw new Error(`Error initializing database "${this.dbName}": ${err.message}`);
        }
    }

    /**
     * Check if the database file exists.
     */
    async databaseFileExists() {
        try {
            await fs.access(this.dbPath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Initialize the database schema.
     */
    async initializeDatabase() {
        try {
            const schema = await fs.readFile(this.schemaPath, "utf8");
            await this.orm.execute(schema);
            await this.migrator.setCurrentVersion('0', "init_schema");
        } catch (err) {
            throw new Error(`Error initializing database schema: ${err.message}`);
        }
    }

    /**
     * Close the database connection.
     */
    async close() {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        reject(new Error(`Error closing database: ${err.message}`));
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    /**
     * Rollback the last migration.
     */
    async rollback() {
        if (this.migrator) {
            try {
                await this.migrator.rollback();
            } catch (err) {
                throw new Error(`Error during rollback: ${err.message}`);
            }
        } else {
            throw new Error("Migrator not initialized.");
        }
    }
}

module.exports = new BalancedeskDb("balancedesk");
