const { window } = require('vscode')
const { runCmd } = require('./utils/commands')
const { showErrorMessage } = require('./utils/message')
const { IOS_COMMANDS } = require('./constants')

// Get iOS devices and pick one
exports.iOSPick = async () => {
  const simulators = await getIOSSimulators()
  if (simulators) {
    const formattedSimulators = simulators.map(s => ({
      label: s.replace(/\[(.*)/g, ''),
      simulator: s
    }))
    window.showQuickPick(formattedSimulators).then(async response => {
      if (response) {
        const ranSimulator = await runIOSSimulator(response.simulator)
      }
    })
  }
}

const getIOSSimulators = async () => {
  try {
    const res = await runCmd(IOS_COMMANDS.LIST_SIMULATORS)
    return (
      (res &&
        res
          .trim()
          .split('\n')
          .filter(s => s.includes('Simulator'))) ||
      false
    )
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong fetching you iOS simulators! Make sure you have Xcode installed. Try running this command in your terminal: ${
        IOS_COMMANDS.LIST_SIMULATORS
      }`
    )
    return false
  }
}

const runIOSSimulator = async simulator => {
  const uuid = simulator.match(/\[(.*?)\]/g)[0].replace(/[[\]']+/g, '')

  try {
    const res = await runCmd(IOS_COMMANDS.RUN_SIMULATOR + uuid)
    return res || false
  } catch (e) {
    if (!e.toString().includes('//instrumentscli0.trace')) {
      showErrorMessage(e.toString())
      showErrorMessage(
        `Something went wrong running you iOS simulator! Try running this command in your terminal: ${IOS_COMMANDS.RUN_SIMULATOR +
          uuid}`
      )
      return false
    } else {
      return true
    }
  }
}
