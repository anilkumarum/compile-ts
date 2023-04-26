import { storeDb } from "../extension.js";
import { statSync } from "node:fs";
import * as vscode from "vscode";

export function isFileModified(filePath: string): boolean {
	const filemTime: string = storeDb.get(filePath);
	if (!filemTime) return true;

	const fstat = statSync(filePath);
	if (new Date(fstat.mtime) > new Date(filemTime)) {
		storeDb.update(filePath, fstat.mtime);
		return true;
	}
}

export function getUserConfig(section: string) {
	return vscode.workspace.getConfiguration("compilets." + section);
}
