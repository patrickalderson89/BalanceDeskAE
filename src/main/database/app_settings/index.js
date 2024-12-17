const Database = require("../db");  // Import the base class

class AppSettings extends Database {
    constructor() {
        super("app_settings"); // Pass the database name to the base class constructor
    }
}

module.exports = new AppSettings(); // Export a singleton instance
