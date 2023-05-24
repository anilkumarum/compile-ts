import * as vscode from "vscode";
import { compileDir, compileOnSave } from "./compile/compile.js";
import { runCustomCommand } from "./utils/helper.js";
import msgChannel from "./utils/msg-channel.js";
import { checkTsPackageExist } from "./compile/transform.js";

export let storeDb: vscode.Memento;
export async function activate(context: vscode.ExtensionContext) {
	if (context.workspaceState.get("tsModuleExist")) {
		const tsPkg = await checkTsPackageExist();
		if (tsPkg) context.workspaceState.update("tsModuleExist", true);
	}

	const disposableCompiler = vscode.commands.registerCommand("compilets.compileTs", async () => {
		await compileDir();
		//command run after compile
		runCustomCommand("runCompileCommand");
	});

	const disposableWatcher = vscode.commands.registerCommand("compilets.watchTs", async () => {
		const disposableOnDidSave = vscode.workspace.onDidSaveTextDocument(async (textDocument) => {
			if (textDocument.languageId === "typescript" || textDocument.languageId === "typescriptreact") {
				await compileOnSave(textDocument);
				runCustomCommand("runCompileCommand");
			}
		});
		context.subscriptions.push(disposableOnDidSave);
	});

	const disposableOnDidSave = vscode.workspace.onDidSaveTextDocument(async (textDocument) => {
		if (vscode.debug.activeDebugSession) {
			if (textDocument.languageId === "typescript" || textDocument.languageId === "typescriptreact") {
				await compileOnSave(textDocument);
				vscode.commands.executeCommand("workbench.action.debug.restart");
			}
		}
	});
	storeDb = context.workspaceState;
	context.subscriptions.push(disposableCompiler);
	context.subscriptions.push(disposableWatcher);
	context.subscriptions.push(disposableOnDidSave);
}

export function deactivate() {
	msgChannel.dispose();
}
