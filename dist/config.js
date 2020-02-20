module.exports = {
	platform: 'github',
	token: process.env.NPM_TOKEN,
	repositories: process.env.REPOS.split(','),
	logLevel: 'debug',
	requireConfig: true,
	onboarding: true,
	enabledManagers: [
		'npm',
	]
  };
