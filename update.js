var fs = require('fs');
var where = require('./where');


function update(ast) {
  var filter = ast.condition === null ? null : where.condition2Filter(ast.condition);

  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  data.forEach(function(people) {
    if (filter != null && !filter(people))
      return ;
    ast.assignment.forEach(function(keyValue) {
      people[keyValue[0]] = keyValue[1];
    });
  });

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
}

module.exports = update;
