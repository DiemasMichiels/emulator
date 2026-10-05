exports.OS_PICKER = {
  ANDROID: 'View Android emulators',
  ANDROID_COLD: 'View Android cold boot emulators',
  IOS: 'View iOS simulators',
}

exports.ANDROID_COMMANDS = {
  LIST_AVDS: ' -list-avds',
  RUN_AVD: ' -avd ',
  RUN_AVD_COLD: ' -no-snapshot-load -avd ',
}

exports.IOS_COMMANDS = {
  LIST_SIMULATORS: 'xcrun simctl list --json devices',
  BOOT_SIMULATOR: 'xcrun simctl boot ',
  BOOT_STATUS_SIMULATOR: ['simctl', 'bootstatus'],
  DEVELOPER_DIR: 'xcode-select -p',
  DEVICE_HUB_SELECT_URL: 'devices:///manage/select?id=',
}

exports.ANDROID = {
  PATH: 'emulator',
}
