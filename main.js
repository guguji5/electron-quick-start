// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
let converter = require("json-2-csv");
let tree;

http
	.createServer((req, res) => {
		if (req.url.startsWith("/folderPath")) {
			const folderPath = decodeURIComponent(req.url.substring(12));
			tree = buildFileTreebyPath(folderPath);
			res.end(JSON.stringify(tree));
		} else if (req.url.startsWith("/export")) {
			const maxDepth = req.url.substring(8);
			const name = tree?.name;
			const excle = mapBinaryArr2Obj(
				appendTotalOfEveryLine(
					tree2List(tree, maxDepth !== "0" ? maxDepth : Infinity)
				)
			);
			converter.json2csv(excle, (err, csv) => {
				fs.writeFileSync(name + ".csv", csv);
				res.end(name + ".csv");
			});
		} else {
			res.end("aaa");
		}
	})
	.listen(8096);

// name 可能为文件夹名字，也可能为文件名字
// 如果为文件夹，则files为文件夹下的文件列表, 如果为文件，则files为undefined
// { name: "",files: [] };

function getLastFolderNameBy(path) {
	let arr = path.split("/");
	return arr[arr.length - 1];
}

function tree2List(tree, depth) {
	const binaryArr = [];
	function walkTree(tree, cb, parent = {}) {
		cb(tree, parent);
		if (tree.files) {
			tree.files.forEach((item) => walkTree(item, cb, tree));
		}
	}
	walkTree(tree, (item, parent) => {
		item.path = parent.path ? [...parent.path, item.name] : [item.name];
		binaryArr.push(parent.path ? [...parent.path, item.name] : [item.name]);
	});
	return binaryArr.map((arr) => arr.slice(0, depth));
}

function appendTotalOfEveryLine(binaryArr) {
	const nameMap = new Map();
	const maxLengthInBinaryArr = Math.max(...binaryArr.map((arr) => arr.length));
	const flattenArr = binaryArr.flat();
	for (let i = 0; i < flattenArr.length; i++) {
		const name = flattenArr[i];
		if (nameMap.has(name)) {
			nameMap.set(name, nameMap.get(name) + 1);
		} else {
			nameMap.set(name, 1);
		}
	}
	for (let i = 0; i < binaryArr.length; i++) {
		const arr = binaryArr[i];
		arr[maxLengthInBinaryArr] = nameMap.get(arr[arr.length - 1]);
	}
	return binaryArr;
}

function mapBinaryArr2Obj(binaryArr) {
	const maxLengthInBinaryArr = Math.max(...binaryArr.map((arr) => arr.length));
	return binaryArr.map((arr) => {
		const obj = {};
		for (let i = 0; i < maxLengthInBinaryArr; i++) {
			obj[maxLengthInBinaryArr === i + 1 ? "total" : `level${i || ""}`] =
				arr[i] || "";
		}
		return obj;
	});
}

function buildFileTreebyPath(path) {
	let stat = fs.statSync(path);
	if (!stat.isDirectory()) {
		return null;
	}
	let files = fs.readdirSync(path);
	return {
		name: getLastFolderNameBy(path),
		files: files.map((file) => {
			const subpath = `${path}/${file}`;
			let stat = fs.statSync(subpath);
			if (stat.isDirectory()) {
				return buildFileTreebyPath(`${path}/${file}`);
			} else {
				return { name: file };
			}
		}),
	};
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
