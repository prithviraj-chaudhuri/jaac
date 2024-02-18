// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const util = require('util');
const { exec } = require('child_process');

const generateText = async (input) => {
	return new Promise((resolve, reject) => {
		exec('/Users/prithvirajchaudhuri/Desktop/Other/Projects/jaac/venv/bin/python /Users/prithvirajchaudhuri/Desktop/Other/Projects/jaac/processor/process.py --input="'+input+'"', (err, stdout, stderr) => {
			if (err) {
			  resolve(err);
			} else {
				resolve(stdout);
			}
		});
	}).then(response => {
		return response;
	});
}

const getText = () => {
	let text = '';
	if (editor.selection.isSingleLine) {
		const line = editor.document.lineAt(editor.selection.active);
		text = line.text;
	} else {
		text = editor.document.getText(editor.selection);
	}
	return text;
}

// This method is called when your extension is activated
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('Congratulations, your extension "jaac" is now active!');

	// const md = { scheme: 'file', language: 'markdown' };
	// const md_provider = vscode.languages.registerCompletionItemProvider(md, {

	// 	async provideCompletionItems(document, position, token, context) {

	// 		// Get Text entered in the line
	// 		const line = document.lineAt(position.line);
	// 		console.log(line.text);

	// 		// Generate docs here
	// 		const snippetCompletion = new vscode.CompletionItem('Generate docs');
	// 		var response = await getResponse();
	// 		snippetCompletion.insertText = new vscode.SnippetString('\n'+response);
	// 		return [
	// 			snippetCompletion
	// 		];

	// 	}

	// });

	// context.subscriptions.push(md_provider);

	//Right click menu with text selected generate doc above
	const generate_docs_above_provider = vscode.commands.registerCommand(
		"jaac.generate-doc-above",
		async () => {
			const text = getText();
			const generatedText = await generateText(text);
			const snippet = new vscode.SnippetString();
			snippet.appendText(generatedText+"\n"+text);
			editor.insertSnippet(snippet);
		}
	);
	
	context.subscriptions.push(generate_docs_above_provider);

	//Right click menu with text selected generate doc below
	const generate_doc_below_provider = vscode.commands.registerCommand(
		"jaac.generate-doc-below",
		async () => {
			const text = getText();
			const generatedText = await generateText(text);
			const snippet = new vscode.SnippetString();
			snippet.appendText(text+"\n"+generatedText);
			editor.insertSnippet(snippet);
		}
	);
	
	context.subscriptions.push(generate_doc_below_provider);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
