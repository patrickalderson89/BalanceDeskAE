const path = require("path");

// Import all database instances
const entitiesDb = require(path.join(__dirname, "entities"));
const appSettingsDb = require(path.join(__dirname, "app_settings"));

module.exports = {
    entitiesDb,
    appSettingsDb,
};
