var fs = require("fs")
var args = process.argv.slice(2)

var appName = args[0]
var appHash = args[1]
var appBundleName = args[2]

fs.readFile("./web-manifest.json", "utf8", function (err, data) {
  if (err) {
    console.log(err)
  } else {
    var manifest = JSON.parse(data)

    for (var i = 0; i < manifest.length; i++) {
      var m = manifest[i]

      if (m.name === appName) {
        m.hash = appHash
        m.bundleName = appBundleName

        var updatedManifest = JSON.stringify(manifest)
        fs.writeFile("./web-manifest.json", updatedManifest, function (err) {
          if (err) return console.log(err)
        })

        break
      }
    }

    console.log("Can not find APP")
  }
})
