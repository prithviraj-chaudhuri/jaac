const { exec } = require('child_process');
const { configs } = require('./configs');
const axios = require('axios');


/**
 * Function to run a python command
 */
const runPythonCommand = async (path, command) => {
	return new Promise((resolve, reject) => {
		exec(
			path+'/venv/bin/python '
			+path
			+command, 
			(err, stdout, stderr) => {
				if (err) {
					console.error(err);
					resolve(configs.ERROR);
				} else if (stderr) {
					console.error(stderr);
					resolve(stdout);
				}
			}
		);
	}).then(response => {
		return response;
	});
}

/**
 * Function to call the llmapi to generate doc
 */
const callLlmApi = async (modelPath, embeddings, db_path, prompt_yaml_path, input) => {
	const body = {
		model_path : modelPath,
		embedding : embeddings,
        db_path : db_path,
		prompt_yaml_path : prompt_yaml_path,
		query : input
	};
	const response = await axios.post(configs.SERVICE_HOST+'/process', body);
	return response;
}

/**
 * Function to call data sync api
 */
const callDataSyncApi = async (embeddings, workSpacePath, db_path) => {
	const body = {
		embedding : embeddings,
		doc_path : workSpacePath,
		db_path : db_path
	};
	const response = await axios.put(configs.SERVICE_HOST+'/data', body);
	return response;
}

module.exports = {
    runPythonCommand,
    callLlmApi,
    callDataSyncApi
};