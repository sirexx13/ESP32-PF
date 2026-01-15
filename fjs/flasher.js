import {
  ESPLoader,
  Transport
} from "https://app.unpkg.com/esptool-js/bundle.js";

const connectBtn = document.getElementById("connect");
const flashBtn   = document.getElementById("flash");
const logEl      = document.getElementById("log");

let transport;
let esploader;

function log(msg) {
  logEl.textContent += msg + "\n";
  logEl.scrollTop = logEl.scrollHeight;
}

connectBtn.onclick = async () => {
  try {
    const port = await navigator.serial.requestPort();
    transport = new Transport(port);

    esploader = new ESPLoader({
      transport,
      baudrate: 921600,
      terminal: { write: log }
    });

    log("[*] Connecting to ESP32...");
    await esploader.main();
    log("[+] Connected");
    log(`[+] Chip: ${esploader.chipName}`);

    flashBtn.disabled = false;
  } catch (e) {
    log("[!] Connection failed");
    log(e.message);
  }
};

flashBtn.onclick = async () => {
  try {
    log("[*] Starting flash");

    const files = [
      { address: 0x1000, data: await fetchBin("../Firmware/bootloader.bin") },
      { address: 0x8000, data: await fetchBin("../Firmware/partition-table.bin") },
      { address: 0x10000, data: await fetchBin("../Firmware/blackwall_firmware.bin") }
    ];

    await esploader.writeFlash({
      fileArray: files,
      flashSize: "keep",
      eraseAll: false,
      compress: true
    });

    log("[+] Flash complete");
  } catch (e) {
    log("[!] Flash failed");
    log(e.message);
  }
};

async function fetchBin(path) {
  const res = await fetch(path);
  return new Uint8Array(await res.arrayBuffer());
}



