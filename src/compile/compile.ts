import * as vscode from "vscode";
import { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";
import statusBar from "../utils/status-bar.js";
import { isFileModified } from "../utils/helper.js";
import transform from "./transform.js";
import { userConfig } from "../utils/config.js";

async function walkDir(workspaceFolder, source: string) {
	const dirents: Dirent[] = await readdir(workspaceFolder + source, { withFileTypes: true });

	const promises = [];
	for (const dirent of dirents) {
		const dirPath = `${source}/${dirent.name}`;
		if (dirent.isDirectory()) walkDir(workspaceFolder, dirPath);
		else if (isFileModified(workspaceFolder + dirPath)) promises.push(transform(workspaceFolder, dirPath));
	}

	return await Promise.all(promises);
}

export async function compileDir() {
	statusBar.processing();
	const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
	for (const rootDir of userConfig.rootDir) {
		await walkDir(workspaceFolder, "/" + rootDir).catch((err) => msgChannel.info(err, OutputLevel.Error));
	}
	statusBar.done();
}

export async function compileOnSave(textDocument: vscode.TextDocument): Promise<void> {
	const fileName = textDocument.fileName;
	if (!fileName.endsWith("ts")) return;

	statusBar.processing();
	msgChannel.info(fileName);
	const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
	const filePath = textDocument.fileName.slice(workspaceFolder.length);
	await transform(workspaceFolder, filePath).catch((err) => msgChannel.info(err, OutputLevel.Error));
	statusBar.done();
}
