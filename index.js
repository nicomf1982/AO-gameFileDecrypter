const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const stream = require('stream')
const zlib = require('zlib')
const { platform } = require('os')

// ## Keys ######
const key = new Buffer([48, 239, 114, 71, 66, 242, 4, 50])
const iv = new Buffer ([14, 166, 220, 137, 219, 237, 220, 79])
const algo = 'des-cbc' // type of encriptation
const inputEncoding = 'utf8'
const outputEncoding = 'hex'
let gameFolder
let outputFolder


if (platform() === 'win32') {
  try {
    // ### Directory ####
    gameFolder = process.argv[2] || 'C:\Program Files (x86)\AlbionOnline\game\Albion-Online_Data\StreamingAssets\GameData'
    outputFolder = process.argv[3] || path.join(__dirname, '/output')
    deCipher(gameFolder, outputFolder)
  } catch (err) {
    console.error(err)
  }

  //### Check directory ####
  function checkOutputFolder(dirname) {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname)
    }
  }

  //### deCipher function ####
  function deCipher(gameFolder, outputFolder) {
    checkOutputFolder(outputFolder)
    fs.readdirSync(gameFolder, 'utf8').forEach(file => {
      let _path = path.join(gameFolder, file)
      // File
      if (fs.statSync(_path).isFile()) {
        let r = fs.createReadStream(_path)
        let gunzip = zlib.createGunzip();
        let decipher = crypto.createDecipheriv(algo, key, iv)
        let w = fs.createWriteStream(path.join(outputFolder, file.slice(0, -4) + '.xml'))
        console.log("Working on " + file)
        r.pipe(decipher)
          .pipe(gunzip)
          .pipe(w)
      } else {
      // Directory 
        deCipher(_path, path.join(outputFolder, file))
      }
    })
  }
  console.log('\nFinished')
} else {
  console.error(`ERROR: OS ${platform()} not supported`)
}
 