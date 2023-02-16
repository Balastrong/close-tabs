import * as vscode from "vscode";
import { GitExtension, Repository } from "./git";

export function activate(context: vscode.ExtensionContext) {
  const closeCommand = vscode.commands.registerCommand(
    "close-tabs.git-unchanged",
    async () => {
      const gitExtension =
        vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;
      if (!gitExtension) {
        console.log("Git extension not found");
        return;
      }

      const repositories = gitExtension.getAPI(1).repositories;
      if (!repositories.length) {
        console.log("No repositories found");
        return;
      }

      const targetFiles = vscode.window.tabGroups.all
        .flatMap((tabGroup) => tabGroup.tabs)
        .filter((tab) => {
          if (tab.isPinned) {
            // TODO: Add config to allow closing pinned tabs
            return false;
          }

          if (
            tab.input instanceof vscode.TabInputText ||
            tab.input instanceof vscode.TabInputCustom ||
            tab.input instanceof vscode.TabInputNotebook
          ) {
            const fileName = tab.input.uri.fsPath;
            if (!fileName) {
              return true;
            }

            const canBeClosed = repositories.some(
              (repository) => !hasDiff(fileName, repository)
            );

            return canBeClosed;
          }

          return true;
        })
        .map((tab) => {
          if (
            tab.input instanceof vscode.TabInputText ||
            tab.input instanceof vscode.TabInputCustom ||
            tab.input instanceof vscode.TabInputNotebook
          ) {
            return tab.input.uri as vscode.Uri;
          } else if (
            tab.input instanceof vscode.TabInputTextDiff ||
            tab.input instanceof vscode.TabInputNotebookDiff
          ) {
            return tab.input.original as vscode.Uri;
          }
          return undefined;
        });

      for (const uri of targetFiles) {
        if (!uri) {
          continue;
        }
        // https://stackoverflow.com/questions/44733028/how-to-close-textdocument-in-vs-code
        await vscode.window.showTextDocument(uri, {
          preview: true,
          preserveFocus: false,
        });

        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
      }
    }
  );

  context.subscriptions.push(closeCommand);
}

function hasDiff(fileName: string, repository: Repository) {
  return repository.state.workingTreeChanges.some((change: any) => {
    return change.uri.fsPath === fileName;
  });
}
