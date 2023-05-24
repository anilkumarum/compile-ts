import * as vscode from "vscode";
import { Dirent } from "node:fs";
import { readdir, copyFile } from "node:fs/promises";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";
import { getOutputCopyPath, isFileModified } from "../utils/helper.js";
import statusBar from "../utils/status-bar.js";
import { userConfig } from "../utils/config.js";
import transform from "./transform.js";
import path = require("node:path");

async function walkDir(workspaceFolder: string, source: string) {
	const dirents: Dirent[] = await readdir(workspaceFolder + source, { withFileTypes: true });

	const promises = [];
	for (const dirent of dirents) {
		const dirPath = `${source}${path.sep}${dirent.name}`;
		if (dirent.isDirectory()) walkDir(workspaceFolder, dirPath);
		else if (isFileModified(workspaceFolder + dirPath)) {
			if (dirent.name.endsWith(".ts")) promises.push(transform(workspaceFolder, dirPath));
			else {
				const outFilePath = await getOutputCopyPath(workspaceFolder, dirPath.slice(1)); //remove "/"
				promises.push(copyFile(workspaceFolder + dirPath, outFilePath));
			}
		}
	}

	return await Promise.all(promises);
}

export async function compileDir() {
	statusBar.processing();
	const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
	for (const rootDir of userConfig.rootDir) {
		await walkDir(workspaceFolder, path.sep + rootDir).catch((err) => msgChannel.info(err, OutputLevel.Error));
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
