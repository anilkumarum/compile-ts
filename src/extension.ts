import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import { compileDir, compileOnSave } from "./compile/compile.js";
import { runCustomCommand } from "./utils/helper.js";

export let storeDb: vscode.Memento;
export function activate(context: ExtensionContext) {
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
