const { esptool } = window;

document.getElementById("flash").onclick = async function() {
  try {
    terminal.clean();

    // let ESPLoader request the port itself
    const loader = new window.esptool.ESPLoader(); 

    await loader.main(); // will open the serial port internally

    terminal.writeLine("Connected to ESP");

    const files = [
      { address: 0x1000, data: await fetch("../Firmware/bootloader.bin").then(r => r.arrayBuffer()) },
      { address: 0x8000, data: await fetch("../Firmware/partition-table.bin").then(r => r.arrayBuffer()) },
      { address: 0x10000, data: await fetch("../Firmware/blackwall_firmware.bin").then(r => r.arrayBuffer()) }
    ];

    await loader.writeFlash(files);
    terminal.writeLine("Flash complete!");
  } catch (err) {
    terminal.writeLine("Flashing failed: " + err);
    console.error(err);
  }
};








