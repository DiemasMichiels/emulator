const path = require('path')
const { window, ProgressLocation } = require('vscode')
const { getPath, androidExtraBootArgs } = require('./config')
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
          quickPick.hide()

          // Show progress indicator while launching emulator
          await window.withProgress(
            {
              location: ProgressLocation.Notification,
              title: `Launching Android emulator: ${selected.label}`,
              cancellable: false,
            },
            async () => {
              const result = await runAndroidEmulator(selected.emulator, cold)
              if (result) {
                window.showInformationMessage(
                  `Started emulator: ${selected.label}`,
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

const getAndroidPath = async () => {
  return (await runCmd(`echo "${getPath()}"`)).trim().replace(/[\n\r"]/g, '')
}

const getEmulatorPath = (androidPath) => {
  const emulatorPath = path.join(androidPath, ANDROID.PATH)
  return process.platform.startsWith('win') ? `"${emulatorPath}"` : emulatorPath
}

const getAndroidEmulators = async (cold) => {
  const androidPath = await getAndroidPath()
  if (!androidPath) {
    return false
  }

  const command = `${getEmulatorPath(androidPath)}${ANDROID_COMMANDS.LIST_AVDS}`
  try {
    const res = await runCmd(command, {
      cwd: androidPath.replace('~', process.env.HOME),
    })

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
    const res = await runCmd(command, {
      cwd: androidPath.replace('~', process.env.HOME),
    })
    return res || false
  } catch (e) {
    showErrorMessage(e.toString())
    showErrorMessage(
      `Something went wrong running you Android emulator! Try running this command in your terminal: ${command}`,
    )
    return false
  }
}
