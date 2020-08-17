const crypto = require('crypto');
const fs = require('fs');

function hash(filename) {
  const hash = crypto.createHash('sha256');
  
  const input = fs.createReadStream(filename);

  return new Promise((resolve, reject) => {
    input.on('readable', () => {
      // Only one element is going to be produced by the
      // hash stream.
      const data = input.read();
      if (data)
        hash.update(data);
      else {
        const result = hash.digest('hex'); 
        // console.log(`${result} ${filename}`);
        resolve(result);
      }
    });

    input.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = hash;