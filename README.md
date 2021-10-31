![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/DiemasMichiels.emulate)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/DiemasMichiels.emulate)](https://marketplace.visualstudio.com/items?itemName=DiemasMichiels.emulate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Android iOS Emulator

A small Visual Studio Code extention to run Android and iOS Simulators in a click.  
Link to marketplace: https://marketplace.visualstudio.com/items?itemName=DiemasMichiels.emulate

**Running iOS simulators only works on Mac with Xcode!**

## Features

Select and run your emulator from Visual Studio Code.

Open all commands with `Cmd-Shift-P` and type `Emulator` or click the Emulator icon in the top right.

![Image of Emulator](https://raw.githubusercontent.com/DiemasMichiels/Emulator/master/images/emulator.gif)

## Requirements

### Android Studio

To run Android emulators you need to have Android studio and already created the Android Virtual Devices.

Add the Android Studio emulator script to your settings in Visual Studio Code:  
You can either set the default path or specify a specific path for each operating system. The default path will always be the fallback.  
&nbsp;&nbsp;&nbsp;&nbsp;Default: `"emulator.emulatorPath": "~/Library/Android/sdk/emulator"`  
&nbsp;&nbsp;&nbsp;&nbsp;Mac: `"emulator.emulatorPathMac": "~/Library/Android/sdk/emulator"`  
&nbsp;&nbsp;&nbsp;&nbsp;Linux: `"emulator.emulatorPathLinux": "~/Android/Sdk/emulator"`
&nbsp;&nbsp;&nbsp;&nbsp;Windows: `"emulator.emulatorPathWindows":`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"<yourAndroidHome>\\Sdk\\emulator"`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;or  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"C:\\Users\\<yourUsername>\\AppData\\Local\\Android\\Sdk\\emulator"`

Your visual studio code settings are found here:  
&nbsp;&nbsp;&nbsp;&nbsp;File -> Preferences -> Setting -> User Setting -> Extensions -> Emulator Configuration

You now have the option to start Android emulators in cold boot modus. Activate it in your settings in Visual Studio Code:  
&nbsp;&nbsp;&nbsp;&nbsp;Android Cold Boot: `true`

### Xcode

To run iOS emulators Xcode is required.

If your Xcode or simulator is not installed in the default location it is possible to set the correct path of the Simulator.app file:  
`"emulator.simulatorPath": "/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app"` 

## License

MIT License

Copyright (c) 2019 Diemas Michiels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
