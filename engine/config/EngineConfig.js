/**
 * Controlled configuration map for the engine
 */
class EngineConfig {
    constructor(config) {
        this.redisUrl = config.redisUrl
    }
}

module.exports = EngineConfig