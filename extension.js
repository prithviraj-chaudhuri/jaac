// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const { exec } = require('child_process');

const generateText = async (input) => {
	return new Promise((resolve, reject) => {

		const workSpacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

		exec('/Users/prithvirajchaudhuri/Desktop/Other/Projects/jaac/venv/bin/python '
		+'/Users/prithvirajchaudhuri/Desktop/Other/Projects/jaac/processor/process.py'
		+' --input="'+input+'"'
		+' --doc="'+workSpacePath+'"', (err, stdout, stderr) => {
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

const executeGenerationCommand = (relative_pos) => {
	let text = '';
	let range = null;
	if (editor.selection.isSingleLine) {
		const line = editor.document.lineAt(editor.selection.active);
		text = line.text;
		range = line.range;
	} else {
		text = editor.document.getText(editor.selection);
		range = new vscode.Range(editor.selection.start, editor.selection.end);
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Window,
		cancellable: false,
		title: 'Generating doc'
	}, async (progress) => {
		progress.report({  increment: 0 });

		const generatedText = await generateText(text);
		const snippet = new vscode.SnippetString();
		if (relative_pos == "above") {
			snippet.appendText(generatedText+"\n"+text);
		} else {
			snippet.appendText(text+"\n"+generatedText);
		}
		editor.insertSnippet(snippet, range);
		
		progress.report({ increment: 100 });
	});
}

// This method is called when your extension is activated
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('"Jaac" is active!');

	//Right click menu with text selected generate doc above
	const generate_docs_above_provider = vscode.commands.registerCommand(
		"jaac.generate-doc-above",
		async () => {
			executeGenerationCommand("above")
		}
	);
	
	context.subscriptions.push(generate_docs_above_provider);

	//Right click menu with text selected generate doc below
	const generate_doc_below_provider = vscode.commands.registerCommand(
		"jaac.generate-doc-below",
		async () => {
			executeGenerationCommand("below")
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
