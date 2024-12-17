const sqlite3 = require("sqlite3").verbose();
const fs = require("fs/promises");
const path = require("path");

class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.dbPath = path.join(__dirname, "sql", dbName, `${dbName}.db`);
        this.schemaPath = path.join(__dirname, "sql", dbName, "schema.sql");
        this.db = null; // Holds the database instance
    }

    /**
     * Initialize the SQLite database.
     */
    async init() {
        try {
            // Check if the database file exists
            const dbExists = await this.databaseFileExists();

            // Open the database
            this.db = new sqlite3.Database(this.dbPath);

            // If the database file is newly created, initialize it with schema
            if (!dbExists) {
                console.log(`Initializing database ${this.dbName}...`);
                await this.initializeDatabase();
                console.log(`Database ${this.dbName} initialized successfully.`);
            }

            return this.db; // Return the database instance
        } catch (err) {
            throw new Error(`Error initializing database "${this.dbName}": ${err.message}`);
        }
    }

    /**
    * Check if the database file exists.
    * @returns {Promise<boolean>} - Returns true if the file exists, false otherwise.
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
            // Read the schema SQL file
            const schema = await fs.readFile(this.schemaPath, "utf8");

            // Execute the schema SQL to initialize the database
            await new Promise((resolve, reject) => {
                this.db.exec(schema, (err) => {
                    if (err) {
                        reject(new Error(`Error executing schema for "${this.dbName}": ${err.message}`));
                    } else {
                        resolve();
                    }
                });
            });
        } catch (err) {
            throw new Error(`Error reading schema for "${this.dbName}": ${err.message}`);
        }
    }

    /**
     * Close the database connection.
     */
    async close() {
        try {
            if (this.db) {
                await new Promise((resolve, reject) => {
                    this.db.close((err) => {
                        if (err) {
                            reject(new Error(`Error closing database "${this.dbName}": ${err.message}`));
                        } else {
                            resolve();
                        }
                    });
                });
                this.db = null; // Clear the database instance
            } else {
                throw new Error(`Database "${this.dbName}" is not initialized.`);
            }
        } catch (err) {
            throw new Error(`Error closing database "${this.dbName}": ${err.message}`);
        }
    }

    /**
     * Return the SQLite database instance.
     * @returns {sqlite3.Database} - The database instance.
     */
    getDb() {
        if (!this.db) {
            throw new Error(`Database "${this.dbName}" is not initialized.`);
        }
        return this.db;
    }
}

module.exports = Database;
