import * as vscode from "vscode";
import { closeUnchanged } from "./commands/closeUnchanged";
import { Change, GitExtension, Repository } from "./git";
import { closeLeft } from "./commands/closeLeft";
import { closeType } from "./commands/closeType";

export function activate(context: vscode.ExtensionContext) {
  const closeUnchangedCmd = vscode.commands.registerCommand(
    "close-tabs.git-unchanged",
    closeUnchanged
  );

  const closeLeftCmd = vscode.commands.registerCommand(
    "close-tabs.close-left",
    closeLeft
  );

  const closeAllOfType = vscode.commands.registerCommand(
    "close-tabs.closeAllOfType",
    (uri: vscode.Uri) => closeType(uri, false)
  );

  const closeDefaultTypes = vscode.commands.registerCommand(
    "close-tabs.closeDefaultTypes",
    (uri: vscode.Uri) => closeType(uri, true)
  );

  context.subscriptions.push(closeUnchangedCmd);
  context.subscriptions.push(closeLeftCmd);
  context.subscriptions.push(closeAllOfType);
  context.subscriptions.push(closeDefaultTypes);
}
