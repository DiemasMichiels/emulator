const { runCmd } = require('./commands');
const { IOS_COMMANDS } = require('../constants');

exports.getIOSSimulators = async () => {
  let { stdout } = await runCmd(IOS_COMMANDS.LIST_SIMULATORS);
  return stdout
    .trim()
    .split('\n')
    .filter(s => s.includes('Simulator'))
    .map(s => s.replace(/ *\([^)]*\) */g, ''));
};

exports.runIOSSimulator = async simulator => {
  const uuid = simulator.match(/\[(.*?)\]/g)[0].replace(/[\[\]']+/g, '');
  let { stdout } = await runCmd(IOS_COMMANDS.RUN_SIMULATOR + uuid);
  return stdout
};
