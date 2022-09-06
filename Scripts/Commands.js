const util = require("util.js");

// TODO: Implement automatic formatting on save

/**
 * Formats the current file.
 */
exports.format = async function(editor) {
    if (!TextEditor.isTextEditor(editor)) return
    await editor.save();

    const formatter = nova.workspace.config.get("beancount.formatter", "string") || nova.config.get("beancount.formatter", "string");

    let bin;
    let args = [];
    if (formatter === "bean-black") {
        bin = util.resolveExecutable("bean-black");
        args.push("--no-backup");
    } else if (formatter === "bean-format") {
        bin = util.resolveExecutable("bean-format");
        args.push("--output");
        args.push(editor.document.path);
    } else {
        throw "Unknown Formatter: " + formatter;
    }
    args.push(editor.document.path);
    const {stdout, stderr, exitCode} = await util.runProcess(bin, {
        args,
        shell: nova.environment.SHELL,
        cwd: nova.workspace?.path
    });
    if (exitCode != 0) {
        const request = new NotificationRequest("beancount-formatting-error");
        request.title = nova.localize("File could not be formatted");
        request.body = nova.localize("The file contains a syntax error and was not formatted.");
        await nova.notifications.add(request);
    }
};
