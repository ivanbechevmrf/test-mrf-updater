"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.getRepos = (payload, logger) => {
    let repos;
    try {
        repos = JSON.parse(payload.body).repos;
    }
    catch (err) {
        logger.error({
            msg: 'unable to parse payload',
            payload: payload,
            err: err
        });
    }
    return repos;
};
const isMediagroupWithActiveTennats = (tenants) => tenants.some(({ toggleFeatures: { features } }) => features.useMarfeelXPAsALibrary);
exports.getReposWithActiveTenants = async (mediagroupRepos) => {
    const mediagroupsWithActiveTenants = [];
    const setUrl = (repository) => `https://insight.marfeel.com/hub/insight/mediaGroup/${repository}/tenants`;
    const queryPromises = mediagroupRepos.map(async (mediagroupRepo) => {
        const response = await node_fetch_1.default(setUrl(mediagroupRepo), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'mrf-secret-key': 'JDJhJDEwJG5yQmRVYVBia3ZJZkVOd2ovUmxsMi5HSDJoZE1NbnhKQlpoODVNTG0xUXNibjRTYjloNi55'
            }
        });
        const mediaGroupTenants = await response.json();
        if (isMediagroupWithActiveTennats(mediaGroupTenants)) {
            mediagroupsWithActiveTenants.push(mediagroupRepo);
        }
    });
    await Promise.all(queryPromises);
    return Promise.resolve(mediagroupsWithActiveTenants);
};
//# sourceMappingURL=utils.js.map