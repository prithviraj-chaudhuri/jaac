const vscode = require('vscode');
const dataSyncCron = require('node-cron');
const { runPythonCommand } = require('./helper')

const schedule = '* * * * *';
const workSpacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

dataSyncCron.schedule(schedule, () => {
    console.log("Running cron to update vector db");

    vscode.window.withProgress({
	location: vscode.ProgressLocation.Window,
	cancellable: false,
	title: 'Syncing project'
	}, async (progress) => {
		progress.report({  increment: 0 });

        runPythonCommand(workSpacePath);

        progress.report({ increment: 100 });
    });
});

module.exports = {
    dataSyncCron
};