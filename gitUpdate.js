const fs = require("fs");
const simpleGit = require('simple-git');

const excludedFiles = ["gitUpdate.js"];

function log(line) {
	let date = new Date();
	date.setHours(date.getHours() + 2);

	let out = `[${date.getDay()}/${date.getMonth()}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] ${line}`;
	console.log(out);
}

simpleGit().status((err, status) => {
	log(`Checking for git update`);
	status.modified.forEach((file) => {
		if (file.endsWith(".js") && !excludedFiles.includes(file)) {
			log(`Updating version for ${file}`);
			let fileData = fs.readFileSync(file, 'utf8').split("\n");
			for (let i = 0; i < fileData.length; i++) {
				let line = fileData[i];
				let regExpArray = /@version(\s*)(\d+)\.(\d+)/.exec(line);
				if (regExpArray) {
					let spaces = regExpArray[1];
					let majorVersion = regExpArray[2];
					let minorVersion = regExpArray[3];
					log(`Found version ${majorVersion}.${minorVersion}`);
					minorVersion++;
					fileData[i] = `// @version${spaces}${majorVersion}.${minorVersion}`;
					log(`Updated version to ${majorVersion}.${minorVersion}`);
				}
			}
			log(`Writing file ${file}`);
			fs.writeFileSync(file, fileData.join("\n"));
		}
	});
}).then(async () => {
	log("Adding changes");
	await simpleGit().add('./*');
	log("Committing changes");
	await simpleGit().commit("Auto commit");
	log("Pushing changes");
	await simpleGit().push();
	log("Done");
});
