const { window, commands } = require('vscode');
const { OS_PICKER } = require('./constants');
const { androidPick } = require('./android');
const { iOSPick } = require('./ios');

exports.activate = context => {
  let disposable = commands.registerCommand('emulator.start', () => {
    const pickerList = [OS_PICKER.ANDROID]
    process.platform === 'darwin' && pickerList.push(OS_PICKER.IOS)

    window.showQuickPick(pickerList).then(response => {
      switch (response) {
        case OS_PICKER.ANDROID:
          androidPick();
          break;
        case OS_PICKER.IOS:
          iOSPick();
          break;
      }
    });
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
