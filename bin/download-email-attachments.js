#!/usr/bin/env node
// console.log('process.argv:', process.argv);

const onlyArguments = process.argv.slice(2);
const argv = require('minimist')(onlyArguments, {});
// console.dir(argv);

const account = argv._[0];
const directory = argv.directory; // argv['directory'];
const filenameFilter = argv['filename-filter'] && new RegExp(argv['filename-filter']);
const filenameTemplate = argv['filename-template'];
const since = argv['since'];
const timeout = argv['timeout'];

const config = {
	// ssl: true, // Shouldn't it be true by default ?
	account,
	directory,
	filenameTemplate,
	filenameFilter,
	since,
	timeout,
	// Pass different consoles
	log: {
		info: console.info,
		warn: console.warn,
		debug: console.debug,
		error: console.error,
	},
};

const downloadEmailAttachments = require('../index.js');

downloadEmailAttachments(config, function(error) {
	if (error) {
		console.log(JSON.stringify(error, null, 2));
	}
	console.log('done');
	process.exit(0);
});
