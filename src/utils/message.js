const { window } = require('vscode')

exports.showErrorMessage = message => {
  window.showErrorMessage(message)
}
