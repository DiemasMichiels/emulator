const { window } = require('vscode');
const { emulatorPath } = require('./config')
const { runCmd } = require('./utils/commands');
const { showSuccessMessage, showErrorMessage } = require('./utils/message');
const { ANDROID_COMMANDS } = require('./constants');

// Get Android devices and pick one
exports.androidPick = () => {
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

const getAndroidEmulators = async () => {
  console.log(`${emulatorPath()}${ANDROID_COMMANDS.LIST_AVDS}`)
  let { stdout } = await runCmd(`${emulatorPath()}${ANDROID_COMMANDS.LIST_AVDS}`);
  return stdout && stdout.trim().split('\n') || false;
};

const runAndroidEmulator = async emulator => {
  let { stdout } = await runCmd(`${emulatorPath()}${ANDROID_COMMANDS.RUN_AVD}${emulator}`);
  return stdout || false;
};
