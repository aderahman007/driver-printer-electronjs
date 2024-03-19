const { app, dialog, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("node:path");
const fs = require("fs");

const isMac = process.platform === "darwin";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 700,
    height: 680,
    maximizable: false,
    // closable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "./preload.js"),
      icon: path.join(__dirname, "./icons/icon.ico"),
    },
  });

  win.on("close", function (e) {
    // import dialog terlebih dahulu pada module electron
    const choice = dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "Are you sure you want to quit?",
    });
    if (choice === 1) {
      e.preventDefault();
    }
  });

  win.loadFile("index.html");

  ipcMain.on("readSetting", (even, args) => {
    if (
      fs.existsSync(path.join(app.getPath("userData"), "./setting.json")) ==
      false
    ) {
      fs.copyFileSync(
        path.join(__dirname, "./setting.json"),
        path.join(app.getPath("userData"), "./setting.json")
      );
    }
    let getFile = fs.readFileSync(
      path.join(app.getPath("userData"), "./setting.json"),
      "utf-8"
    );
    even.sender.send("onReadSetting", getFile);
  });

  ipcMain.on("saveSetting", (even, payload) => {
    fs.writeFileSync(
      path.join(app.getPath("userData"), "./setting.json"),
      payload,
      (err) => {
        // Checking for errors
        if (err) throw err;
      }
    );
    even.sender.send("onSaveSetting", {
      type: "Success",
      message: "Setting printer berhasil disimpan!",
    });
  });

  ipcMain.on("back", (even, args) => {
    if (args.to == "home") {
      win.loadFile("index.html");
    }
  });

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'Settings' }
    {
      label: "Settings",
      submenu: [
        {
          label: "Setting Printer Thermal",
          click: async () => {
            win.loadFile("setting-printer-thermal.html");
          },
        },
        // {
        //   label: "Setting Printer Global",
        //   click: async () => {
        //     const { shell } = require("electron");
        //     await shell.openExternal("https://electronjs.org");
        //   },
        // }
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [{ type: "separator" }, { role: "front" }]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "Help",
      submenu: [
        {
          label: "Butuh Bantuan?",
          click: () => {
            dialog.showMessageBoxSync({
              type: "info",
              title: "Bantuan",
              message: "Hubungi aderahman9908@gmail.com",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

ipcMain.on("onTestPrint", (even, args) => {
  const { testPrinter } = require("./printer");
  testPrinter();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
