var fs = require('fs');

function print(selection, filter) {
  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  if (filter !== null) {
    data = data.filter(filter);
  }
  console.log(data);
}


function condition2Filter(cond) {
  if (cond.type.toUpperCase() === 'LIKE') {
    return function(people) {
      return people[cond.predicate[0]].match(new RegExp(cond.predicate[1]));
    };
  }

  if (cond.type.toUpperCase() === 'OR') {
    return function(people) {
      return condition2Filter(cond.condition)(people) || condition2Filter(cond.condition_another)(people);
    };
  }

  if (cond.type.toUpperCase() === 'AND') {
    return function(people) {
      return condition2Filter(cond.condition)(people) && condition2Filter(cond.condition_another)(people);
    };
  }

  if (cond.type.toUpperCase() === 'NOT') {
    return function(people) {
      return !condition2Filter(cond.condition)(people);
    };
  }
}


function select(ast) {
  var _where = ast.clause.where;
  if (_where === null) {
    print(ast.select, null);
    return ;
  }

  var filterFunc = condition2Filter(_where);
  print(ast.selection, filterFunc);
}

function dml(ast) {
  if (ast.type.toUpperCase() === 'SELECT')
    return select(ast);
}


exports.dml = dml;
