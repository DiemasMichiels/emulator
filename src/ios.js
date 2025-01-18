const { window, ProgressLocation } = require('vscode')
const { runCmd } = require('./utils/commands')
const { showErrorMessage } = require('./utils/message')
const { IOS_COMMANDS } = require('./constants')
const { simulatorPath } = require('./config')

// Get iOS devices and pick one
exports.iOSPick = async () => {
  // Create and show QuickPick with loading state
  const quickPick = window.createQuickPick()
  quickPick.placeholder = 'Loading iOS simulators...'
  quickPick.busy = true
  quickPick.show()

  try {
    const simulators = await getIOSSimulators()

    if (simulators) {
      quickPick.busy = false
      quickPick.placeholder = 'Select iOS simulator'
      quickPick.items = simulators.map((s) => ({
        label: `${s.name} (${s.udid})`,
        simulator: s.udid,
      }))

      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0]
        if (selected) {
          quickPick.hide()

          // Show progress indicator while launching simulator
          await window.withProgress(
            {
              location: ProgressLocation.Notification,
              title: `Launching iOS simulator: ${selected.label}`,
              cancellable: false,
            },
            async () => {
              const result = await runIOSSimulator(selected.simulator)
              if (result !== false) {
                window.showInformationMessage(
                  `Started simulator: ${selected.label}`,
                )
              }
            },
          )
        }
      })

      quickPick.onDidHide(() => quickPick.dispose())
    } else {
      quickPick.dispose()
    }
  } catch (error) {
    quickPick.dispose()
    showErrorMessage(error.toString())
  }
}

const getIOSSimulators = async () => {
  try {
    const res = await runCmd(IOS_COMMANDS.LIST_SIMULATORS)
    const { devices } = JSON.parse(res)
    return Object.keys(devices)
      .reduce((array, item) => {
        if (devices[item].length > 0) {
          return [...array, ...devices[item]]
        }
        return array
      }, [])
      .filter((item) => item.isAvailable)
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
    let developerDir
    const configPath = simulatorPath()
    const xcodePath = await runCmd(IOS_COMMANDS.DEVELOPER_DIR)

    if (configPath) {
      developerDir = configPath
    } else {
      developerDir = xcodePath.trim() + IOS_COMMANDS.SIMULATOR_APP
    }

    const res = await runCmd(
      'open ' + developerDir + IOS_COMMANDS.SIMULATOR_ARGS + simulator,
    )
    return res || false
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong running you iOS simulator! Try running this command in your terminal: ${
        'open ' + developerDir.trim() + IOS_COMMANDS.RUN_SIMULATOR + simulator
      }`,
    )
    return false
  }
}
