const vscode = require('vscode');
const cron = require('node-cron');
const { runPythonCommand, callLlmApi, callDataSyncApi } = require('./helper')
const { configs } = require('./configs');
const editor = vscode.window.activeTextEditor;

/**
 * Function to run data sync from code base
 */
const runDataSync = () => {
	console.log('Running cron to update vector db');

    vscode.window.withProgress({
	location: vscode.ProgressLocation.Window,
	cancellable: false,
	title: 'Syncing project'
	}, async (progress) => {
		progress.report({  increment: 0 });
        const response = await callDataSyncApi(configs.EMBEDDING, configs.WORKSPACE_PATH, configs.DB_PATH);
		if (response.status !== configs.STATUS_OK) {
			vscode.window.showErrorMessage('Could not sync source code, there was an error');
		}
        progress.report({ increment: 100 });
    });
}

/**
 * Function to generate the docstring based on the selected text
 */
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

		const response = await callLlmApi(configs.MODEL_PATH, configs.EMBEDDING, configs.DB_PATH, configs.PROMPT_YAML_PATH, text.trim());
		if (response.status !== configs.STATUS_OK) {
			vscode.window.showErrorMessage('Could not generate documentation, there was an error');
		} else {
			const generatedText = response.data.answer;
			const snippet = new vscode.SnippetString();
			if (relative_pos == configs.ABOVE) {
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
 * Function to start the flast server
 */
const startFLaskServer = (extensionPath) => {
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

	let extensionPath = context.extensionPath;
	
	startFLaskServer(extensionPath);
	cron.schedule(configs.DATA_SYNC_CRON_SCHEDULE, runDataSync);

	//Right click menu with text selected generate doc above
	const generate_docs_above_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-above',
		async () => {
			generateDoc(configs.ABOVE)
		}
	);
	
	context.subscriptions.push(generate_docs_above_provider);

	//Right click menu with text selected generate doc below
	const generate_doc_below_provider = vscode.commands.registerCommand(
		'jaac.generate-doc-below',
		async () => {
			generateDoc(configs.BELOW)
		}
	);
	
	context.subscriptions.push(generate_doc_below_provider);

}

/**
 * Function called when extension is deactivated
 */
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
