import * as vscode from "vscode";
import { closeUnchanged } from "./commands/closeUnchanged";
import { Change, GitExtension, Repository } from "./git";

export function activate(context: vscode.ExtensionContext) {
  const closeUnchangedCmd = vscode.commands.registerCommand(
    "close-tabs.git-unchanged",
    closeUnchanged
  );

  context.subscriptions.push(closeUnchangedCmd);
}
