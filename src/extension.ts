import * as vscode from "vscode";
import { Change, GitExtension, Repository } from "./git";

export function activate(context: vscode.ExtensionContext) {
  const closeCommand = vscode.commands.registerCommand(
    "close-tabs.git-unchanged",
    async () => {
      try {
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

        vscode.window.tabGroups.all
          .flatMap((tabGroup) => tabGroup.tabs)
          .forEach((tab) => {
            if (tab.isPinned) {
              // TODO: Add config to allow closing pinned tabs
              return;
            }

            if (
              tab.input instanceof vscode.TabInputText ||
              tab.input instanceof vscode.TabInputCustom ||
              tab.input instanceof vscode.TabInputNotebook
            ) {
              // find if file is changed in any of the repositories

              const fileName = tab.input.uri.fsPath;
              if (!fileName) {
                return;
              }

              const canBeClosed = repositories.some(
                (repository) => !hasDiff(fileName, repository)
              );

              if (canBeClosed) {
                vscode.window.tabGroups.close(tab, true);
              }
            } else if (
              tab.input instanceof vscode.TabInputTextDiff ||
              tab.input instanceof vscode.TabInputNotebookDiff
            ) {
              vscode.window.tabGroups.close(tab, true);
            }
          });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Unexpected error while closing the tabs!"
        );
      }
    }
  );

  context.subscriptions.push(closeCommand);
}

function hasDiff(fileName: string, repository: Repository) {
  return repository.state.workingTreeChanges.some((change: Change) => {
    return change.uri.fsPath === fileName;
  });
}
