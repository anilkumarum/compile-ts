import * as vscode from "vscode";

export enum ModuleKind {
	CommonJS = 1,
	AMD = 2,
	UMD = 3,
	System = 4,
	ES2015 = 5,
	ES2020 = 6,
	ES2022 = 7,
	ESNext = 99,
	Node16 = 100,
	NodeNext = 199,
}

enum ScriptTarget {
	ES3 = 0,
	ES5 = 1,
	ES2015 = 2,
	ES2016 = 3,
	ES2017 = 4,
	ES2018 = 5,
	ES2019 = 6,
	ES2020 = 7,
	ES2021 = 8,
	ES2022 = 9,
	ESNext = 99,
	JSON = 100,
	Latest = 99,
}

type UserConfig = {
	rootDir: string[];
	outDir: string;
	extension: string;
	module: string;
	//tscConfig: object;
};

const configMap = vscode.workspace.getConfiguration("compilets.config");

export const userConfig: UserConfig = {
	module: configMap.get("module"),
	rootDir: configMap.get("rootDirectory"),
	outDir: configMap.get("outDirectory"),
	extension: configMap.get("extension"),
	//tscConfig: configMap.get("tscConfig"),
};

export const tscConfig = {
	compilerOptions: { module: ModuleKind[userConfig.module] || 1, target: ScriptTarget.ES2021 },
};
// Object.assign(tscConfig, tscConfig);
