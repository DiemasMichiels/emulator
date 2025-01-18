const path = require('path')
const { window, ProgressLocation } = require('vscode')
const { getPath, androidExtraBootArgs, isWSL } = require('./config')
const { runCmd } = require('./utils/commands')
const { ANDROID_COMMANDS, ANDROID } = require('./constants')

// Get Android devices and pick one
exports.androidPick = async (cold = false) => {
  // Create and show QuickPick with loading state
  const quickPick = window.createQuickPick()
  quickPick.placeholder = 'Loading Android emulators...'
  quickPick.busy = true
  quickPick.show()

  try {
    const emulators = await getAndroidEmulators()

    if (emulators) {
      quickPick.busy = false
      quickPick.placeholder = 'Select Android emulator'
      quickPick.items = emulators.map((e) => ({
        label: e.replace(/_/g, ' '),
        emulator: e,
      }))

      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0]
        if (selected) {
          // Update quickpick to show launching status
          quickPick.items = [
            {
              label: `Starting ${selected.label}...`,
              emulator: selected.emulator,
            },
          ]
          quickPick.busy = true

          const response = await runAndroidEmulator(selected.emulator, cold)

          if (!response) {
            quickPick.dispose()
            return
          }

          // Show success message in quickpick
          quickPick.items = [
            {
              label: `${response}${selected.label}!`,
              emulator: selected.emulator,
            },
          ]
          quickPick.busy = false

          // Close quickpick after brief delay
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

const getAndroidPath = async () => {
  return (await runCmd(`echo "${getPath()}"`)).trim().replace(/[\n\r"]/g, '')
}

const getEmulatorPath = (androidPath) => {
  const emulatorPath = path.join(androidPath, ANDROID.PATH)

  if (isWSL()) {
    return `${emulatorPath}.exe`
  }

  if (process.platform.startsWith('win')) {
    return `"${emulatorPath}"`
  }

  return emulatorPath
}

const getAndroidEmulators = async () => {
  const androidPath = await getAndroidPath()
  if (!androidPath) {
    return false
  }

  const command = `${getEmulatorPath(androidPath)}${ANDROID_COMMANDS.LIST_AVDS}`
  try {
    const options = {
      cwd: androidPath.replace('~', process.env.HOME),
    }

    const res = await runCmd(command, options)

    if (res) {
      return res.trim().split('\n')
    }
    window.showErrorMessage(
      'No Android emulators found. Please check if you have any emulators installed.',
    )
    return false
  } catch (e) {
    window.showErrorMessage(
      `Error fetching your Android emulators! Make sure your path is correct. Try running this command: ${command}`,
    )
    return false
  }
}

const runAndroidEmulator = async (emulator, cold) => {
  const androidPath = await getAndroidPath()
  if (!androidPath) {
    return false
  }

  const command = `${getEmulatorPath(androidPath)} ${androidExtraBootArgs()}${
    cold ? ANDROID_COMMANDS.RUN_AVD_COLD : ANDROID_COMMANDS.RUN_AVD
  }${emulator}`

  try {
    const options = {
      cwd: androidPath.replace('~', process.env.HOME),
    }

    await runCmd(command, options)
    return '✓ Started '
  } catch (e) {
    
    if (e && e.stdout && e.stdout.includes('Running multiple emulators with the same AVD')) {
      return 'Already running '
    }

    if (e && e.err && e.err.toString().includes("CPU Architecture 'arm'")) {
      window.showErrorMessage(
        'ARM-based Android emulators are not supported in WSL. Please use an x86/x64-based Android Virtual Device instead.',
      )
      return false
    }

    window.showErrorMessage(
      `Error running your Android emulator! Try running this command: ${command}`,
    )
    return false
  }
}
