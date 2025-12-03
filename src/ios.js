const { window } = require('vscode')
const { runCmd } = require('./utils/commands')
const { IOS_COMMANDS } = require('./constants')
const { simulatorPath } = require('./config')

// Get iOS devices and pick iOS version first, then device
exports.iOSPick = async () => {
  // Create and show QuickPick with loading state
  const quickPick = window.createQuickPick()
  quickPick.placeholder = 'Loading iOS simulators...'
  quickPick.busy = true
  quickPick.show()

  try {
    const simulators = await getIOSSimulators()

    if (!simulators || simulators.length === 0) {
      quickPick.dispose()
      window.showWarningMessage('No iOS simulators found.')
      return
    }

    // Stage state: first pick version (if multiple), then pick device
    let stage = 'version'
    let selectedVersion = null

    // Prepare version list
    const versions = Array.from(new Set(simulators.map((s) => s.version))).sort()

    quickPick.busy = false

    if (versions.length === 1) {
      // Skip version selection UI, go straight to devices for that version
      stage = 'device'
      selectedVersion = versions[0]
      const devicesForVersion = simulators.filter(
        (s) => s.version === selectedVersion,
      )

      if (devicesForVersion.length === 0) {
        quickPick.dispose()
        window.showWarningMessage(
          `No devices found for iOS ${selectedVersion}.`,
        )
        return
      }

      quickPick.placeholder = 'Select iOS simulator device'
      quickPick.items = devicesForVersion.map((s) => ({
        label: s.name,
        description: `(${s.udid})`,
        simulator: s,
      }))
    } else {
      // Normal flow: ask for version first
      quickPick.placeholder = 'Select iOS version'
      quickPick.items = versions.map((version) => ({
        label: version,
      }))
    }

    quickPick.onDidAccept(async () => {
      const selected = quickPick.selectedItems[0]
      if (!selected) {
        return
      }

      if (stage === 'version') {
        // Move to device selection for this version
        selectedVersion = selected.label
        const devicesForVersion = simulators.filter(
          (s) => s.version === selectedVersion,
        )

        if (devicesForVersion.length === 0) {
          window.showWarningMessage(
            `No devices found for iOS ${selectedVersion}.`,
          )
          return
        }

        stage = 'device'
        quickPick.placeholder = 'Select iOS simulator device'
        quickPick.items = devicesForVersion.map((s) => ({
          label: s.name,
          description: `(${s.udid})`,
          simulator: s,
        }))
      } else if (stage === 'device') {
        // Run the selected device
        const simulator = selected.simulator
        if (!simulator) {
          return
        }

        quickPick.busy = true
        quickPick.items = [
          {
            label: `Starting ${selected.label}...`,
            simulator,
          },
        ]

        await runIOSSimulator(simulator)

        quickPick.items = [
          {
            label: `✓ Started ${selected.label}!`,
            simulator,
          },
        ]
        quickPick.busy = false

        setTimeout(() => quickPick.dispose(), 2000)
      }
    })

    quickPick.onDidHide(() => quickPick.dispose())
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
        const version = item.split('.').pop().replace('-', ' ').replace('-', '.')
        
        if (devices[item].length > 0) {
          return [...array, ...devices[item].map((device) => ({
            ...device,
            version,
          }))]
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