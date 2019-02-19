const path = require('path');
const { window } = require('vscode');
const { emulatorPath } = require('./config');
const { runCmd } = require('./utils/commands');
const { showSuccessMessage, showErrorMessage } = require('./utils/message');
const { ANDROID_COMMANDS, ANDROID } = require('./constants');

// Get Android devices and pick one
exports.androidPick = async () => {
  const emulators = await getAndroidEmulators();
  if (emulators) {
    const formattedEmulators = emulators.map(e => ({
      label: e.replace(/_/g, ' '),
      emulator: e
    }));
    window.showQuickPick(formattedEmulators).then(async response => {
      if (response) {
        const ranEmulator = await runAndroidEmulator(response.emulator);
        if (ranEmulator) {
          showSuccessMessage('Emulator is booting up ...');
        }
      }
    });
  }
};

const getAndroidEmulators = async () => {
  const androidPath = (await runCmd(`echo "${emulatorPath()}"`))
    .trim()
    .replace(/[\n\r"]/g, '');

  if (!androidPath) {
    return false;
  }

  const command = `${path.join(androidPath, ANDROID.PATH)}${
    ANDROID_COMMANDS.LIST_AVDS
    }`;
  try {
    const res = await runCmd(command, {
      cwd: androidPath.replace('~', process.env.HOME)
    });

    if (res) {
      return res.trim().split('\n');
    }
    showErrorMessage(
      'There are no Android emulators found, please check if you have any emulators installed.'
    );
    return false;
  } catch (e) {
    showErrorMessage(e.toString());
    showErrorMessage(
      `Something went wrong fetching you Android emulators! Make sure your path is correct. Try running this command in your terminal: ${command}`
    );
    return false;
  }
};

const runAndroidEmulator = async emulator => {
  const androidPath = (await runCmd(`echo "${emulatorPath()}"`))
    .trim()
    .replace(/[\n\r"]/g, '');
  if (!androidPath) {
    return false;
  }

  const command = `${path.join(androidPath, ANDROID.PATH)}${
    ANDROID_COMMANDS.RUN_AVD
    }${emulator}`;
  try {
    const res = await runCmd(command, {
      cwd: androidPath.replace('~', process.env.HOME)
    });
    return res || false;
  } catch (e) {
    showErrorMessage(e.toString());
    showErrorMessage(
      `Something went wrong running you Android emulator! Try running this command in your terminal: ${command}`
    );
    return false;
  }
};
