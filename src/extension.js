const { window, commands } = require('vscode')
const { OS_PICKER } = require('./constants')
const { androidColdBoot } = require('./config')
const { androidPick } = require('./android')
const { iOSPick } = require('./ios')

exports.activate = context => {
  const disposable = commands.registerCommand('emulator.start', () => {
    const pickerList = [OS_PICKER.ANDROID]
    if (process.platform === 'darwin') {
      pickerList.push(OS_PICKER.IOS)
    }
    if (androidColdBoot()) {
      pickerList.push(OS_PICKER.ANDROID_COLD)
    }

    window.showQuickPick(pickerList).then(response => {
      switch (response) {
        case OS_PICKER.ANDROID:
          androidPick(false)
          break
        case OS_PICKER.ANDROID_COLD:
          androidPick(true)
          break
        case OS_PICKER.IOS:
          iOSPick()
          break
      }
    })
  })

  context.subscriptions.push(disposable)
}

exports.deactivate = () => {}
