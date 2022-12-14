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
          const fileName = (tab.input as any).uri.fsPath;
          return repositories.some(
            (repository) => !hasDiff(fileName, repository)
          );
        })
        .map((tab) => (tab.input as any).uri as vscode.Uri);

      for (const uri of targetFiles) {
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
