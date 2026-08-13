const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal ZIP file generator in pure Node.js (no external deps)
function createZipBuffer(files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const dataBuf = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf8');

    // CRC32 calculation
    let crc = 0 ^ (-1);
    for (let i = 0; i < dataBuf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ dataBuf[i]) & 0xff];
    }
    crc = (crc ^ (-1)) >>> 0;

    // Local Header
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // Signature
    lh.writeUInt16LE(20, 4); // Version needed
    lh.writeUInt16LE(0, 6); // Flags
    lh.writeUInt16LE(0, 8); // Compression method (store = 0)
    lh.writeUInt16LE(0, 10); // Mod time
    lh.writeUInt16LE(0, 12); // Mod date
    lh.writeUInt32LE(crc, 14); // CRC32
    lh.writeUInt32LE(dataBuf.length, 18); // Compressed size
    lh.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    lh.writeUInt16LE(nameBuf.length, 26); // Filename length
    lh.writeUInt16LE(0, 28); // Extra field length
    nameBuf.copy(lh, 30);

    // Central Directory Header
    const ch = Buffer.alloc(46 + nameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0); // Signature
    ch.writeUInt16LE(20, 4); // Version made by
    ch.writeUInt16LE(20, 6); // Version needed
    ch.writeUInt16LE(0, 8); // Flags
    ch.writeUInt16LE(0, 10); // Compression
    ch.writeUInt16LE(0, 12); // Mod time
    ch.writeUInt16LE(0, 14); // Mod date
    ch.writeUInt32LE(crc, 16); // CRC32
    ch.writeUInt32LE(dataBuf.length, 20); // Compressed size
    ch.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
    ch.writeUInt16LE(nameBuf.length, 28); // Filename length
    ch.writeUInt16LE(0, 30); // Extra field length
    ch.writeUInt16LE(0, 32); // Comment length
    ch.writeUInt16LE(0, 34); // Disk start
    ch.writeUInt16LE(0, 36); // Internal attr
    ch.writeUInt32LE(0, 38); // External attr
    ch.writeUInt32LE(offset, 42); // Offset of local header
    nameBuf.copy(ch, 46);

    localHeaders.push(Buffer.concat([lh, dataBuf]));
    centralHeaders.push(ch);

    offset += lh.length + dataBuf.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const ch of centralHeaders) {
    cdSize += ch.length;
  }

  // End of Central Directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // Signature
  eocd.writeUInt16LE(0, 4); // Disk num
  eocd.writeUInt16LE(0, 6); // CD Disk num
  eocd.writeUInt16LE(files.length, 8); // Disk entries
  eocd.writeUInt16LE(files.length, 10); // Total entries
  eocd.writeUInt32LE(cdSize, 12); // CD size
  eocd.writeUInt32LE(cdOffset, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

// Build CRC Table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

const apkFiles = [
  { name: 'AndroidManifest.xml', content: '<?xml version="1.0" encoding="utf-8"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.kreatek.kfsos"><application android:label="KFS OS WebApp"></application></manifest>' },
  { name: 'assets/app.json', content: JSON.stringify({ name: "KFS-OS", package: "com.kreatek.kfsos", version: "8.0.0", url: "https://kfs-os.vercel.app" }) },
  { name: 'META-INF/MANIFEST.MF', content: 'Manifest-Version: 1.0\r\nCreated-By: KFS OS Build Tools\r\n' }
];

const targetPath = path.join(__dirname, '..', 'public', 'kfs-os.apk');
const zipBuf = createZipBuffer(apkFiles);
fs.writeFileSync(targetPath, zipBuf);
console.log(`✅ File generated successfully at ${targetPath} (${zipBuf.length} bytes)`);
