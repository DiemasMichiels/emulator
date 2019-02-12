const path = require("path");
const { window } = require("vscode");
const { emulatorPath } = require("./config");
const { runCmd } = require("./utils/commands");
const { showSuccessMessage, showErrorMessage } = require("./utils/message");
const { ANDROID_COMMANDS, ANDROID } = require("./constants");

// Get Android devices and pick one
exports.androidPick = async () => {
  const emulators = await getAndroidEmulators();
  if (emulators) {
    const formattedEmulators = emulators.map(e => ({
      label: e.replace(/_/g, " "),
      emulator: e
    }));
    window.showQuickPick(formattedEmulators).then(async response => {
      if (response) {
        const ranEmulator = await runAndroidEmulator(response.emulator);
        if (ranEmulator) {
          showSuccessMessage("Emulator is booting up ...");
        }
      }
    });
  }
};

const getAndroidEmulators = async () => {
  try {
    const res = await runCmd(`${path.join(emulatorPath(), ANDROID.PATH)}${
      ANDROID_COMMANDS.LIST_AVDS
      }`, {
        cwd: emulatorPath().replace("~", process.env.HOME)
      });

    if (res) {
      return res.trim().split("\n")
    }
    showErrorMessage(
      `There are no Android emulators found, please check if you have any emulators installed.`
    );
    return false;
  } catch (e) {
    showErrorMessage(e.toString());
    showErrorMessage(
      `Something went wrong fetching you Android emulators! Make sure your path is correct.`
    );
    return false;
  }
};

const runAndroidEmulator = async emulator => {
  try {
    const res = await runCmd(`${path.join(emulatorPath(), ANDROID.PATH)}${
      ANDROID_COMMANDS.RUN_AVD
      }${emulator}`,
      { cwd: emulatorPath().replace("~", process.env.HOME) }
    );
    return res || false;
  } catch (e) {
    showErrorMessage(e.toString());
    showErrorMessage(
      `Something went wrong running you Android emulator!`
    );
    return false
  }
};
