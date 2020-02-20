import {
	getRepos
} from '../src/utils';
import { createLogger } from 'bunyan';

jest.mock('bunyan');

const loggerErrorSpy = jest.fn();
const createLoggerMock = createLogger as jest.Mock;

createLoggerMock.mockImplementation(() => ({
	error: loggerErrorSpy
}));


const body = JSON.stringify({
	repos: [
		'repo_one',
		'repo_two',
		'repo_three'
	]
});

const mockPayload = {
	body
};

describe('getRepos', () => {
	test('returns a parsed string of the repos', () => {
		expect(getRepos(mockPayload, createLoggerMock())).toEqual(JSON.parse(body).repos);
	});

	test('logs error, if the parsing throws error', () => {
		const invalidPayload = {
			body: '{"repos"":["repo_one","repo_two","repo_three"]}'
		};

		const expectedLogErrorArgs = {
			msg: 'unable to parse payload',
			payload: invalidPayload,
			err: new SyntaxError('Unexpected string in JSON at position 8')
		};


		getRepos(invalidPayload, createLoggerMock());

		expect(loggerErrorSpy).toHaveBeenCalledWith(expectedLogErrorArgs);
	});
});
