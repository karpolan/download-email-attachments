const DEFAULT_PORT = 993;
const DEFAULT_TARGET = './files';
const DEFAULT_FILENAME_TEMPLATE = '{filename}';
const DEFAULT_TIMEOUT = 1000;

const normalizeDirectoryPath = require('./lib/helpers/normalize-directory-path');
const parseImapAccountString = require('./lib/helpers/parse-imap-account-string');

const findEmails = require('./lib/find-emails');

module.exports = function(config, callback) {
	// console.log('index() config:', config);

	// Note: "$" signs in password should be escaped as "\$"
	const account = typeof config.account === 'string' ? parseImapAccountString(config.account) : config.account;
	const directory = config.directory ? normalizeDirectoryPath(config.directory) : DEFAULT_TARGET;
	// The "since" should be set as a valide Date value
	const since = config.since ? new Date(config.since) : 0; // Since 01 January, 1970 UTC by default

	const args = {
		invalidChars: config.invalidChars || /[^A-Za-z\d-_\.]/g, // /a^/g for everything
		username: account.username,
		password: account.password,
		attachmentHandler: config.attachmentHandler,
		host: account.host,
		port: account.port || DEFAULT_PORT,
		directory: directory,
		filenameTemplate: config.filenameTemplate || DEFAULT_FILENAME_TEMPLATE,
		filenameFilter: config.filenameFilter,
		since,
		keepalive: config.keepalive,
		lastSyncId: config.lastSyncId || 0,
		uidvalidity: config.uidvalidity,
		timeout: config.timeout || DEFAULT_TIMEOUT,
		log: config.log || console, // Used as args.log.info(), args.log.error(), and so on.
	};

	if (config.ssl === false) {
		args.ssl = false;
	} else {
		args.ssl = true;
	}

	args.log.info(`Downloading attachments for "${args.username}" account to "${args.directory}" folder...`);

	findEmails(args, callback);
};
