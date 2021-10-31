const { window } = require('vscode')
const { runCmd } = require('./utils/commands')
const { showErrorMessage } = require('./utils/message')
const { IOS_COMMANDS } = require('./constants')

// Get iOS devices and pick one
exports.iOSPick = async () => {
  const simulators = await getIOSSimulators()
  if (simulators) {
    const formattedSimulators = simulators.map((s) => ({
      label: `${s.name} (${s.udid})`,
      simulator: s.udid,
    }))
    window.showQuickPick(formattedSimulators).then(async (response) => {
      if (response) {
        const ranSimulator = await runIOSSimulator(response.simulator)
      }
    })
  }
}

const getIOSSimulators = async () => {
  try {
    const res = await runCmd(IOS_COMMANDS.LIST_SIMULATORS)
    const { devices } = JSON.parse(res);
    return Object.keys(devices).reduce((array, item) => {
        if (devices[item].length > 0) {
          return [...array, ...devices[item]];
        }
        return array;
    }, []).filter((item) => item.isAvailable);
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong fetching you iOS simulators! Make sure you have Xcode installed. Try running this command in your terminal: ${IOS_COMMANDS.LIST_SIMULATORS}`,
    )
    return false
  }
}

const runIOSSimulator = async (simulator) => {
  try {
    const developerdir = await runCmd(IOS_COMMANDS.DEVELOPER_DIR);
    const res = await runCmd('open ' + developerdir.trim() + IOS_COMMANDS.RUN_SIMULATOR + simulator)
    return res || false
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong running you iOS simulator! Try running this command in your terminal: ${
        'open ' + developerdir.trim() + IOS_COMMANDS.RUN_SIMULATOR + simulator
      }`,
    )
    return false
  }
}
