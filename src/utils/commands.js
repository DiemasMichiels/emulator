const { exec } = require('node:child_process')

exports.runCmd = async (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        console.log('err', err);
        reject({ err, stdout })
      } else {
        resolve(stdout)
      }
    })
  })
}
