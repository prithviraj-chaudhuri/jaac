const { exec } = require('child_process');
const axios = require('axios');

const ERROR = 'error';

const runPythonCommand = async (path, command) => {
	return new Promise((resolve, reject) => {
		exec(
			path+'/venv/bin/python '
			+path
			+command, 
			(err, stdout, stderr) => {
				if (err) {
					console.error(err);
					resolve(ERROR);
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

const callLlmApi = async (modelPath, embeddings, db_path, prompt_yaml_path, input) => {
	const body = {
		model_path : modelPath,
		embedding : embeddings,
        db_path : db_path,
		prompt_yaml_path : prompt_yaml_path,
		query : input
	};
	const response = await axios.post('http://127.0.0.1:5000/process', body);
	return response;
}

const callDataSyncApi = async (embeddings, workSpacePath, db_path) => {
	const body = {
		embedding : embeddings,
		doc_path : workSpacePath,
		db_path : db_path
	};
	const response = await axios.put('http://127.0.0.1:5000/data', body);
	return response;
}

module.exports = {
    runPythonCommand,
    callLlmApi,
    callDataSyncApi
};