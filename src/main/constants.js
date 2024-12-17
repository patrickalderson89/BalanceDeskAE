const path = require("path");

const SRC_PATH = path.join(__dirname, "..");
const MAIN_PROCESS_PATH = __dirname;
const RENDERER_PROCESS_PATH = path.join(SRC_PATH, "renderer");

// Export the constants
module.exports = {
    SRC_PATH,
    MAIN_PROCESS_PATH,
    RENDERER_PROCESS_PATH
};
