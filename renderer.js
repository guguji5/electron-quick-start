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

pickBtn.addEventListener("click", function () {
	fileInput.click();
});

fileInput.addEventListener("change", (e) => {
	var filePath = e.target.files[0].path;
	var parentPath = filePath.substring(0, filePath.lastIndexOf("/"));
	submit(parentPath);
});

maxDepth.addEventListener("change", (e) => {
	handleTreeDeep(e.target.value);
});

function handleTreeDeep(depth) {
	var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++) {
		toggler[i].parentElement.style.display =
			depth === "0" || i < depth ? "block" : "none";
	}
}

function submit(folderPath) {
	if (!folderPath) {
		alert("please select a folder");
		return;
	}
	fetch("http://localhost:8096/" + folderPath, {
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.text())
		.then((res) => {
			try {
				let obj = JSON.parse(res);
				document.getElementById("tree").innerHTML = renderFolder(obj);
				bindToggleToFolder();
			} catch (e) {
				alert("解析文件夹结构失败");
			}
		});
}

const fileSvg =
	' <svg t="1706062585538" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7109" width="200" height="200"><path d="M888.494817 313.882803l-198.019982-198.019982c-7.992021-7.992021-20.957311-7.992021-28.949332 0s-7.992021 20.947078 0 28.939099l163.084309 163.084309-215.794811 0L608.814999 42.686195c0-11.307533-9.15859-20.466124-20.466124-20.466124l-408.094512 0c-11.307533 0-20.466124 9.15859-20.466124 20.466124l0 938.62761c0 11.2973 9.15859 20.466124 20.466124 20.466124l693.76067 0c11.307533 0 20.466124-9.168824 20.466124-20.466124l0-652.961452C894.481158 322.92883 892.332215 317.720202 888.494817 313.882803zM853.54891 960.847681l-652.828422 0L200.720488 63.152319l367.162264 0 0 265.200034c0 11.307533 9.168824 20.466124 20.466124 20.466124l265.200034 0L853.54891 960.847681z" p-id="7110"></path></svg>';
const folderSvg =
	'<svg t="1706062164021" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6066" width="200" height="200"><path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v152.021333c36.821333 9.493333 64 42.88 64 82.645333v405.333334a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V298.666667a85.376 85.376 0 0 1 64-82.645334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h597.333334zM128.149333 296.170667L128 298.666667v512a64 64 0 0 0 60.245333 63.893333L192 874.666667h640a64 64 0 0 0 63.893333-60.245334L896 810.666667V405.333333a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 384H638.165333l-122.069333-101.717333a21.333333 21.333333 0 0 0-10.688-4.736l-2.986667-0.213334H149.333333a21.333333 21.333333 0 0 0-21.184 18.837334zM535.189333 213.333333l127.978667 106.666667H832V170.666667a21.333333 21.333333 0 0 0-18.837333-21.184L810.666667 149.333333H213.333333a21.333333 21.333333 0 0 0-21.184 18.837334L192 170.666667v42.666666h343.168z" fill="#333333" p-id="6067"></path></svg>';

function renderLeaf({ name }) {
	return `<li>
                <div class='flex'>
                    ${fileSvg}
                    ${name}
                </div>
            </li>`;
}

function renderFolder({ name, files }) {
	return `
    <li>
        <span class="caret"> ${folderSvg} ${name}  (<strong>${
		files.length
	}</strong>)</span>
        <ul class="nested active">
            ${files
							.map((item) =>
								item.files ? renderFolder(item) : renderLeaf(item)
							)
							.join("")}
        </ul>
    </li>`;
}

const mock = {
	name: "只用来展示",
	files: [
		{ name: "Flashcat.png" },
		{
			name: "我是一个文件夹",
			files: [
				{ name: "changlog.markdown" },
				{ name: "北极星_告警报告.sketch" },
			],
		},
	],
};

document.getElementById("tree").innerHTML = renderFolder(mock);
bindToggleToFolder();

function bindToggleToFolder() {
	var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function () {
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		});
	}
}
