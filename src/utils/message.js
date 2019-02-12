const { window } = require("vscode");

exports.showSuccessMessage = message => {
  window.showInformationMessage(message);
};

exports.showErrorMessage = message => {
  window.showErrorMessage(message);
};
