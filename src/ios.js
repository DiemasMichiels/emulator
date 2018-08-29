const { window } = require('vscode');
const { runCmd } = require('./utils/commands');
const { showSuccessMessage, showErrorMessage } = require('./utils/message');
const { IOS_COMMANDS } = require('./constants');

// Get iOS devices and pick one
exports.iOSPick = async () => {
  const simulators = await getIOSSimulators();
  if (simulators) {
    const formattedSimulators = simulators.map(s => ({ label: s.replace(/\[(.*)/g, ''), simulator: s }))
    window.showQuickPick(formattedSimulators).then(response => {
      if (response) {
        const ranSimulator = runIOSSimulator(response.simulator);
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
