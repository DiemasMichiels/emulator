const { window } = require('vscode');
const { emulatorPath } = require('./config')
const { runCmd } = require('./utils/commands');
const { showSuccessMessage, showErrorMessage } = require('./utils/message');
const { ANDROID_COMMANDS } = require('./constants');

// Get Android devices and pick one
exports.androidPick = async () => {
  const emulators = await getAndroidEmulators();
  if (emulators) {
    const formattedEmulators = emulators.map(e => ({ label: e.replace(/_/g, ' '), emulator: e }))
    window.showQuickPick(formattedEmulators).then(response => {
      if (response) {
        const ranEmulator = runAndroidEmulator(response.emulator);
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
  let { stdout } = await runCmd(`${emulatorPath()}${ANDROID_COMMANDS.LIST_AVDS}`);
  return stdout && stdout.trim().split('\n') || false;
};

const runAndroidEmulator = async emulator => {
  let { stdout } = await runCmd(`${emulatorPath()}${ANDROID_COMMANDS.RUN_AVD}${emulator}`);
  return stdout || false;
};
