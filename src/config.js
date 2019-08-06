const { workspace } = require('vscode')
const { showErrorMessage } = require('./utils/message')

const config = () => {
  return workspace.getConfiguration('emulator')
}

const getPath = () => {
  const pathMac = config().get('emulatorPathMac')
  const pathLinux = config().get('emulatorPathLinux')
  const pathWindows = config().get('emulatorPathWindows')

  if (process.platform === 'darwin' && pathMac) {
    return pathMac
  }
  if (process.platform === 'linux' && pathLinux) {
    return pathLinux
  }
  if (process.platform.startsWith('win') && pathWindows) {
    return pathWindows
  }
  return config().get('emulatorPath')
}

exports.emulatorPath = () => {
  const path = getPath()

  if (process.platform.startsWith('win') && path.includes('/')) {
    showErrorMessage(
      'Make sure your Windows path is set correctly! Example: C:\\Users\\Me\\AppData\\Local\\Android\\Sdk\\emulator'
    )
    return false
  }

  return path
}

exports.androidColdBoot = () => {
  return config().get('androidColdBoot')
}
