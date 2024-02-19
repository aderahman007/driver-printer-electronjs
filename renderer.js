const { contextBridge, ipcRenderer } = require("electron/renderer");
const fs = require("fs");
const path = require("path");

const form = document.getElementById("form-setting");
const liveToast = document.getElementById("liveToast");
const typeToast = document.getElementById("type-toast");
const messageToast = document.getElementById("message-toast");
const toast = new bootstrap.Toast(liveToast);

ipcRenderer.send("readSetting");
ipcRenderer.on("onReadSetting", (even, args) => {
  let setting = JSON.parse(args);
  for (let [key, val] of Object.entries(setting)) {
    document.getElementById(key).value = val;
  }
});

document.getElementById("back_home").addEventListener("click", () => {
  ipcRenderer.send("back", { to: "home" });
});

document.getElementById("test_printer").addEventListener("click", () => {
  ipcRenderer.send("onTestPrint")
});

document.getElementById("test_koneksi_server").addEventListener("click", () => {
  testConnectServer();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataForm = new FormData(form);

  const res = Object.fromEntries(dataForm);
  const payload = JSON.stringify(res);
  saveSetting(payload);
});

const saveSetting = (payload) => {
  ipcRenderer.send("saveSetting", payload);
  ipcRenderer.on("onSaveSetting", (even, args) => {
    typeToast.innerText = args.type;
    messageToast.innerText = args.message;
    toast.show();
  });
};

const testConnectServer = () => {
  ipcRenderer.send("readSetting");
  ipcRenderer.on("onReadSetting", (even, args) => {
    let setting = JSON.parse(args);
    let url =
      "http://" +
      setting.ip_server +
      ":" +
      setting.ip_server_port +
      "/" +
      setting.nama_service_server +
      "/pages/printer/action.php";

    let fetchData = {
      method: "POST",
      body: JSON.stringify({ type: "test_koneksi_server" }),
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
      }),
    };
    const response = fetch(url, fetchData)
      .then((response) => response.json())
      .then((data) => {
        typeToast.innerText = data.message;
        messageToast.innerText = data.data;
        toast.show();
      })
      .catch((error) => {
        console.log(error);
        typeToast.innerText = "Error";
        messageToast.innerText = "Tidak bisa terkoneksi ke server antrian!";
        toast.show();
      });
  });
};
