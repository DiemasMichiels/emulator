const { workspace } = require('vscode')
const os = require('os')

const config = workspace.getConfiguration('emulator')

const isWSL = () => {
  if (process.platform !== 'linux') return false
  const release = os.release().toLowerCase()
  return release.includes('microsoft') || release.includes('wsl')
}

exports.getPath = () => {
  const pathMac = config.get('emulatorPathMac')
  const pathLinux = config.get('emulatorPathLinux')
  const pathWindows = config.get('emulatorPathWindows')
  const pathWSL = config.get('emulatorPathWSL')

  if (process.platform === 'darwin' && pathMac) {
    return pathMac
  }
  if (process.platform === 'linux' && !isWSL() && pathLinux) {
    return pathLinux
  }
  if (process.platform.startsWith('win') && pathWindows) {
    return pathWindows
  }
  if (isWSL() && pathWSL) {
    return pathWSL
  }
  return config.get('emulatorPath')
}

exports.androidColdBoot = () => config.get('androidColdBoot')
exports.androidExtraBootArgs = () => config.get('androidExtraBootArgs')
exports.simulatorPath = () => config.get('simulatorPath')
exports.isWSL = isWSL
