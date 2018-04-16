exports.OS_PICKER = {
  ANDROID: 'View Android simulators',
  IOS: 'View iOS simulators'
};

exports.ANDROID_COMMANDS = {
  LIST_AVDS: 'emulator -list-avds',
  RUN_AVD: 'emulator -avd '
};

exports.IOS_COMMANDS = {
  LIST_SIMULATORS: 'instruments -s devices',
  RUN_SIMULATOR: 'instruments -w '
};
