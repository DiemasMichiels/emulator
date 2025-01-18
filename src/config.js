const { workspace } = require('vscode')

const config = workspace.getConfiguration('emulator')

exports.getPath = () => {
  const pathMac = config.get('emulatorPathMac')
  const pathLinux = config.get('emulatorPathLinux')
  const pathWindows = config.get('emulatorPathWindows')

  if (process.platform === 'darwin' && pathMac) {
    return pathMac
  }
  if (process.platform === 'linux' && pathLinux) {
    return pathLinux
  }
  if (process.platform.startsWith('win') && pathWindows) {
    return pathWindows
  }
  return config.get('emulatorPath')
}

exports.androidColdBoot = () => {
  return config.get('androidColdBoot')
}

exports.simulatorPath = () => {
  return config.get('simulatorPath')
}

exports.androidExtraBootArgs = () => {
  return config.get('androidExtraBootArgs')
}
