class SimpleORM {
    constructor(db) {
        this.db = db;
    }

    async execute(sql, params = []) {
        return new Promise((resolve, reject) => {
            const method = params.length > 0 ? "run" : "exec";
            this.db[method](sql, ...[params].flat(), (err, result) => {
                if (err) return reject(err);
                resolve(result || true); // `exec` doesn't return a result, so resolve `true` for consistency
            });
        });
    }

    // Insert a new record into the table
    async insert(tableName, data) {
        const columns = Object.keys(data).join(", ");
        const placeholders = Object.keys(data).map(() => "?").join(", ");
        const values = Object.values(data);
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;
        await this.execute(sql, values);
    }

    // Select records with optional conditions
    async select(tableName, conditions = {}, columns = ["*"]) {
        const columnList = columns.join(", ");
        let sql = `SELECT ${columnList} FROM ${tableName}`;
        const conditionKeys = Object.keys(conditions);

        if (conditionKeys.length > 0) {
            const whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, Object.values(conditions), (err, rows) => {
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
        await this.execute(sql, values);
    }

    // Delete records based on conditions
    async delete(tableName, conditions) {
        const conditionClause = Object.keys(conditions).map(key => `${key} = ?`).join(" AND ");
        const sql = `DELETE FROM ${tableName} WHERE ${conditionClause};`;
        await this.execute(sql, Object.values(conditions));
    }

    // Count rows with optional conditions
    async count(tableName, conditions = {}) {
        let sql = `SELECT COUNT(*) AS count FROM ${tableName}`;
        const conditionKeys = Object.keys(conditions);

        if (conditionKeys.length > 0) {
            const whereClause = conditionKeys.map(key => `${key} = ?`).join(" AND ");
            sql += ` WHERE ${whereClause}`;
        }

        return new Promise((resolve, reject) => {
            this.db.get(sql, Object.values(conditions), (err, row) => {
                if (err) return reject(err);
                resolve(row.count);
            });
        });
    }
}

module.exports = SimpleORM;