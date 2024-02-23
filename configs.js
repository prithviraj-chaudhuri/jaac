const vscode = require('vscode');

// Loading all settings from .vscode/settings.json
let settings = vscode.workspace.getConfiguration('jaac'),

configs = {
    DATA_SYNC_CRON_SCHEDULE : '* * * * *',
    STATUS_OK : 201,
    ABOVE : 'above',
    BELOW : 'below',
    ERROR : 'error',
    SERVICE_HOST : 'http://127.0.0.1:5000',
    MODEL_PATH : settings.get('modelPath') || '',
    EMBEDDING : settings.get('embedding') || '',
    DB_PATH : settings.get('dbPath') || '',
    PROMPT_YAML_PATH : settings.get('promptYamlPath') || '',
    WORKSPACE_PATH : vscode.workspace.workspaceFolders[0].uri.fsPath
};

module.exports = {
    configs
};