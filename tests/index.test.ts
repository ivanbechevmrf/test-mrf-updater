import { update } from '../src/index';
import { createLogger } from 'bunyan';

jest.mock('bunyan');

const renovateSpy = jest.fn();
const loggerInfoSpy = jest.fn();
const createLoggerMock = createLogger as jest.Mock;


createLoggerMock.mockImplementation(() => ({
	info: loggerInfoSpy
}));

jest.mock('renovate/dist/renovate', () => {
	(function(): void {
		renovateSpy();
	})();
});

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

describe('update', () => {
	test('creates logger with correct parameters', async() => {
		await update(mockPayload);

		expect(createLoggerMock).toHaveBeenCalledWith({
			name: 'mrf-updater',
			src: true
		});
	});

	test('logs info with the correct message', async() => {
		await update(mockPayload);

		expect(loggerInfoSpy).toHaveBeenCalledWith(
			`mrf-updater called with params: ${JSON.parse(body).repos}`
		);
	});

	test('sets property REPOS in process.env', async() => {
		await update(mockPayload);

		expect(process.env.REPOS).toEqual(JSON.parse(body).repos.join(','));
	});
});
