const exec = require('child_process').exec

exports.runCmd = async (cmd, options) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}
