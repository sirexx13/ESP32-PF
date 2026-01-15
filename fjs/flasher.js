const { esptool } = window;


document.getElementById("flash").onclick = async () => {
  try {
    // request the serial port
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 921600 });

    // create transport and loader from the bundle
    const transport = new esptool.Transport(port);
    const loader = new esptool.ESPLoader({
      transport: new esptool.Transport(port),
      baudrate: 921600,
      terminal: {
        clean() {},
        write(data) { console.log(data); },        // required by esptool
        writeLine(data) { console.log(data + "\n"); } // optional
      }
    });


    await loader.main();
    console.log("Connected to ESP");

    // prepare firmware files
    const files = [
      {
        address: 0x1000,
        data: await fetch("../Firmware/bootloader.bin").then(r => r.arrayBuffer())
      },
      {
        address: 0x8000,
        data: await fetch("../Firmware/partition-table.bin").then(r => r.arrayBuffer())
      },
      {
        address: 0x10000,
        data: await fetch("../Firmware/blackwall_firmware.bin").then(r => r.arrayBuffer())
      }
    ];

    await loader.writeFlash(files);
    alert("Flash complete");
  } catch (err) {
    console.error(err);
    alert("Flashing failed. Check console.");
  }
};











