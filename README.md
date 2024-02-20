# Driver printer electronJs

Driver printer electronJs ini merupakan driver yang di gunakan sebagai perantara untuk print struk dari aplikasi antrian general dynamic electron js [aplikasi antrian general dynamic electronjs](https://github.com/aderahman007/aplikasi-antrian-general-electronjs)

# Configurasi

Pastikan sudah install node js version >= 18.19.0 di komputer anda

1. Install depedensi

```
npm install
```

2. Comment script pada baris ke 52-58 pada module espos-usb yang berada di directory **node_modules/escpos-usb/index.js**

```
usb.on('detach', function(device){
    if(device == self.device) {
        self.emit('detach'    , device);
        self.emit('disconnect', device);
        self.device = null;
    }
});

menjadi

// usb.on('detach', function(device){
//   if(device == self.device) {
//     self.emit('detach'    , device);
//     self.emit('disconnect', device);
//     self.device = null;
//   }
// });
```

3. Jalankan dengan perintah

```
npm run start
```

# Packaging driver

Untuk melakukan packaging driver agar bisa digunakan pada windows, linux atau mac dapat melakukan perintah ini:
\*Khusus perangkat mac pastikan sudah install **wine-devel** atau **wine-stable** pada perangkat mac agar dapat membuat package untuk system operasi windows

```
npx electron-packager . --overwrite --asar --extra-resource="setting.json" --platform=all --icon=./icons/icon.ico
```

Hasil compile dapat di download melalui link berikut : [Download hasil packaging](https://drive.google.com/drive/folders/1INsunOYVxC0MnRzQqf3EYNkhXANXrOfu?usp=sharing)

# Install driver printer thermal dan configurasi zadig

1. Install driver printer sesuai dengan type dan model
2. Jadikan printer thermal sebagai printer default
3. Download dan Install [Zadig](http://sourceforge.net/projects/libwdi/files/zadig) untuk WinUSB Driver
4. Buka zadig > options > list All Devices
5. Pilih dan ganti driver printer dengan driver WinUSB Zadig
