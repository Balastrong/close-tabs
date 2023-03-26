import * as vscode from "vscode";
import { GitExtension } from "../git";
import { hasDiff } from "../libs/utils";

export const closeUnchanged = async () => {
  try {
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;

    const config = vscode.workspace.getConfiguration('closeTabs');
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
        if (tab.isPinned && !config.allowClosePinnedTabs) {
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
    vscode.window.showErrorMessage("Unexpected error while closing the tabs!");
  }
};
