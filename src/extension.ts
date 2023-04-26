import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { compileDir, compileOnSave } from "./compile/compile.js";
import { getUserConfig } from "./utils/helper.js";

export let storeDb: vscode.Memento;
export function activate(context: ExtensionContext) {
	const disposableCompiler = vscode.commands.registerCommand("compilets.compileTs", async () => {
		await compileDir();
		//command run after compile
		if (getUserConfig("custom").get("runCommand")) {
			const terminal = vscode.window.createTerminal(`compileTs command #${Date.now()}`);
			terminal.show();
			terminal.sendText("echo 'Sent text immediately after creating'");
		}
	});

	const disposableOnDidSave = vscode.workspace.onDidSaveTextDocument(async (textDocument) => {
		if (vscode.debug.activeDebugSession) {
			await compileOnSave(textDocument);
			vscode.commands.executeCommand("workbench.action.debug.restart");
		}
	});
	storeDb = context.workspaceState;
	context.subscriptions.push(disposableCompiler);
	context.subscriptions.push(disposableOnDidSave);
}
