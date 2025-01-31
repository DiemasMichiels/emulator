const { window } = require('vscode')
const { runCmd } = require('./utils/commands')
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
        simulator: s,
      }))

      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0]
        if (selected) {
          quickPick.busy = true
          quickPick.items = [
            {
              label: `Starting ${selected.label}...`,
              simulator: selected.simulator,
            },
          ]

          await runIOSSimulator(selected.simulator)

          quickPick.items = [
            {
              label: `✓ Started ${selected.label}!`,
              simulator: selected.simulator,
            },
          ]
          quickPick.busy = false

          setTimeout(() => quickPick.dispose(), 2000)
        }
      })

      quickPick.onDidHide(() => quickPick.dispose())
    } else {
      quickPick.dispose()
    }
  } catch (error) {
    quickPick.dispose()
    window.showErrorMessage(error.toString())
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
    window.showErrorMessage(
      `Error fetching your iOS simulators! Make sure you have Xcode installed. Try running this command: ${IOS_COMMANDS.LIST_SIMULATORS}`,
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

    if (simulator.state !== 'Booted') {
      // If simulator isn't running, boot it up
      await runCmd(IOS_COMMANDS.BOOT_SIMULATOR + simulator.udid)
    }

    await runCmd(
      'open ' + developerDir + IOS_COMMANDS.SIMULATOR_ARGS + simulator.udid
    )
    
    return
  } catch (e) {
    window.showErrorMessage(
      `Error running you iOS simulator! Try running this command: ${
        'open ' + developerDir.trim() + IOS_COMMANDS.RUN_SIMULATOR + simulator
      }`,
    )
    return false
  }
}