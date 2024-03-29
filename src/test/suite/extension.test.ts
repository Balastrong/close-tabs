import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as closeUnchangedCommand from "../../commands/closeUnchanged";
import * as sinon from 'sinon';

suite('Extension Test Suite', () => {
	test('Command Execute Test', async () => {		
		sinon.mock(closeUnchangedCommand).expects("closeUnchanged").once().callsFake(async ()=>{});
		await vscode.commands.executeCommand("close-tabs.git-unchanged");
		sinon.verifyAndRestore();
	});

});
