"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const utils_1 = require("./utils");
exports.update = async (payload) => {
    const logger = bunyan_1.default.createLogger({
        name: 'mrf-updater',
        src: true
    });
    const repos = utils_1.getRepos(payload, logger);
    const reposWithActiveTenants = await utils_1.getReposWithActiveTenants(repos);
    logger.info(`mrf-updater called with params: ${repos}`);
    process.env.REPOS = reposWithActiveTenants.join(',');
    require('renovate/dist/renovate');
};
//# sourceMappingURL=index.js.map