let typescriptPath = "/usr/local/lib/node_modules/typescript";
process.platform === "win32" &&
	(typescriptPath = `C:\\Users\\${process.env.USER}\\AppData\\Roaming\\npm\\node_modules`);
import * as vscode from "vscode";
import { transpileModule } from "/usr/local/lib/node_modules/typescript";
import { readFile, writeFile, mkdir, access, constants } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { tscConfig } from "./compile.js";
import { basename, dirname, join } from "node:path";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";

export const userConfig = {
	outDir: "out",
	rootDir: "src",
};

export default async function transform(filePath: string) {
	try {
		const source = await readFile(filePath, { encoding: "utf8" });
		if (!source) return console.error("cannot read file");
		const result = transpileModule(source, tscConfig);
		if (!result.outputText) throw new Error("cannot compile");
		const data = new Uint8Array(Buffer.from(result.outputText));
		await outputFile(filePath, data);
	} catch (error) {
		msgChannel.info("cannot compile", OutputLevel.Error);
	}
}

const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;
const workspacePathLength = (workspaceFolder + "/" + userConfig.rootDir).length;
async function outputFile(filePath: string, data: Uint8Array) {
	const fileDir = dirname(filePath).slice(workspacePathLength);
	const dirPath = join(workspaceFolder, userConfig.outDir, fileDir !== "src" ? fileDir : "");

	const fileName = basename(filePath, ".ts");
	const outFilePath = join(dirPath, fileName + ".js");
	if (await createDirIfNotExist(dirPath)) await writeFile(outFilePath, data).catch((err) => console.error(err));
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
