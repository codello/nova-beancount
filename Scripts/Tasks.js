const util = require("util.js");

/**
 * The fava task runs a Fava webserver.
 */
exports.fava = {
    resolveTaskAction(context) {
        const config = context.config;
        if (context.action != Task.Run) {
            throw "Task fava is only valid for the run stage."
        }

        const journal = nova.workspace.config.get("beancount.journal", "string");
        let files = config.get("fava.files", "array") ?? [];
        if (!files && !journal) {
          throw "No journal files specified.";
        } else if (files.length == 0) {
          files = [journal];
        }

        // Resolve fava executable
        const bin = util.resolveExecutable("fava");
        // Port and custom flags
        const args = [
            "--port", config.get("fava.port", "string") ?? "5000",
            ...config.get("fava.custom-args", "array") ?? []
        ];

        // Journal files
        args.push(...files);
        return new TaskProcessAction(bin, {
            args,
            shell: nova.environment.SHELL,
            cwd: nova.workspace.path
        });
    }
}

/**
 * The Beancount task runs the Beancount import process.
 */
exports.beancount = {
    async resolveTaskAction(context) {
        const config = context.config;
        const configFile = util.resolvePath(nova.workspace.config.get("beancount.config", "string"));
        const sources = config.get("beancount.sources", "array").map(file => util.resolvePath(file));
        const documents = config.get("beancount.documents", "string");
        const journal = nova.workspace.config.get("beancount.journal", "string");
        const reverse = config.get("beancount.extract-reverse", "boolean");
        const outputFile = config.get("beancount.destination") ?? journal;

        if (!configFile) {
            throw "No configuration specified. A config file must be set in the extension's workspace settings."
        }
        if (!sources) {
            throw "No sources specified. You need to configure the sources from which transactions will be loaded."
        }

        if (context.action == Task.Build) {
            const bin = util.resolveExecutable("bean-identify");
            return new TaskProcessAction(bin, {
                args: [configFile, ...sources],
                shell: nova.environment.SHELL,
                cwd: nova.workspace.path
            });
        } else if (context.action == Task.Run) {
            if (!outputFile) {
                throw "No output file specified."
            }

            const bin = util.resolveExecutable("bean-extract");
            const args = [];

            if (journal) {
                args.push("--existing", journal);
            }
            if (reverse) {
                args.push("--reverse");
            }
            args.push(configFile, ...sources);

            const escapedArgs = args.map(util.escapeShell);
            let script = `${util.escapeShell(bin)} ${escapedArgs.join(" ")}`
            if (reverse) {
                script += ` | cat - ${util.escapeShell(outputFile)} > /tmp/bc-journal.tmp && mv /tmp/bc-journal.tmp ${util.escapeShell(outputFile)}`;
            } else {
                script += ` >> ${util.escapeShell(outputFile)}`
            }
            return new TaskProcessAction("/bin/sh", {
                args: ["-c", script],
                shell: nova.environment.SHELL,
                cwd: nova.workspace.path
            });
        }
        // TODO: Maybe add filing as a clean step
    }
}
