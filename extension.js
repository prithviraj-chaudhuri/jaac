// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jaac-test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jaac-test.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from VSCode!');
	});

	context.subscriptions.push(disposable);

	// Create a new disposable for creating a README File
	let newDisposable = vscode.commands.registerCommand('jaac-test.writeReadme', function (){
		const wsedit = new vscode.WorkspaceEdit();
		const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
		const filePath = vscode.Uri.file(wsPath + '/README2.md');
		const writeStr = '# Hello World!';
		const writeData = Buffer.from(writeStr, 'utf8');
		vscode.window.showInformationMessage(filePath.toString());
		wsedit.createFile(filePath, { ignoreIfExists: true });
		vscode.workspace.fs.writeFile(filePath, writeData);
		vscode.workspace.applyEdit(wsedit);
		vscode.window.showInformationMessage('Created a new file: README2.md');
	});

	context.subscriptions.push(newDisposable);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
