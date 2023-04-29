const { test } = require("node:test");
const assert = require("node:assert");
const { getOuputFilePath } = require("../../out/utils/helper.js");

//TODO write test
test("synchronous passing test", async (t) => {
	const outFilePath = await getOuputFilePath(process.cwd(), "/src/index.ts");
	assert.strictEqual(outFilePath, process.cwd() + "/out/index.ts");
});
