const fs = require("fs");
const simpleGit = require('simple-git');

const excludedFiles = ["gitUpdate.js"];

simpleGit().status((err, status) => {
	status.modified.forEach((file) => {
		if (file.endsWith(".js") && !excludedFiles.includes(file)) {
			let fileData = fs.readFileSync(file, 'utf8').split("\n");
			for (let i = 0; i < fileData.length; i++) {
				let line = fileData[i];
				let regExpArray = /@version(\s*)(\d+)\.(\d+)/.exec(line);
				if (regExpArray) {
					let spaces = regExpArray[1];
					let majorVersion = regExpArray[2];
					let minorVersion = regExpArray[3];
					minorVersion++;
					fileData[i] = `// @version${spaces}${majorVersion}.${minorVersion}`;
				}
			}
			fs.writeFileSync(file, fileData.join("\n"));
		}
	});
}).then(() => {
	simpleGit().add('./*').commit("Auto commit").push();
});

// execute('git status', (out) => {
// 	if (out.includes("nothing to commit, working tree clean")) {
// 		console.log("Nothing to commit, working tree clean");
// 		process.exit(0);
// 	}
//
// 	// console.log(out);
// 	out.split("\n").forEach((line) => {
// 		if (/modified:\s*\w+\.js/.exec(line)) {
// 			let modifiedFile = /modified:\s*(\w+\.js)/.exec(line)
// 			modifiedFile = modifiedFile[1];
// 			if (modifiedFile === "gitUpdate.js") {
// 				return null;
// 			}
//
// 			let fileData = fs.readFileSync(modifiedFile, 'utf8');
// 			let fileDataLines = fileData.split("\n");
// 			for (let i = 0; i < fileDataLines.length; i++) {
// 				let line = fileDataLines[i];
// 				if (/@version\s*\d+\.\d+/.exec(line)) {
// 					let version = /(.+@version\s*\d+\.)(\d+)/.exec(line);
// 					let minorVersion = version[2];
// 					minorVersion++;
// 					version = version[1] + minorVersion;
// 					fileDataLines[i] = version;
// 					`Updating version from ${line} to ${version}`;
// 					break;
// 				}
// 			}
// 			fileData = fileDataLines.join("\n");
// 			// console.log(fileData);
// 			fs.writeFileSync(modifiedFile, fileData);
// 		}
// 	});
// 	if (out.includes("Changes not staged for commit") || out.includes("Untracked files")) {
// 		execute('git add -A', (out) => {
// 			console.log("Found modified files, doing commit...");
// 			execute('git commit -m "Update"', (out) => {
// 				console.log("Successfully made commit");
// 				console.log("Pushing changes...");
// 				execute("git push", (out) => {
// 					console.log("Pushed commit to remote");
// 					console.log(out);
// 					process.exit(0);
// 				});
// 			});
// 		});
// 	} else {
// 		console.log("How did I get here?");
// 		console.log(out);
// 		process.exit(1);
// 	}
// });
