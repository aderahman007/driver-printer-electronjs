const { ipcRenderer } = require("electron/renderer");

const getPrinterNetwork = async (setting) => {
    let url = "http://" + setting.ip_server + ":" + setting.ip_server_port + ((setting.using_virtualhost_on_server === 'tidak') ? "/" + setting.nama_service_server : '') + "/pages/printer/action.php";
    let fetchData = {
        method: "POST",
        body: JSON.stringify({ type: "get_antrian_printer" }),
        headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        }),
    };
    try {
        const response = await fetch(url, fetchData);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const deletePrinterNetwork = async (setting, id) => {
    let url = "http://" + setting.ip_server + ":" + setting.ip_server_port + ((setting.using_virtualhost_on_server === 'tidak') ? "/" + setting.nama_service_server : '') + "/pages/printer/action.php";
    let fetchData = {
        method: "POST",
        body: JSON.stringify({ type: "delete_antrian_printer", id: id }),
        headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        }),
    };
    try {
        const response = await fetch(url, fetchData);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const prosesGetDeletePrinterNetwork = async () => {
    ipcRenderer.send("readSetting");
    ipcRenderer.on("onReadSetting", async (even, args) => {
        let setting = JSON.parse(args);
        console.log(setting);
        if (setting.type_koneksi_server == "network") {
        const { printAntrian } = require("./printer");
        let data = await getPrinterNetwork(setting);
        if (data.success) {
            for (let i = 0; i < data.data.antrian.length; i++) {
            const element = data.data.antrian[i];
            printAntrian(element.no_antrian, element.code_antrian, data.data.config);
            const deleted = await deletePrinterNetwork(setting, element.id);
            if (deleted.success) {
                console.log(element);
                setTimeout(prosesGetDeletePrinterNetwork, 500);
            }
            }
        }
        }
    });
}

setInterval(prosesGetDeletePrinterNetwork, 1000);