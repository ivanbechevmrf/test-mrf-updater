import bunyan from 'bunyan';
import {
	getRepos,
	getReposWithActiveTenants
} from './utils';
import { EventPayload } from './index.d';

export const update = async(payload: EventPayload): Promise<void> => {
	const logger = bunyan.createLogger({
		name: 'mrf-updater',
		src: true
	});
	const repos = getRepos(payload, logger);
	const reposWithActiveTenants =  await getReposWithActiveTenants(repos);

	logger.info(`mrf-updater called with params: ${repos}`);

	process.env.REPOS = reposWithActiveTenants.join(',');

	require('renovate/dist/renovate');
};
