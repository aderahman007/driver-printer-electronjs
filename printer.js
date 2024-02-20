const escpos = require('escpos');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ };
// encoding is optional

const printer = new escpos.Printer(device, options);

const getCurrentDate = () => {
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = date.getMonth();
    var tanggal = date.getDate();
    var hari = date.getDay();
    var jam = date.getHours();
    var menit = date.getMinutes();
    var detik = date.getSeconds();
  
    switch(hari) {
      case 0: hari = "Minggu"; break;
      case 1: hari = "Senin"; break;
      case 2: hari = "Selasa"; break;
      case 3: hari = "Rabu"; break;
      case 4: hari = "Kamis"; break;
      case 5: hari = "Jum'at"; break;
      case 6: hari = "Sabtu"; break;
    }
    switch(bulan) {
      case 0: bulan = "Januari"; break;
      case 1: bulan = "Februari"; break;
      case 2: bulan = "Maret"; break;
      case 3: bulan = "April"; break;
      case 4: bulan = "Mei"; break;
      case 5: bulan = "Juni"; break;
      case 6: bulan = "Juli"; break;
      case 7: bulan = "Agustus"; break;
      case 8: bulan = "September"; break;
      case 9: bulan = "Oktober"; break;
      case 10: bulan = "November"; break;
      case 11: bulan = "Desember"; break;
    }
    return  hari + ", " + tanggal + " " + bulan + " " + tahun;
}

const testPrinter = () => {
    device.open(function(error){
        if (!error) {
            printer
            .align('ct')
            .font('A')
            .align('ct')
            .style("NORMAL")
            .size(1, 1)
            .text('Test Printer Success')
            .style("NORMAL")
            .size(0.05, 0.05)
            .text('Driver Printer Thermal Version 1.0.0')
            .newLine()
            .newLine()
            .newLine()
            .newLine()
            .marginBottom(20)
            .cut()
            .close();
        }else{
         dialog.showErrorBox("Opps!", error);
        }
    });
}

const printAntrian = (no_antrian = "", code_antrian = "", config = {}) => {
    console.log(config);
    device.open(function(error){
        if (!error) {
            printer
            .font('A')
            .align('CT')
            .style("B")
            .size(1, 1)
            .text(config.nama_instansi)

            .font('A')
            .align('CT')
            .style("NORMAL")
            .size(0.001, 0.001)
            .text(config.alamat)
            .drawLine()
            .newLine()

            .font('A')
            .align('CT')
            .style("B")
            .size(1.5, 1.5)
            .text('NOMOR ANTRIAN ANDA')
            .newLine()
            .newLine()

            .font('A')
            .align('CT')
            .style("B")
            .size(2, 2)
            .text(code_antrian+no_antrian)
            .newLine()
            .newLine()

            .font('A')
            .align('CT')
            .style("NORMAL")
            .size(0.001, 0.001)
            .text('Silahkan menunggu nomor antrian dipanggil \n Nomor ini hanya berlaku pada hari dicetak \n ' + getCurrentDate())
            .newLine()

            .font('A')
            .align('CT')
            .style("B")
            .size(0.5, 0.5)
            .text('TERIMA KASIH, ANDA TELAH TERTIB')

            .newLine()
            .newLine()
            .newLine()
            .newLine()
            .marginBottom(20)
            .cut()
            .close();
        }else{
            dialog.showErrorBox("Opps!", error);
        }
    });
}
module.exports = { testPrinter, printAntrian }