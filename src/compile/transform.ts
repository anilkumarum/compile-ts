let typescriptPath = "/usr/local/lib/node_modules/typescript";
process.platform === "win32" &&
	(typescriptPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\Roaming\\npm\\node_modules\\typescript`);
import { transpileModule } from typescriptPath;
import * as vscode from "vscode";
import { readFile, writeFile,stat } from "node:fs/promises";
import { Buffer } from "node:buffer";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";
import { getOuputFilePath } from "../utils/helper.js";
import { tscConfig } from "../utils/config.js";

export default async function transform(workspaceFolder: string, filePath: string) {
	try {
		const source = await readFile(workspaceFolder + filePath, { encoding: "utf8" });
		if (!source) return console.error("cannot read file");
		const result = transpileModule(source, tscConfig);
		if (!result.outputText) throw new Error("cannot compile");

		const data = new Uint8Array(Buffer.from(result.outputText));
		const outFilePath = await getOuputFilePath(workspaceFolder, filePath.slice(1)); //remove "/"
		await writeFile(outFilePath, data);
	} catch (error) {
		msgChannel.info("cannot compile", OutputLevel.Error);
	}
}

export async function checkTsPackageExist(){ 
	try {
		const fsStat = await stat(typescriptPath);
		return fsStat
	} catch (error) {
		vscode.window.showErrorMessage('typescript not found globally. try: npm i -g typescript');
	}
}