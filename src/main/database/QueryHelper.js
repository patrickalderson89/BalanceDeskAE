class QueryHelper {
    constructor(db) {
        this.db = db;
    }

    /**
     * Execute a SQL query.
     */
    async execSQL(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) reject(new Error(`Error executing SQL: ${err.message}`));
                else resolve();
            });
        });
    }
}

// Exporting the class instead of just execSQL function
module.exports = QueryHelper;
