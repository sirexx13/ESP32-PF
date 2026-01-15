import { ESPLoader } from "https://unpkg.com/esptool-js@latest/dist/web/index.js";

document.getElementById("flash").onclick = async () => {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 921600 });

  const loader = new ESPLoader({
    transport: port,
    baudrate: 921600,
    terminal: {
      clean() {},
      writeLine(data) { console.log(data); }
    }
  });

  await loader.main();

  const files = [
    {
      address: 0x1000,
      data: await fetch("Firmware/bootloader.bin").then(r => r.arrayBuffer())
    },
    {
      address: 0x8000,
      data: await fetch("Firmware/partition-table.bin").then(r => r.arrayBuffer())
    },
    {
      address: 0x10000,
      data: await fetch("Firmware/blackwall_firmware.bin").then(r => r.arrayBuffer())
    }
  ];

  await loader.writeFlash(files);
  alert("Flash complete");
};

