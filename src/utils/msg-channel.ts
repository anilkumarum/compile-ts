import * as vscode from "vscode";

export enum OutputLevel {
	Trace = 1,
	Debug = 2,
	Information = 3,
	Warning = 4,
	Error = 5,
	Critical = 6,
}
const userLogLevel = OutputLevel.Error;

class MsgChannel {
	#msgChannel: vscode.OutputChannel;

	constructor() {
		this.#msgChannel = vscode.window.createOutputChannel("CompileTs", "typescript");
	}

	info(msg: string, outputLevel = OutputLevel.Trace) {
		outputLevel >= userLogLevel && this.#msgChannel.show();
		this.#msgChannel.appendLine(msg);
	}
}

export default new MsgChannel();
