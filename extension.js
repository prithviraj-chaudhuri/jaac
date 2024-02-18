// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');


// This method is called when your extension is activated

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('Congratulations, your extension "jaac" is now active!');

	// Create a new disposable for creating a README File
	// let newDisposable = vscode.commands.registerCommand('jaac.writeReadme', function (){
	// 	const wsedit = new vscode.WorkspaceEdit();
	// 	const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
	// 	const filePath = vscode.Uri.file(wsPath + '/README2.md');
	// 	const writeStr = '# Hello World!';
	// 	const writeData = Buffer.from(writeStr, 'utf8');
	// 	vscode.window.showInformationMessage(filePath.toString());
	// 	wsedit.createFile(filePath, { ignoreIfExists: true });
	// 	vscode.workspace.fs.writeFile(filePath, writeData);
	// 	vscode.workspace.applyEdit(wsedit);
	// 	vscode.window.showInformationMessage('Created a new file: README2.md');
	// });

	const md = { scheme: 'file', language: 'markdown' };
	const md_provider = vscode.languages.registerCompletionItemProvider(md, {

		async provideCompletionItems(document, position, token, context) {
			let title = "Sample"

			const snippetCompletion = new vscode.CompletionItem('Title');
			snippetCompletion.insertText = new vscode.SnippetString("This is a test string");
			return [
				snippetCompletion
			];
		}
	});

	context.subscriptions.push(md_provider);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
