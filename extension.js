const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const { exec } = require('child_process');

const ERROR = 'error';
const ABOVE = 'above';
const BELOW = 'below';

let extensionPath = '';

const settings = vscode.workspace.getConfiguration('jaac');

const modelPath = settings.get('modelPath') || '';
const embeddings = settings.get('embeddings') || '';
const prompt_yaml_path = settings.get('prompt_yaml_path') || '';

const generateText = async (input) => {
	return new Promise((resolve, reject) => {

		const workSpacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

		exec(
			extensionPath+'/venv/bin/python '
			+extensionPath+'/processor/process.py'
			+' --input="'+input+'"'
			+' --doc="'+workSpacePath+'"'
			+' --model_path="'+modelPath+'"'
			+' --embedding="'+embeddings+'"'
			+' --prompt_yaml_path="'+prompt_yaml_path+'"', 
			(err, stdout, stderr) => {
				if (err) {
					console.error(err);
					resolve(ERROR);
				} else if (stderr) {
					console.error(stderr);
					const substring = '[1m> Finished chain.[0m\n';
					const output = stdout.substring(stdout.indexOf(substring) + substring.length) || '';
					resolve(output);
				}
			}
		);
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

		const generatedText = await generateText(text.trim());
		if (generatedText === ERROR) {
			vscode.window.showErrorMessage('Could not generate documentation, there was an error');
		} else {
			const snippet = new vscode.SnippetString();
			if (relative_pos == ABOVE) {
				snippet.appendText(generatedText+'\n'+text);
			} else {
				snippet.appendText(text+'\n'+generatedText);
			}
			editor.insertSnippet(snippet, range);
		}

		progress.report({ increment: 100 });
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('"Jaac" is active!');
	extensionPath = context.extensionPath;

	//Right click menu with text selected generate doc above
	const generate_docs_above_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-above',
		async () => {
			executeGenerationCommand(ABOVE)
		}
	);
	
	context.subscriptions.push(generate_docs_above_provider);

	//Right click menu with text selected generate doc below
	const generate_doc_below_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-below',
		async () => {
			executeGenerationCommand(BELOW)
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
