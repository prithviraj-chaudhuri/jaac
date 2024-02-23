const vscode = require('vscode');
const cron = require('node-cron');
const { runPythonCommand, callLlmApi, callDataSyncApi } = require('./helper')
const editor = vscode.window.activeTextEditor;

const dataSyncCronSchedule = '* * * * *';

const STATUS_OK = 201;
const ABOVE = 'above';
const BELOW = 'below';

let extensionPath = '';
let workSpacePath = '';

const settings = vscode.workspace.getConfiguration('jaac');
const modelPath = settings.get('modelPath') || '';
const embeddings = settings.get('embeddings') || '';
const db_path = settings.get('db_path') || '';
const prompt_yaml_path = settings.get('prompt_yaml_path') || '';

const runDataSync = () => {
	console.log('Running cron to update vector db');

    vscode.window.withProgress({
	location: vscode.ProgressLocation.Window,
	cancellable: false,
	title: 'Syncing project'
	}, async (progress) => {
		progress.report({  increment: 0 });
        callDataSyncApi(embeddings, workSpacePath, db_path);
        progress.report({ increment: 100 });
    });
}

const generateDoc = (relative_pos) => {
	console.log('Starting doc generation');

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

		const response = await callLlmApi(modelPath, embeddings, db_path, prompt_yaml_path, text.trim());
		if (response.status !== STATUS_OK) {
			vscode.window.showErrorMessage('Could not generate documentation, there was an error');
		} else {
			const generatedText = response.data.answer;
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

const startFLaskServer = () => {
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Window,
		cancellable: false,
		title: 'Starting llm service'
	}, async (progress) => {
		progress.report({  increment: 0 });
		runPythonCommand(extensionPath, '/processor/api.py');
		progress.report({ increment: 100 });
	});
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('"Jaac" is active!');

	extensionPath = context.extensionPath;
	workSpacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
	
	startFLaskServer();
	cron.schedule(dataSyncCronSchedule, runDataSync);

	//Right click menu with text selected generate doc above
	const generate_docs_above_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-above',
		async () => {
			generateDoc(ABOVE)
		}
	);
	
	context.subscriptions.push(generate_docs_above_provider);

	//Right click menu with text selected generate doc below
	const generate_doc_below_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-below',
		async () => {
			generateDoc(BELOW)
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
