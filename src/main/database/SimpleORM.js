class SimpleORM {
    constructor(db) {
        this.db = db;
    }

    // Insert a new record into the table
    async insert(tableName, data) {
        const columns = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(() => "?").join(", ");
        const values = Object.values(data);
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) return reject(err);
                resolve({ lastID: this.lastID });
            });
        });
    }

    // Select records with optional conditions
    async select(tableName, conditions = {}, columns = ["*"], deleted = false) {
        if (!deleted) {
            conditions["is_deleted"] = 0;
        }

        const columnList = columns.join(", ");
        let sql = `SELECT ${columnList} FROM ${tableName}`;
        const conditionKeys = Object.keys(conditions);
        const values = Object.values(conditions);

        if (conditionKeys.length > 0) {
            const whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // Update records based on conditions
    async update(tableName, data, conditions) {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(", ");
        const conditionClause = Object.keys(conditions).map(key => `${key} = ?`).join(" AND ");
        const values = [...Object.values(data), ...Object.values(conditions)];
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${conditionClause};`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            });
        });
    }

    // Delete records based on conditions
    async delete(tableName, conditions) {
        const conditionClause = Object.keys(conditions).map(key => `${key} = ?`).join(" AND ");
        const sql = `DELETE FROM ${tableName} WHERE ${conditionClause};`;
        const values = Object.values(conditions);

        return new Promise((resolve, reject) => {
            this.db.run(sql, values, function (err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            });
        });
    }

    // Count rows with optional conditions
    async count(tableName, conditions = {}, deleted = false) {
        if (!deleted) {
            conditions["is_deleted"] = 0;
        }

        let sql = `SELECT COUNT(*) AS count FROM ${tableName}`;
        const conditionKeys = Object.keys(conditions);
        const values = Object.values(conditions);

        if (conditionKeys.length > 0) {
            const whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        return new Promise((resolve, reject) => {
            this.db.get(sql, values, (err, row) => {
                if (err) return reject(err);
                resolve(row.count);
            });
        });
    }

    // Fetch totals for all categories or a specific category by ID
    async getCategoryTotals(ID = null) {
        let sql = `SELECT * FROM category_totals`;
        const params = [];

        if (ID !== null) {
            sql += ` WHERE category_id = ?`;
            params.push(ID);
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    // Fetch totals for all sub-budgets or a specific sub-budget by ID
    async getSubBudgetTotals(ID = null) {
        let sql = `SELECT * FROM sub_budget_totals`;
        const params = [];

        if (ID !== null) {
            sql += ` WHERE sub_budget_id = ?`;
            params.push(ID);
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}

module.exports = SimpleORM;