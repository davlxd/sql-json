var select = require('./select');
var insert = require('./insert');

function dml(ast) {
  if (ast.type.toUpperCase() === 'SELECT')
    return select(ast);

  if (ast.type.toUpperCase() === 'INSERT')
    return insert(ast);
}


exports.dml = dml;
