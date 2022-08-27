/**
 * Resolves a user provided path to an absolute path. This includes tilde
 * expansion and resolution of relative paths.
 */
exports.resolvePath = function(path) {
    if (!path) return null;
    path = nova.path.expanduser(path);
    if (nova.path.isAbsolute(path)) {
        return path;
    }
    return nova.path.join(nova.workspace.path, path);
}

/**
 * Resolves a Beancount executable. The executable may potentially live
 * alongside the python interpreter in a virtualenv.
 */
exports.resolveExecutable = function(name) {
    const interpreter = exports.resolvePath(
        nova.workspace.config.get("beancount.interpreter", "string") ?? nova.workspace.config.get("python.interpreter", "string")
    );
    if (!interpreter) return name;

    const path = nova.path.join(nova.path.dirname(interpreter), name);
    return nova.fs.stat(path) ? path : name;
};

/**
 * Escapes the given string for inclusion as a shell argument.
 */
exports.escapeShell = function(cmd) {
    return '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
};

/**
 * Runs a process with the given cmd and options. This function returns a
 * promise that resolves to the stdout, stderr and exitCode of the process.
 *
 * Optionally it is possible to pass a string value as stdin to the process.
 */
exports.runProcess = function(cmd, opts, stdin = null) {
    return new Promise((resolve, reject) => {
        try {
            const p = new Process(cmd, opts);
            let stdout = "";
            let stderr = "";
            p.onStdout(line => stdout += line)
            p.onStderr(line => stderr += line);
            p.onDidExit(code => {
                resolve({
                    stdout,
                    stderr,
                    exitCode: code
                });
            });
            p.start();
            if (stdin) {
                const writer = p.stdin.getWriter();
                writer.ready.then(() => {
                    writer.write(stdin);
                    writer.close();
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}
