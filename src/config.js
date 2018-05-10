const { workspace } = require('vscode');

const config = () => {
	return workspace.getConfiguration('emulator');
}

exports.emulatorPath = () => { 
  return config().get('emulatorPath');
}