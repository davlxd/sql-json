var fs = require('fs');

function print(selection, filter, sortFuncArr) {
  var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  if (filter !== null) {
    data = data.filter(filter);
  }
  if (sortFuncArr !== null) {
    sortFuncArr.forEach(function(sortFunc) {
      data = data.sort(sortFunc);
    });
  }

  console.log(data);
}


function poepleHaveNoThisField(people, predicate) {
  for (var i in predicate) {
    var scalar = predicate[i];
    if (scalar[0] === 'COLUMN' && typeof people[scalar[1]] === 'undefined')
      return true;
  }
}


function comparisonCond(cond) {
  return function(people) {
    if (poepleHaveNoThisField(people, cond.predicate))
      return false;

    var extractedScalar = cond.predicate.map(function(scalar) {
      return scalar[0] === 'COLUMN' ? people[scalar[1]] : scalar ;
    });

    if (extractedScalar[0] === '>=')
      return extractedScalar[1] >= extractedScalar[2];
    if (extractedScalar[0] === '<=')
      return extractedScalar[1] <= extractedScalar[2];
    if (extractedScalar[0] === '>')
      return extractedScalar[1] < extractedScalar[2];
    if (extractedScalar[0] === '=')
      return extractedScalar[1] === extractedScalar[2];
  };
}


function likeCond(cond) {
  return function(people) {
    if (poepleHaveNoThisField(people, cond.predicate))
      return false;

    var extractedScalar = cond.predicate.map(function(scalar) {
      return scalar[0] === 'COLUMN' ? people[scalar[1]] : scalar ;
    });
    return extractedScalar[0].match(new RegExp(extractedScalar[1]));
  };
}


function condition2Filter(cond) {
  if (cond.type === 'COMPARISON') {
    return comparisonCond(cond);
  }

  if (cond.type === 'LIKE') {
    return likeCond(cond);
  }

  if (cond.type === 'OR') {
    return function(people) {
      return condition2Filter(cond.condition)(people) || condition2Filter(cond.condition_another)(people);
    };
  }

  if (cond.type === 'AND') {
    return function(people) {
      return condition2Filter(cond.condition)(people) && condition2Filter(cond.condition_another)(people);
    };
  }

  if (cond.type === 'NOT') {
    return function(people) {
      return !condition2Filter(cond.condition)(people);
    };
  }
}


function spec2Sort(specArr) {
  return specArr.map(function(spec) {
    return function(people, peopleAnother) {
      if (spec[1].toUpperCase() === 'ASC')
        return people[spec[0]] - peopleAnother[spec[0]];
      if (spec[1].toUpperCase() === 'DESC')
        return peopleAnother[spec[0]] - people[spec[0]];
    }
  });
}


function select(ast) {
  var filter = ast.clause.where === null ? null : condition2Filter(ast.clause.where);
  var sort = ast.clause.orderBy === null ? null : spec2Sort(ast.clause.orderBy);

  print(ast.selection, filter, sort);
}

module.exports = select;
