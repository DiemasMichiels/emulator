const { window } = require('vscode');
const { runCmd } = require('./utils/commands');
const { showSuccessMessage, showErrorMessage } = require('./utils/message');
const { IOS_COMMANDS } = require('./constants');

// Get iOS devices and pick one
exports.iOSPick = () => {
  const simulators = getIOSSimulators();
  if (simulators) {
    window.showQuickPick(simulators).then(response => {
      if (response) {
        const ranSimulator = runIOSSimulator(response);
        if (ranSimulator) {
          showSuccessMessage();
        } else {
          showErrorMessage();
        }
      }
    });
  }
}

const getIOSSimulators = async () => {
  let { stdout } = await runCmd(IOS_COMMANDS.LIST_SIMULATORS);
  return stdout && stdout
    .trim()
    .split('\n')
    .filter(s => s.includes('Simulator'))
    .map(s => s.replace(/ *\([^)]*\) */g, '')) || false;
};

const runIOSSimulator = async simulator => {
  const uuid = simulator.match(/\[(.*?)\]/g)[0].replace(/[\[\]']+/g, '');
  let { stdout } = await runCmd(IOS_COMMANDS.RUN_SIMULATOR + uuid);
  return stdout || false
};
