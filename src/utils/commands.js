const exec = require('node:child_process').exec

exports.runCmd = async (cmd, options) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout) => {
      if (err) {
        // Retry without options as fallback
        exec(cmd, (err2, stdout2) => {
          if (err2) {
            reject({ err: err2, stdout: stdout2 })
          } else {
            resolve(stdout2)
          }
        })
      } else {
        resolve(stdout)
      }
    })
  })
}
