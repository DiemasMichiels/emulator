const { window, commands } = require('vscode');
const { OS_PICKER } = require('./constants');
const { getAndroidEmulators, runAndroidEmulator } = require('./utils/android');

exports.activate = context => {
  let disposable = commands.registerCommand('extension.emulate', () => {
    window.showQuickPick([OS_PICKER.ANDROID, OS_PICKER.IOS]).then(response => {
      if (response === OS_PICKER.ANDROID) {
        const emulators = getAndroidEmulators();
        if (emulators) {
          window.showQuickPick(emulators).then(response => {
            if (response) {
              runAndroidEmulator(response);
            }
          });
        }
      } else if (response === OS_PICKER.IOS) {
        window.showInformationMessage(
          'Emulate: iOS is currently not yet supported'
        );
      }
    });
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
