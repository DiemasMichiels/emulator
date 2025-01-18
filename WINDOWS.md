# Windows guide

This guide is for Windows users to help and setup the Emulator extension for Visual Studio Code.

## Requirements

Make sure that you have read the android [requirements](https://github.com/DiemasMichiels/emulator/blob/main/README.md#requirements) section for the Emulator extension.
If that doesn't work, you can try the following steps below.

## Steps

### Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio and to make it easier create a new project
3. Click on the lines in the top left and go to `Tools` -> `Device Manager`
   ![Device Manager](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm.png)
   There should be already a device created, but let's create a new one.
   <br />
   <br />
4. Click on the `+` icon "Create Virtual Device"
   ![Create Virtual Device](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm-add.png)
   <br />
   <br />
5. Select a device which you want to use as an emulator and click `Next`
   ![Create Virtual Device](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm-add-1.png)
   <br />
   <br />
6. In the next screen select the Android version you want to use and click `Next`
   ![Create Virtual Device](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm-add-2.png)
   <br />
   <br />
7. Don't change anything and click on `Finish` and the device will be created.  
    ![Create Virtual Device](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm-add-3.png)
   <br />
   <br />
8. You should now see the device in the list of devices.  
    You can also run it from there pressing the play button at the end of the line.
   ![Create Virtual Device](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/adm-added.png)

### Visual Studio Code

1. Open Visual Studio Code
2. At the top click on File -> Preferences -> Settings
   ![Settings](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/vscode-settings.png)
   <br />
   <br />
3. Click on the `Extensions` -> `Emulator Configuration`
4. Paste the following path in the `emulator.emulatorPathWindows` field:  
   `C:\Users\<yourUsername>\AppData\Local\Android\Sdk\emulator`
   ![Settings](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/vscode-settings-edit.png)
   <br />
   <br />
5. Now you can run the emulator from Visual Studio Code
   ![Image of Emulator](https://raw.githubusercontent.com/DiemasMichiels/emulator/main/images/emulator.gif)
