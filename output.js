function combinedHeader(contacts) {
  return contacts.reduce(function (prev, cur) {
    Object.keys(cur).forEach(function(key) {
      if (prev.indexOf(key) === -1) prev.push(key);
    });
    return prev;
  },[]);
}


function displayWidth(str) {
  str = str.toString();
  var ret = str.length;
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) > 255)
      ret++;
  return ret;
}


function max(arr) {
  return arr.reduce(function(prev, cur) {
    return prev >= cur ? prev : cur;
  }, 0);
}


function repeat(ch, count) {
  var ret = '';
  for (var i = 0; i < count ; i++) {
    ret += ch;
  }
  return ret;
}


function tablizeLine(people, maxColWidth) {
  return '| ' +
    people.map(function(v, i) {
      return v + repeat(' ', maxColWidth[i] - displayWidth(v));
    }).join(' | ') + ' |'
}


function sepLine(maxColWidth) {
  return '+-' +
    maxColWidth.map(function(v) {
      return repeat('-', v);
    }).join('-+-') + '-+'
}


function print(contacts) {
  var header = combinedHeader(contacts);

  var tableLineArr = contacts.map(function(people) {
    return header.map(function(headerKey) {
      return people[headerKey] || '';
    });
  });

  tableLineArr.unshift(header);

  var maxColWidth = header.map(function(v, i) {
    var columnWitdh = tableLineArr.map(function(v) { return displayWidth(v[i]); });
    return max(columnWitdh);
  });

  var tableStr = tableLineArr.reduce(function(prev, cur) {
    return prev + tablizeLine(cur, maxColWidth) + '\n' + sepLine(maxColWidth) + '\n';
  }, sepLine(maxColWidth) + '\n');

  console.log(tableStr);
  console.log(maxColWidth);
}

exports.print = print;
