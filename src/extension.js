const vscode = require('vscode');

exports.activate = context => {
  let disposable = vscode.commands.registerCommand('extension.emulate', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
