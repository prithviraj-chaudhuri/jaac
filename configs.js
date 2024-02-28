const vscode = require('vscode');

// Default Extensions to exclude
const extensionsInclude = [
    'py',
    'java',
    'html',
    'css'
];

// Loading all settings from .vscode/settings.json
let settings = vscode.workspace.getConfiguration('jaac');

let configs = {
    DATA_SYNC_CRON_SCHEDULE : '* * * * *',
    STATUS_OK : 201,
    ABOVE : 'above',
    BELOW : 'below',
    ERROR : 'error',
    SERVICE_HOST : 'http://127.0.0.1:5000',

    // Configs from settings.json
    MODEL_PATH : settings.get('modelPath') || '',
    EMBEDDING : settings.get('embedding') || '',
    DB_PATH : settings.get('dbPath') || '',
    PROMPT_YAML_PATH : settings.get('promptYamlPath') || '',
    EXTENSIONS_TO_INCLUDE : settings.get('extensionsInclude') || extensionsInclude,

    // Configs from vscode workspace
    WORKSPACE_PATH : vscode.workspace.workspaceFolders[0].uri.fsPath
};

module.exports = {
    configs
};