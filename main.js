// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");

http
	.createServer((req, res) => {
		res.end(JSON.stringify(buildFileTreebyPath(decodeURIComponent(req.url))));
	})
	.listen(8096);

// name 可能为文件夹名字，也可能为文件名字
// 如果为文件夹，则files为文件夹下的文件列表, 如果为文件，则files为undefined
// { name: "",files: [] };

function getLastFolderNameBy(path) {
	let arr = path.split("/");
	return arr[arr.length - 1];
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
