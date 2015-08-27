var fs = require('fs');

function print(selection, filter) {
  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  if (filter !== null) {
    data = data.filter(filter);
  }
  console.log(data);
}


function like(predicate) {
  return function(people) {
    return people[predicate[0]].match(new RegExp(predicate[1]));
  };
}

function select(ast) {
  if (ast.clause.where === null) {
    print(ast.select, null);
    return ;
  }

  print(ast.selection, like(ast.clause.where.predicate));
}

function dml(ast) {
  if (ast.type.toUpperCase() === 'SELECT')
    return select(ast);
}


exports.dml = dml;
