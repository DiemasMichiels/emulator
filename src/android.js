const path = require('path')
const { window, ProgressLocation } = require('vscode')
const { getPath, androidExtraBootArgs, isWSL } = require('./config')
const { runCmd } = require('./utils/commands')
const { showErrorMessage } = require('./utils/message')
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
          // Update quickPick to show launching status
          quickPick.items = [
            {
              label: `Starting ${selected.label}...`,
              emulator: selected.emulator,
            },
          ]
          quickPick.busy = true

          await runAndroidEmulator(selected.emulator, cold)

          // Show success message in quickPick
          quickPick.items = [
            {
              label: `✓ Started ${selected.label}!`,
              emulator: selected.emulator,
            },
          ]
          quickPick.busy = false

          // Close quickPick after brief delay
          setTimeout(() => quickPick.dispose(), 1000)
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

const getAndroidPath = async () => {
  return (await runCmd(`echo "${getPath()}"`)).trim().replace(/[\n\r"]/g, '')
}

const getEmulatorPath = (androidPath) => {
  const emulatorPath = path.join(androidPath, ANDROID.PATH)

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

    if (isWSL()) {
      options.shell = true
    }

    const res = await runCmd(command, options)

    if (res) {
      return res.trim().split('\n')
    }
    showErrorMessage(
      'There are no Android emulators found, please check if you have any emulators installed.',
    )
    return false
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong fetching your Android emulators! Make sure your path is correct. Try running this command in your terminal: ${command}`,
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

    if (isWSL()) {
      options.shell = true
      options.detached = true
    }

    if (isWSL()) {
      const childProcess = exec(command, options)
      childProcess.unref()
      return
    } else {
      await runCmd(command, options)
      return
    }
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong running your Android emulator! Try running this command in your terminal: ${command}`,
    )
    return false
  }
}
