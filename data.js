var select = require('./select');
var insert = require('./insert');
var update = require('./update');

function dml(ast) {
  if (ast.type.toUpperCase() === 'SELECT')
    return select(ast);

  if (ast.type.toUpperCase() === 'INSERT')
    return insert(ast);

  if (ast.type.toUpperCase() === 'UPDATE')
    return update(ast);
}


exports.dml = dml;
