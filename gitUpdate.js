const exec = require('child_process').exec;

function execute(command, callback) {
	exec(command, function(error, stdout, stderr) {
		callback(stdout);
	});
}

execute('git status', (out) => {
	if (out.includes("nothing to commit, working tree clean")) {
		console.log("Nothing to commit, working tree clean");
		process.exit(0);
	}

	if (out.includes("Changes not staged for commit") || out.includes("Untracked files")) {
		execute('git add -A', (out) => {
			console.log("Found modified files, doing commit...");
			execute('git commit -m "Update"', (out) => {
				console.log("Successfully made commit");
				console.log("Pushing changes...");
				execute("git push", (out) => {
					console.log("Pushed commit to remote");
					console.log(out);
					process.exit(0);
				});
			});
		});
	} else {
		console.log("How did I get here?");
		console.log(out);
		process.exit(1);
	}
});
