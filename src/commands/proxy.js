const {proxyToUv} = require('../core/python/package');

module.exports = async () => {
    try {
        await proxyToUv();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
