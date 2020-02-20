import { EventPayload } from '../src/index.d';
import * as Logger from 'bunyan';
import fetch from 'node-fetch'

export const getRepos = (payload: EventPayload, logger: Logger): string[] => {
	let repos;

	try {
		repos = JSON.parse(payload.body).repos;
	} catch (err) {
		logger.error({
			msg: 'unable to parse payload',
			payload: payload,
			err: err
		});
	}

	return repos;
}

const isMediagroupWithActiveTennats = (tenants: any): boolean =>
	tenants.some(({ toggleFeatures: { features }}: { toggleFeatures: { features: any }}) =>
		features.useMarfeelXPAsALibrary);

export const getReposWithActiveTenants = async(mediagroupRepos: string[]): Promise<string[]> => {
	const mediagroupsWithActiveTenants: string[] = [];
	const setUrl = (repository: string): string => `https://insight.marfeel.com/hub/insight/mediaGroup/${repository}/tenants`;

	const queryPromises = mediagroupRepos.map(async(mediagroupRepo: string): Promise<void> => {
		const response = await fetch(
			setUrl(mediagroupRepo),
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'mrf-secret-key': 'JDJhJDEwJG5yQmRVYVBia3ZJZkVOd2ovUmxsMi5HSDJoZE1NbnhKQlpoODVNTG0xUXNibjRTYjloNi55'
				}
			}
		)
		const mediaGroupTenants = await response.json();

		if (isMediagroupWithActiveTennats(mediaGroupTenants)) {
			mediagroupsWithActiveTenants.push(mediagroupRepo)
		}
	})

	await Promise.all(queryPromises);

	return Promise.resolve(mediagroupsWithActiveTenants);
};
