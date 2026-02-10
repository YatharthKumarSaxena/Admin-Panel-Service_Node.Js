/**
 * Get My Environment Variable
 * Cleaner way to access environment variables
 * 
 * @param {String} key - Environment variable key
 * @param {String} defaultValue - Default value if not found
 * @returns {String} Environment variable value or default
 */
const getMyEnv = (key, defaultValue = '') => {
    return process.env[key] || defaultValue;
};

module.exports = {
    getMyEnv
};
