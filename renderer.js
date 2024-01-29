/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
var pickBtn = document.getElementById("pick-btn");
var fileInput = document.getElementById("fileInput");
var maxDepth = document.getElementById("max-depth");
var exportBtn = document.getElementById("export");

pickBtn.addEventListener("click", function () {
	fileInput.click();
});

fileInput.addEventListener("change", (e) => {
	var filePath = e.target.files[0].path;
	var parentPath = filePath.substring(0, filePath.lastIndexOf("/"));
	renderTree(parentPath);
	exportBtn.style.display = "inline";
});

maxDepth.addEventListener("change", (e) => {
	handleTreeDeep(e.target.value);
});

exportBtn.addEventListener("click", (e) => {
	export2Excel();
});

document.getElementById("tree").innerHTML = renderFolder(mock);
bindToggleToFolder();
