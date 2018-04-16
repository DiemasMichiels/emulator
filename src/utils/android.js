const { runCmd } = require('./commands');
const { ANDROID_COMMANDS } = require('../constants');

exports.getAndroidEmulators = async () => {
  let { stdout } = await runCmd(ANDROID_COMMANDS.LIST_AVDS);
  return stdout.trim().split('\n');
};

exports.runAndroidEmulator = async emulator => {
  let { stdout } = await runCmd(ANDROID_COMMANDS.RUN_AVD + emulator);
  return stdout;
};
