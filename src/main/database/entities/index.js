const Database = require("../db");  // Import the base class

class Entities extends Database {
    constructor() {
        super("entities"); // Pass the database name to the base class constructor
    }
}

module.exports = new Entities(); // Export a singleton instance
