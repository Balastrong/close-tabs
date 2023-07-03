import * as vscode from "vscode";
import { closeUnchanged } from "./commands/closeUnchanged";
import { Change, GitExtension, Repository } from "./git";
import { closeLeft } from "./commands/closeLeft";

export function activate(context: vscode.ExtensionContext) {
  const closeUnchangedCmd = vscode.commands.registerCommand(
    "close-tabs.git-unchanged",
    closeUnchanged
  );

  const closeLeftCmd = vscode.commands.registerCommand(
    "close-tabs.close-left",
    closeLeft
  );

  context.subscriptions.push(closeUnchangedCmd);
  context.subscriptions.push(closeLeftCmd);
}
