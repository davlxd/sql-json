var fs = require('fs');
var data = require('./data');

function write(obj) {
  var dataObj = data.load();
  dataObj.push(obj);
  fs.writeFileSync('data.json', JSON.stringify(dataObj, null, 2), 'utf8');
}


function insert(ast) {
  var obj = {};
  for (var i in ast.keyList) {
    obj[ast.keyList[i]] = i >= ast.valueList.length ? null : ast.valueList[i];
  }
  write(obj);

}

module.exports = insert;
