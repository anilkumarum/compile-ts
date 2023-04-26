import * as vscode from "vscode";
import { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import { Options as swcConfig } from "@swc/core/types.js";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";
import statusBar from "../utils/status-bar.js";
import { isFileModified } from "../utils/helper.js";

export const userConfig = {
	outDir: "out",
	rootDir: "src",
};

export const swcconfig: swcConfig = {
	sourceMaps: false,
	isModule: true,
	minify: false,
	jsc: {
		parser: {
			syntax: "typescript",
		},
		target: "es2021",
		transform: {},
		loose: true,
		keepClassNames: true,
	},

	module: {
		type: "commonjs",
	},
};

export const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
import transform from "./transform.js";

async function walkDir(source: string) {
	const dirents: Dirent[] = await readdir(source, { withFileTypes: true });

	const promises = [];
	for (const dirent of dirents) {
		const dirPath = `${source}/${dirent.name}`;
		if (dirent.isDirectory()) walkDir(dirPath);
		else if (isFileModified(dirPath)) promises.push(transform(dirPath));
	}

	await Promise.all(promises);
}

export async function compileDir() {
	statusBar.processing();
	const rootDirPath = `${workspaceFolder}/${userConfig.rootDir}`;
	await walkDir(rootDirPath).catch((err) => msgChannel.info(err, OutputLevel.Error));
	statusBar.done();
}

export async function compileOnSave(textDocument: vscode.TextDocument): Promise<void> {
	const fileName = textDocument.fileName;
	if (!fileName.endsWith("ts")) return;

	statusBar.processing();
	msgChannel.info(fileName);

	await transform(textDocument.fileName).catch((err) => msgChannel.info(err, OutputLevel.Error));
	statusBar.done();
}
