const { esptool } = window;


// flasher.js
document.getElementById("flash").onclick = async function() {
  try {
    window.terminal.clean();

    const loader = new window.esptool.ESPLoader(); // no args
    await loader.main();

    window.terminal.writeLine("Connected to ESP");

    const files = [
      { address: 0x1000, data: await fetch("../Firmware/bootloader.bin").then(r => r.arrayBuffer()) },
      { address: 0x8000, data: await fetch("../Firmware/partition-table.bin").then(r => r.arrayBuffer()) },
      { address: 0x10000, data: await fetch("../Firmware/blackwall_firmware.bin").then(r => r.arrayBuffer()) }
    ];

    await loader.writeFlash(files);
    window.terminal.writeLine("Flash complete!");
  } catch (err) {
    window.terminal.writeLine("Flashing failed: " + err);
    console.error(err);
  }
};






