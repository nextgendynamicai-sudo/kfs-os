const fs = require('fs');
const pngToIco = require('png-to-ico');

pngToIco('public/kfs-logo.png')
  .then(buf => {
    fs.writeFileSync('public/kfs-logo.ico', buf);
    console.log('Successfully created kfs-logo.ico');
  })
  .catch(console.error);
