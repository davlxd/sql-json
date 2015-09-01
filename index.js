var readline = require('readline');
var sqlparser = require('./sql').parser;
var data = require('./data');
var dml = require('./dml');


function completerWords() {
  var ret = ['select', 'where', 'like', 'order', 'desc' ,'insert', 'values', 'update', 'null', 'true', 'false'];

  data.load().forEach(function(people) {
    Object.keys(people).forEach(function(key) {
      if (ret.indexOf(key) === -1) ret.push(key);
    });
  });

  return ret;
}


function completer(line) {
  var lastWord = line.split(' ').reverse()[0];
  var completions = completerWords();

  var hits = completions.filter(function(c) { return c.indexOf(lastWord) == 0 })
  return [hits.length ? hits : completions, lastWord]
}


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer
});


rl.on('line', function (l) {
  if (l.trim().length === 0) {
    rl.prompt();
    return ;
  }

  try {
    var ast = sqlparser.parse(l);
  } catch (error) {
    console.log(error);
    rl.prompt();
    return ;
  }

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
