var fs = require('fs');
var archiver = require('archiver');
var hash = require('./hash');
const { update, appExsit } = require('./update');

var args = process.argv.slice(2);

var folderName = args[0];
var appName = args[1];

if (!fs.existsSync(folderName)) {
  console.error('请输入正确的文件夹路径。');
  process.exit();
}

if (!appExsit(appName)) {
  console.error('请输入正确的APP名称');
  process.exit();
}

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/app.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('打包成功😊');
  hash('./app.zip').then(function(hashResult) {
    const bundleName = `app.${hashResult}.zip`;
    fs.rename('./app.zip', `../artifactory/${bundleName}`, (error) => {
      if (error) {
        console.error(error);
        process.exit();
      }

      update(appName, hashResult, bundleName)
    })
  })
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

// append files from a sub-directory and naming it `new-subdir` within the archive
// archive.directory('subdir/', 'new-subdir');

// append files from a sub-directory, putting its contents at the root of archive
archive.directory(`${folderName}/`, false);

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();