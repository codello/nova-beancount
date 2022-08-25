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
