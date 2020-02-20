import { EventPayload } from '../src/index.d';
import * as Logger from 'bunyan';
export declare const getRepos: (payload: EventPayload, logger: Logger) => string[];
export declare const getReposWithActiveTenants: (mediagroupRepos: string[]) => Promise<string[]>;
