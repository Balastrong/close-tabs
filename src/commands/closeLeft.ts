import * as vscode from "vscode";

export const closeLeft = async () => {
  await vscode.commands.executeCommand(
    "workbench.action.closeEditorsToTheLeft"
  );
};
