import { transformFile } from "@swc/core";
import { writeFile, mkdir, access, constants } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { swcconfig, workspaceFolder } from "./compile.js";
import { basename, dirname, join } from "node:path";
import msgChannel, { OutputLevel } from "../utils/msg-channel.js";

export const userConfig = {
	outDir: "out",
	rootDir: "src",
};

export default async function transform(filePath: string) {
	try {
		const { code } = await transformFile(filePath, swcconfig);
		const data = new Uint8Array(Buffer.from(code));
		await outputFile(filePath, data);
	} catch (error) {
		msgChannel.info("cannot compile", OutputLevel.Error);
	}
}

const workspacePathLength = (workspaceFolder + "/" + userConfig.rootDir).length;
async function outputFile(filePath: string, data: Uint8Array) {
	const fileDir = dirname(filePath).slice(workspacePathLength);
	const dirPath = join(workspaceFolder, userConfig.outDir, fileDir);

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
