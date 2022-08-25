const util = require("util.js");

/**
 * The Beancount issue assistant
 */
exports.beancount = {
    provideIssues(editor) {
        return new Promise((resolve, reject) => {
            const journal = nova.workspace?.config.get("beancount.journal", "string") ?? nova.workspace.activeTextEditor?.document.path;
            const bin = util.resolveExecutable("bean-check");
            try {
                const p = new Process(bin, {
                    args: [journal],
                    shell: nova.environment.SHELL,
                    cwd: nova.workspace?.path
                });
                const parser = new IssueParser("bean-check");
                p.onStdout(line => parser.pushLine(line));
                p.onStderr(line => parser.pushLine(line));
                p.onDidExit(code => resolve(parser.issues));
                p.start();
            } catch (err) {
                console.log("Could not run bean-check: " + err);
                reject("Could not run bean-check: " + err);
            }
        });
    }
};
