import * as vscode from "vscode";

export const closeType = async (uri: vscode.Uri, defaultTypes: boolean) => {
  try {
    const config = vscode.workspace.getConfiguration("closeTabs");
    let extensionsToClose: string[] = config.get("extensionsToClose", []);
    const caseSensitive: boolean = config.get("extensionsCaseSensitive", true);

    console.log("Starting to close tabs based on type...");

    // If no extensions are specified in the settings, use the extension of the right-clicked file
    if (!defaultTypes && uri) {
      const fileExtension = uri.fsPath.split(".").pop();
      if (fileExtension) {
        extensionsToClose = [fileExtension];
        console.log(
          `No extensions specified in settings. Using the extension of the right-clicked file: ${fileExtension}`
        );
      }
    }

    // Normalize extensions to remove leading dots
    const normalizedExtensionsToClose = extensionsToClose.map((ext) =>
      ext.startsWith(".") ? ext.slice(1) : ext
    );
    const finalExtensionsToClose = caseSensitive
      ? normalizedExtensionsToClose
      : normalizedExtensionsToClose.map((ext) => ext.toLowerCase());

    vscode.window.tabGroups.all
      .flatMap((tabGroup) => tabGroup.tabs)
      .forEach((tab) => {
        if (tab.isPinned && !config.allowClosePinnedTabs) {
          console.log(`Skipping pinned tab: ${tab.label}`);
          return;
        }

        let fileName: string | undefined;

        if (tab.input instanceof vscode.TabInputText) {
          fileName = tab.input.uri.fsPath;
        } else if (tab.input instanceof vscode.TabInputCustom) {
          fileName = tab.input.uri.fsPath;
        }

        if (!fileName) {
          console.log("No file name found for tab.");
          return;
        }

        console.log(`Checking file: ${fileName}`);

        // Check if the file extension is in the list of extensions to close
        const fileExtension = fileName.split(".").pop();
        if (fileExtension) {
          const normalizedExtension = caseSensitive
            ? fileExtension
            : fileExtension.toLowerCase();

          if (finalExtensionsToClose.includes(normalizedExtension)) {
            console.log(`Closing tab with file: ${fileName}`);
            vscode.window.tabGroups.close(tab, true);
          } else {
            console.log(
              `File extension is not in the list to close: ${fileName}`
            );
          }
        }
      });

    console.log("Finished closing tabs.");
  } catch (error) {
    vscode.window.showErrorMessage("Unexpected error while closing the tabs!");
    console.error("Error while closing tabs:", error);
  }
};
