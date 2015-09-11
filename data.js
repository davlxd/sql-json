var fs = require('fs');

exports.load = function() {
  try {
    return JSON.parse(fs.readFileSync('data.json', 'utf8'));
  } catch (e) {
    console.log(e);
    if (e.code === 'ENOENT' || e instanceof SyntaxError) {
      data = {};
    } else {
      throw e;
    }
  }
  
}
