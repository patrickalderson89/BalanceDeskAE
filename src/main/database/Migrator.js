const fs = require("fs/promises");
const path = require("path");

class Migrator {
    constructor(db) {
        this.db = db.db;
        this.queryHelper = db.queryHelper;
        this.migrationsPath = db.migrationsPath;
        this.rollbacksPath = db.rollbacksPath;
    }

    /**
     * Apply all pending migrations.
     */
    async applyMigrations() {
        const currentVersion = await this.getCurrentVersion();
        const migrationFiles = await this.getMigrationFiles();

        for (const file of migrationFiles) {
            const version = this.extractVersionFromFilename(file);

            if (version > currentVersion) {
                const migrationSQL = await fs.readFile(
                    path.join(this.migrationsPath, file),
                    "utf8"
                );

                // Extract the description by removing version numbers and extension
                const description = file.replace(/^\d+_/, '').replace(".sql", '');

                await this.queryHelper.execSQL(migrationSQL);
                await this.setCurrentVersion(version, description);
            }
        }
    }

    /**
     * Rollback the last migration.
     */
    async rollback() {
        const currentVersion = await this.getCurrentVersion();
        if (currentVersion === 0) throw new Error("No migrations to rollback.");

        const rollbackFile = await this.getRollbackFile(currentVersion);
        const rollbackSQL = await fs.readFile(
            path.join(this.rollbacksPath, rollbackFile),
            "utf8"
        );
        await this.queryHelper.execSQL(rollbackSQL);
        await this.setCurrentVersion(currentVersion - 1);
    }

    /**
     * Retrieve the current database version.
     */
    async getCurrentVersion() {
        const query = `SELECT version FROM db_version ORDER BY version DESC LIMIT 1;`;
        return new Promise((resolve, reject) => {
            this.db.get(query, (err, row) => {
                if (err) reject(new Error("Error fetching current version."));
                else resolve(row ? row.version : 0);
            });
        });
    }

    /**
     * Set the current database version.
     */
    async setCurrentVersion(version, description) {
        const query = `INSERT INTO db_version (version, description) VALUES (${version}, '${description}');`;
        await this.queryHelper.execSQL(query);
    }

    /**
     * Get all migration files sorted by version.
     */
    async getMigrationFiles() {
        const files = await fs.readdir(this.migrationsPath);
        return files.sort();
    }

    /**
     * Get the rollback file for a specific version.
     */
    async getRollbackFile(version) {
        const files = await fs.readdir(this.rollbacksPath);
        const rollbackFile = files.find((file) =>
            file.startsWith(String(version).padStart(3, "0"))
        );
        if (!rollbackFile)
            throw new Error(`Rollback file not found for version ${version}`);
        return rollbackFile;
    }

    /**
     * Extract the version number from the filename.
     */
    extractVersionFromFilename(filename) {
        const match = filename.match(/^(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
    }
}

module.exports = Migrator;
