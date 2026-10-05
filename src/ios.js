const { window } = require('vscode')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')
const { runCmd } = require('./utils/commands')
const { IOS_COMMANDS } = require('./constants')
const { simulatorPath } = require('./config')

const execFileAsync = promisify(execFile)

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

        const started = await runIOSSimulator(simulator)
        if (!started) {
          quickPick.dispose()
          return
        }

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
    const developerDir = (await runCmd(IOS_COMMANDS.DEVELOPER_DIR)).trim()
    const deviceHubAppPath = path.join(
      path.dirname(developerDir),
      'Applications',
      'DeviceHub.app',
    )

    if (!fs.existsSync(deviceHubAppPath)) {
      await openLegacySimulator(simulator, developerDir)
      return true
    }

    await execFileAsync('xcrun', [
      ...IOS_COMMANDS.BOOT_STATUS_SIMULATOR,
      simulator.udid,
      '-b',
    ])

    const deviceHubUrl = `${IOS_COMMANDS.DEVICE_HUB_SELECT_URL}${encodeURIComponent(
      simulator.udid,
    )}`
    try {
      await execFileAsync('open', ['-a', deviceHubAppPath, deviceHubUrl])
    } catch (deviceHubError) {
      try {
        await openLegacySimulator(simulator, developerDir, true)
      } catch (legacySimulatorError) {
        throw new Error(
          `Device Hub failed: ${deviceHubError.message}; legacy Simulator failed: ${legacySimulatorError.message}`,
        )
      }
    }

    return true
  } catch (error) {
    window.showErrorMessage(`Error running your iOS simulator: ${error.message}`)
    return false
  }
}

const openLegacySimulator = async (
  simulator,
  developerDir,
  alreadyBooted = false,
) => {
  if (!alreadyBooted && simulator.state !== 'Booted') {
    await runCmd(IOS_COMMANDS.BOOT_SIMULATOR + simulator.udid)
  }

  const configuredSimulatorPath = simulatorPath()
  const legacySimulatorPath = configuredSimulatorPath
    ? configuredSimulatorPath
    : path.join(developerDir, 'Applications', 'Simulator.app')

  await execFileAsync('open', [
    legacySimulatorPath,
    '--args',
    '-CurrentDeviceUDID',
    simulator.udid,
  ])
}
