var fs = require('fs');
var where = require('./where');
var data = require('./data');


function update(ast) {
  var filter = ast.condition === null ? null : where.condition2Filter(ast.condition);

  var dataObj = data.load();

  dataObj.forEach(function(people) {
    if (filter != null && !filter(people))
      return ;
    ast.assignment.forEach(function(keyValue) {
      people[keyValue[0]] = keyValue[1];
    });
  });

  fs.writeFileSync('data.json', JSON.stringify(dataObj, null, 2), 'utf8');
}

module.exports = update;
