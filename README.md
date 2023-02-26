# Close Tabs - Unchanged, Diff, Left and more!

More options to close open tabs, fully configurable.

![demo](./demo.gif)

## Features

Add the following options to the tab context menu:

- Close all open tabs without changes (from the git working tree).
- Close all Diff Editors (Working Tree tabs).
- Close all tabs to the left.
- Fine-grained settings to toggle which buttons are shown in the tab context menu.

## Extension Settings

```json
"closeTabs.showCloseUnchanged": {
    "type": "boolean",
    "default": true,
    "description": "Show the \"Close Unchanged\" button."
},
"closeTabs.showCloseDiffEditors": {
    "type": "boolean",
    "default": true,
    "description": "Show the \"Close Diff Editors\" button."
},
"closeTabs.showCloseToTheLeft": {
    "type": "boolean",
    "default": true,
    "description": "Show the \"Close to the Left\" button."
}
```

Coming soon:

- [#8](https://github.com/Balastrong/close-tabs/issues/8): Add setting to include/exclude pinned tabs

## Release Notes

### 1.1.0

- Add settings to toggle which buttons are shown in the tab context menu.
- Add icon to the extension! :)

### 1.0.0

It does what the initial plan was about!

Add the following options to the tab context menu:

- Close all open tabs without changes (from the git working tree).
- Close all Diff Editors (Working Tree tabs).
- Close all tabs to the left.

### 0.0.1

Just trying to make it work, somehow.
