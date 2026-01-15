import { ESPLoader, Transport } from '../lib/index.js';  // point to your lib

const terminalEl = document.getElementById("terminal");

const terminal = {
  write(data) {
    terminalEl.textContent += data;
    terminalEl.scrollTop = terminalEl.scrollHeight;
  },
  writeLine(data) {
    terminalEl.textContent += data + "\n";
    terminalEl.scrollTop = terminalEl.scrollHeight;
  },
  clean() {
    terminalEl.textContent = "";
  }
};

document.getElementById("flash").onclick = async function() {
  try {
    terminal.clean();

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 921600 });

    const transport = new Transport(port);

    const loader = new ESPLoader({
      transport,
      baudrate: 921600,
      terminal
    });

    await loader.main();

    terminal.writeLine("Connected to ESP");

    const files = [
      { address: 0x1000, data: await fetch("../firmware/bootloader.bin").then(r => r.arrayBuffer()) },
      { address: 0x8000, data: await fetch("../firmware/partition-table.bin").then(r => r.arrayBuffer()) },
      { address: 0x10000, data: await fetch("../firmware/blackwall_firmware.bin").then(r => r.arrayBuffer()) }
    ];

    await loader.writeFlash(files);
    terminal.writeLine("Flash complete!");

  } catch (err) {
    terminal.writeLine("Flashing failed: " + err);
    console.error(err);
  }
};
