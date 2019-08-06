exports.OS_PICKER = {
  ANDROID: 'View Android emulators',
  ANDROID_COLD: 'View Android cold boot emulators',
  IOS: 'View iOS simulators'
}

exports.ANDROID_COMMANDS = {
  LIST_AVDS: ' -list-avds',
  RUN_AVD: ' -avd ',
  RUN_AVD_COLD: ' -no-snapshot-load -avd '
}

exports.IOS_COMMANDS = {
  LIST_SIMULATORS: 'instruments -s devices',
  RUN_SIMULATOR: 'instruments -w '
}

exports.ANDROID = {
  PATH: 'emulator'
}
