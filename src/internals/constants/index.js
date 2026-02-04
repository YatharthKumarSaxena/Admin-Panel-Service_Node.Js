/**
 * Internal Constants Barrel Export
 * 
 * @author Admin Panel Service Team
 * @date 2026-01-29
 */

const guard = require('../microservice.guard');
if (!guard) {
    module.exports = null;
    return;
}

module.exports = {
    ...require('./service.constants')
};