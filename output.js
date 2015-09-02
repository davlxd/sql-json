
var maxTableWidth = 200;

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


function displaySubString(str, len) {
  var firstHalf = '';
  for (var i = 0; i < str.length && displayWidth(firstHalf) < len; i++)
    firstHalf += str[i];
  return [str.substring(0, i - 1), str.substring(i - 1)];
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


function tablizeLine(people, maxColWidthArr) {
  var peopleRemaining = people.map(function() { return ''; });

  var peopleInCell =  '| ' +
    people.map(function(v, i) {
      if (displayWidth(v) > maxColWidthArr[i]) {
        peopleRemaining[i] = displaySubString(v, maxColWidthArr[i])[1];
        v = displaySubString(v, maxColWidthArr[i])[0]
      }
      return v + repeat(' ', maxColWidthArr[i] - displayWidth(v));
    }).join(' | ') + ' |'

  if (peopleRemaining.reduce(function(prev, cur) {return prev + cur; }, '').trim().length > 0) {
    peopleInCell += '\n' + tablizeLine(peopleRemaining, maxColWidthArr);
  }
  return peopleInCell;
}


function sepLine(maxColWidthArr) {
  return '+-' +
    maxColWidthArr.map(function(v) {
      return repeat('-', v);
    }).join('-+-') + '-+'
}


function trimColWidthArr(maxColWidthArr, totalColWidth) {
  var extraWidth = totalColWidth - maxTableWidth;
  var averageWidth = Math.floor(maxTableWidth/maxColWidthArr.length);

  var longColArr = maxColWidthArr.map(function(v) {
    return v > averageWidth ? v  : 0;
  });
  var longColArrSum = longColArr.reduce(function(prev, cur) {return prev + cur; }, 0);

  var trimmedColWidthArr1 = maxColWidthArr.map(function(v, i) {
    return Math.ceil((longColArr[i]/longColArrSum) * extraWidth);
  });

  var trimmedColWidthArr = maxColWidthArr.map(function(v, i) {
    return v - Math.ceil((longColArr[i]/longColArrSum) * extraWidth);
  });

  return trimmedColWidthArr;
}


function print(contacts) {
  var header = combinedHeader(contacts);

  var tableLineArr = contacts.map(function(people) {
    return header.map(function(headerKey) {
      return people[headerKey] || '';
    });
  });

  tableLineArr.unshift(header);

  var maxColWidthArr = header.map(function(v, i) {
    var columnWitdh = tableLineArr.map(function(v) { return displayWidth(v[i]); });
    return max(columnWitdh);
  });

  var totalColWidth = maxColWidthArr.reduce(function(prev, cur) {
    return prev + cur + 3;
  }, 1);

  if (totalColWidth > maxTableWidth) {
    maxColWidthArr = trimColWidthArr(maxColWidthArr, totalColWidth);
  }

  var tableStr = tableLineArr.reduce(function(prev, cur) {
    return prev + tablizeLine(cur, maxColWidthArr) + '\n' + sepLine(maxColWidthArr) + '\n';
  }, sepLine(maxColWidthArr) + '\n');

  console.log(tableStr);
}

exports.print = print;
