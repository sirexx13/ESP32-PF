document.getElementById("flash").onclick = async () => {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 921600 });

  const transport = new esptool.Transport(port);

  const loader = new esptool.ESPLoader({
    transport,
    baudrate: 921600,
    terminal: {
      clean() {},
      writeLine(data) { console.log(data); }
    }
  });

  await loader.main();

  console.log("Connected to ESP");

  const files = [
    { address: 0x1000, data: await fetch("firmware/bootloader.bin").then(r => r.arrayBuffer()) },
    { address: 0x8000, data: await fetch("firmware/partition-table.bin").then(r => r.arrayBuffer()) },
    { address: 0x10000, data: await fetch("firmware/blackwall_firmware.bin").then(r => r.arrayBuffer()) }
  ];

  await loader.writeFlash(files);
  alert("Flash complete");
};








