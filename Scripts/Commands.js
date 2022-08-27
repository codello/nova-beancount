const util = require("util.js");

// TODO: Implement automatic formatting on save

/**
 * Formats the current file via bean-black.
 */
exports.formatBeanBlack = async function(editor) {
    if (!TextEditor.isTextEditor(editor)) return
    await editor.save();

    const bin = util.resolveExecutable("bean-black");
    const {stdout, stderr, exitCode} = await util.runProcess(bin, {
        args: ["--no-backup", editor.document.path],
        shell: nova.environment.SHELL,
        cwd: nova.workspace?.path
    });
    if (exitCode != 0) {
        const request = new NotificationRequest("bean-black-formatting-error");
        request.title = nova.localize("File could not be formatted");
        request.body = nova.localize("The file contains a syntax error and was not formatted.");
        await nova.notifications.add(request);
    }
};
