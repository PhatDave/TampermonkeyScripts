const fs = require("fs");
const simpleGit = require('simple-git');
const path = require("path");

const excludedFiles = ["gitUpdate.js"];
class Logger {
	constructor(clazz) {
		this.clazz = clazz;
		this.logLevel = typeof LOG_LEVEL !== "undefined" ? LOG_LEVEL : 6;
		this.logFile = typeof LOG_FILE !== "undefined" ? LOG_FILE : null;

		this.logFileWriteStream = null;
		if (this.logFile != null) {
			this.logFileWriteStream = fs.createWriteStream(this.logFile, {flags: 'a'});
		}
	}

	leftPad(str, len, char) {
		str = String(str);
		let i = -1;
		len = len - str.length;
		if (char === undefined) {
			char = " ";
		}
		while (++i < len) {
			str = char + str;
		}
		return str;
	}

	log(...args) {
		let logLevel = args.at(0);
		let data = args.at(1);
		let date = new Date();

		let year = this.leftPad(date.getFullYear(), 4);
		let month = this.leftPad(date.getMonth(), 2, 0);
		let day = this.leftPad(date.getDay(), 2, 0);

		let hours = this.leftPad(date.getHours(), 2, 0);
		let minutes = this.leftPad(date.getMinutes(), 2, 0);
		let seconds = this.leftPad(date.getSeconds(), 2, 0);
		let milliseconds = this.leftPad(date.getMilliseconds(), 3, 0);

		let datePrefix = `[${day}/${month}/${year}-${hours}:${minutes}:${seconds}:${milliseconds}]`

		// let out = `${datePrefix} [${this.clazz}] (${logLevel}) ${data}`;
		let out = datePrefix.padEnd(30, ' ') + `[${this.clazz}]`.padEnd(28, ' ') + `(${logLevel})`.padEnd(8, ' ') + data;
		if (args[0] <= this.logLevel || 6) {
			console.log(out);
		}
		if (this.logFileWriteStream != null) {
			this.logFileWriteStream.write(out + "\n");
		}
	}

	log1 = this.log.bind(this, 1);
	log2 = this.log.bind(this, 2);
	log3 = this.log.bind(this, 3);
	log4 = this.log.bind(this, 4);
	log5 = this.log.bind(this, 5);
	log6 = this.log.bind(this, 6);
}

[
	'debug',
	'log',
	'warn',
	'error'
].forEach((methodName) => {
	const originalLoggingMethod = console[methodName];
	console[methodName] = (firstArgument, ...otherArguments) => {
		const originalPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (_, stack) => stack;
		const callee = new Error().stack[2];
		Error.prepareStackTrace = originalPrepareStackTrace;
		const relativeFileName = path.relative(process.cwd(), callee.getFileName());
		// const prefix = `${relativeFileName}:${callee.getLineNumber()}:`;
		const prefix = `${callee.getLineNumber()}:`;
		if (typeof firstArgument === 'string') {
			originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
		} else {
			originalLoggingMethod(prefix, firstArgument, ...otherArguments);
		}
	};
})

let logger = new Logger("Main");

simpleGit().status((err, status) => {
	logger.log1(`Checking for git update`);
	status.modified.forEach((file) => {
		if (file.endsWith(".js") && !excludedFiles.includes(file)) {
			logger.log1(`Updating version for ${file}`);
			let fileData = fs.readFileSync(file, 'utf8').split("\n");
			for (let i = 0; i < fileData.length; i++) {
				let line = fileData[i];
				let regExpArray = /@version(\s*)(\d+)\.(\d+)/.exec(line);
				if (regExpArray) {
					let spaces = regExpArray[1];
					let majorVersion = regExpArray[2];
					let minorVersion = regExpArray[3];
					logger.log1(`Found version ${majorVersion}.${minorVersion}`);
					minorVersion++;
					fileData[i] = `// @version${spaces}${majorVersion}.${minorVersion}`;
					logger.log1(`Updated version to ${majorVersion}.${minorVersion}`);
				}
			}
			logger.log1(`Writing file ${file}`);
			fs.writeFileSync(file, fileData.join("\n"));
		}
	});
}).then(async () => {
	logger.log1("Adding changes");
	await simpleGit().add('./*');
	logger.log1("Committing changes");
	await simpleGit().commit("Auto commit");
	logger.log1("Pushing changes");
	await simpleGit().push();
	logger.log1("Done");
});
