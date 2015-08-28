var select = require('./select');

function dml(ast) {
  if (ast.type.toUpperCase() === 'SELECT')
    return select(ast);
}


exports.dml = dml;
