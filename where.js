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
      return extractedScalar[1] > extractedScalar[2];
    if (extractedScalar[0] === '<')
      return extractedScalar[1] < extractedScalar[2];
    if (extractedScalar[0] === '==')
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
    if (extractedScalar[0] === null) return false;
    return extractedScalar[0].match(new RegExp(extractedScalar[1], 'i'));
  };
}


function testNullCond(cond) {
  return function(people) {
    if (cond.predicate[0] === 'NOT') {
      var field = people[cond.predicate[1]];
      return typeof field === 'undefined' || field === null ? false : true;

    } else {
      var field = people[cond.predicate[0]];
      return typeof field === 'undefined' || field === null ? true : false;
    }
  };
}


function condition2Filter(cond) {
  if (cond.type === 'COMPARISON') {
    return comparisonCond(cond);
  }

  if (cond.type === 'LIKE') {
    return likeCond(cond);
  }

  if (cond.type === 'TEST_NULL') {
    return testNullCond(cond);
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


exports.condition2Filter = condition2Filter;
