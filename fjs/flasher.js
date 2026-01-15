const { esptool } = window;


document.getElementById("flash").onclick = async () => {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 921600 });

    const transport = new esptool.Transport(port);

    const loader = new esptool.ESPLoader({
      transport: new esptool.Transport(port),
      baudrate: 921600,
      terminal: console   // just pass the browser console object
    });


    await loader.main();
    console.log("Connected to ESP");

    const files = [
      { address: 0x1000, data: await fetch("../Firmware/bootloader.bin").then(r => r.arrayBuffer()) },
      { address: 0x8000, data: await fetch("../Firmware/partition-table.bin").then(r => r.arrayBuffer()) },
      { address: 0x10000, data: await fetch("..Firmware/blackwall_firmware.bin").then(r => r.arrayBuffer()) }
    ];

    await loader.writeFlash(files);
    alert("Flash complete");

  } catch (err) {
    console.error(err);
    alert("Flashing failed. Check console.");
  }
};













