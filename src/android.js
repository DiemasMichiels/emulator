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
    window.showQuickPick(formattedEmulators).then(response => {
      if (response) {
        const ranEmulator = runAndroidEmulator(response.emulator);
        if (ranEmulator) {
          showSuccessMessage("Emulator is booting up ...");
        } else {
          showErrorMessage("Emulator failed to boot.");
        }
      }
    });
  }
};

const getAndroidEmulators = async () => {
  const command = `${path.join(emulatorPath(), ANDROID.PATH)}${
    ANDROID_COMMANDS.LIST_AVDS
  }`;

  try {
    const res = await runCmd(command, {
      cwd: emulatorPath().replace("~", process.env.HOME)
    });

    return (res && res.trim().split("\n")) || false;
  } catch (e) {
    showErrorMessage(
      `Something went wrong fetching you Android emulators! Make sure your path is correct. This command should work in your terminal: ${command}`
    );
  }
  return false;
};

const runAndroidEmulator = async emulator => {
  let { stdout } = await runCmd(
    `${path.join(emulatorPath(), ANDROID.PATH)}${
      ANDROID_COMMANDS.RUN_AVD
    }${emulator}`,
    { cwd: emulatorPath().replace("~", process.env.HOME) }
  );
  return stdout || false;
};
