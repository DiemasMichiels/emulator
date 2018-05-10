const { window } = require('vscode');

exports.showSuccessMessage = () => {
  window.showInformationMessage(
    'Emulator is booting up ...'
  );
}

exports.showErrorMessage = () => {
  window.showErrorMessage(
    'Emulator failed to boot.'
  );
}