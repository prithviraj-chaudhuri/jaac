// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const getResponse = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
		resolve("This is a test response");
		}, 1000);
	}).then(response => {
		return response;
	});
}

// This method is called when your extension is activated

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('Congratulations, your extension "jaac" is now active!');

	const md = { scheme: 'file', language: 'markdown' };
	const md_provider = vscode.languages.registerCompletionItemProvider(md, {

		async provideCompletionItems(document, position, token, context) {

			// Get Text entered in the line
			const line = document.lineAt(position.line);
			console.log(line.text);

			// Generate docs here
			const snippetCompletion = new vscode.CompletionItem('Generate docs');
			var response = await getResponse();
			snippetCompletion.insertText = new vscode.SnippetString('\n'+response);
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
