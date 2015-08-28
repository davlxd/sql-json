var fs = require('fs');

function write(obj) {
  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data.push(obj);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
}


function insert(ast) {
  var obj = {};
  for (var i in ast.keyList) {
    obj[ast.keyList[i]] = i >= ast.valueList.length ? null : ast.valueList[i];
  }
  write(obj);

}

module.exports = insert;
