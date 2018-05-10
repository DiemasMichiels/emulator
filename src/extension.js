const { window, commands } = require('vscode');
const { OS_PICKER } = require('./constants');
const { getAndroidEmulators, runAndroidEmulator } = require('./utils/android');
const { getIOSSimulators, runIOSSimulator } = require('./utils/ios');

exports.activate = context => {
  let disposable = commands.registerCommand('extension.emulator', () => {
    const pickerList = [OS_PICKER.ANDROID]
    process.platform === 'darwin' && pickerList.push(OS_PICKER.IOS)

    window.showQuickPick(pickerList).then(response => {
      switch (response) {
        case OS_PICKER.ANDROID:
          androidPick();
          break;
        case OS_PICKER.IOS:
          iOSPick();
          break;
        default:
          window.showErrorMessage('Failed to select OS version.')
          break;
      }
    });
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};

// Get Android devices and pick one
const androidPick = () => {
  const emulators = getAndroidEmulators();
  if (emulators) {
    window.showQuickPick(emulators).then(response => {
      if (response) {
        const ranEmulator = runAndroidEmulator(response);
        if (ranEmulator) {
          showSuccessMessage();
        } else {
          showErrorMessage();
        }
      }
    });
  }
}

// Get iOS devices and pick one
const iOSPick = () => {
  const simulators = getIOSSimulators();
  if (simulators) {
    window.showQuickPick(simulators).then(response => {
      if (response) {
        const ranSimulator = runIOSSimulator(response);
        if (ranSimulator) {
          showSuccessMessage();
        } else {
          showErrorMessage();
        }
      }
    });
  }
}

const showSuccessMessage = () => {
  window.showInformationMessage(
    'Emulator is booting up ...'
  );
}

const showErrorMessage = () => {
  window.showErrorMessage(
    'Emulator failed to boot.'
  );
}