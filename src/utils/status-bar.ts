import * as vscode from "vscode";

class StatusBar {
	#statusBarItem: vscode.StatusBarItem;
	constructor() {
		this.#statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	}

	processing() {
		this.#statusBarItem.show();
		this.#statusBarItem.text = `compiling...`;
	}

	done() {
		this.#statusBarItem.text = `✓ compiled in ${Math.trunc(performance.now())}ms`;
		setTimeout(() => this.#statusBarItem.hide(), 4000);
	}
}

export default new StatusBar();
