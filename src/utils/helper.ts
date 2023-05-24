import { storeDb } from "../extension.js";
import { statSync } from "node:fs";
import { mkdir, access, constants } from "node:fs/promises";
import * as path from "node:path";
import { userConfig } from "./config.js";
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

export async function getOuputFilePath(workspaceFolder: string, filePath: string): Promise<string> {
	let fileDir = sliceRootDir(filePath);
	const dirPath = path.join(workspaceFolder, userConfig.outDir, path.dirname(fileDir));
	const fileName = path.basename(filePath, ".ts");
	const outFilePath = path.join(dirPath, fileName + ".js");
	await createDirIfNotExist(dirPath);
	return outFilePath;
}

export async function getOutputCopyPath(workspaceFolder: string, filePath: string): Promise<string> {
	let fileDir = sliceRootDir(filePath);
	const dirPath = path.join(workspaceFolder, userConfig.outDir, path.dirname(fileDir));
	const fileName = path.basename(filePath);
	const outFilePath = path.join(dirPath, fileName);
	await createDirIfNotExist(dirPath);
	return outFilePath;
}

var rootDir;
function sliceRootDir(filePath: string) {
	rootDir ??= userConfig.rootDir[0].split(path.sep);
	let i = rootDir.length + 1;
	while (--i) filePath = filePath.slice(filePath.indexOf(path.sep) + 1);
	return filePath;
}

async function createDirIfNotExist(dirPath: string) {
	try {
		await access(dirPath, constants.R_OK | constants.W_OK);
		return true;
	} catch (error) {
		await mkdir(dirPath, { recursive: true }).catch((err) => console.error(err));
		return true;
	}
}

export function runCustomCommand(userCommand) {
	const command: string = vscode.workspace.getConfiguration("cssnestingCompiler.custom").get(userCommand);
	if (command) {
		const terminal = vscode.window.createTerminal(`compileTs command #${Date.now()}`);
		terminal.show();
		terminal.sendText(command);
	}
}
