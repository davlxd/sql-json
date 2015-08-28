var readline = require('readline');
var sqlparser = require('./sql').parser;
var dml = require('./dml');


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function (l) {
  var ast = sqlparser.parse(l);

  console.log('AST:');
  console.log(require('util').inspect(ast, false, null, true));
  console.log('\n');

  dml(ast);
  
  rl.prompt();
});

rl.on('SIGINT', function() {
  console.log('Bye~');
  process.exit(0);
});

rl.prompt();
