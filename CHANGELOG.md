# 1.8.1

- Readd exec options for windows, add fallback when it fails with options - issue 66 - bug

# 1.8.0

- When multiple iOS versions are installed an extra version selection menu is shown - issue 63 - enhancement
- Removed exec options causing issues - issue 64 - bug
- Remove child process dependency which is part of node thanks to noritaka1166 - pr 62

# 1.7.1

- Added buy me a coffee link to the readme

# 1.7.0

- Allow forward slash on windows and general improvements thanks to multimokia - issue 48 - bug
- On windows the selection menu for Android or iOS is now gone
- WSL is now supported
- Improved selection flow and information messages
- iOS now opens multiple simulators if another device is selected

# 1.6.0

- Instruments got deprecated launch through Simulator.app itself thanks to wbroek - issue 45 - bug
- Add optional path to select the Xcode Simulator.app file

# 1.5.0

- Add optional boot args Android thanks to sableangle - issue 38 - bug
- Switch from standardJS to prettier

# 1.4.0

- Remove 'Emulator is booting up...' message - issue 28 - bug
- Add a config option to hide the editor/title icon in the top right - issue 27 - enhancement
- Fix windows paths with spaces - issue 26 - bug

# 1.3.0

- Add more details to the ios simulator device list - issue 24 - enhancement

# 1.2.0

- Add cold boot option for android devices, this needs to be activated in the config - issue 22 - enhancement

# 1.1.0

- Add multiple config variable for multiple OS support - issue 23 - enhancement

# 1.0.1

- Expand path support thanks to antonholmbergmi and RodrigoSaka - issue 14

# 1.0.0

- Finally some decent error reporting
- Bump packages
- Support x86 emulators on mac thanks to antonholmbergmi - issue 12

# 0.0.7

- Add right top icon to start the emulator
- Remove bad error messaging

# 0.0.6 - preview

- Add keybindings

# 0.0.5 - preview

- Much nicer emulator names to pick from
- Add android emulator path to visual studio code settings

# 0.0.4 - preview

- Rename emulate to Android iOS Emulator

# 0.0.3 - preview

- Support other operation systems than mac

# 0.0.2 - preview

- You are now able to run iOS simulators

# 0.0.1 - preview

- Run Android emulators
