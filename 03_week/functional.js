var ___ = {}, slice = Array.prototype.slice;
function _(func) {
  var parts1 = [], parts2 = [],
      parts = slice.call(arguments, 1),
      ___idx = parts.length;

  for (var i in parts)
    if (parts[i] == ___) ___idx = i;
    else if (i < ___idx) parts1.push(parts[i]);
    else parts2.push(parts[i]);

  return function() {
    var args1 = parts1.slice(), 
        args2 = parts2.slice(), 
        rest = slice.call(arguments);

    for (var i in args1) if (args1[i] == _) args1[i] = rest.shift();
    for (var i in args2) if (args2[i] == _) args2[i] = rest.pop();

    return func.apply(null, [...args1, ...rest, ...args2]);
    // return func.apply(null, args1.concat(rest.concat(args2)));
  }
}

var partial = _;

var log = console.log;

function is_arr_like(list) {
  return list && typeof list.length === 'number' && list.length > -1;
}

function each(list, iter) {
  if (is_arr_like(list)) {
    var i = -1, l = list.length;
    while (++i < l) iter(list[i]);
  } else {
    var keys = Object.keys(list), i = -1, l = keys.length;
    while (++i < l) iter(list[keys[i]]);
  }
  return list;
}

function map(list, mapper) {
  var res = [];
  if (is_arr_like(list)) {
    var i = -1, l = list.length;
    while (++i < l) res.push(mapper(list[i]));
  } else {
    var keys = Object.keys(list), i = -1, l = keys.length;
    while (++i < l) res.push(mapper(list[keys[i]]));
  }
  return res;
}

function filter(list, predi) {
  var res = [];
  if (is_arr_like(list)) {
    var i = -1, l = list.length;
    while (++i < l) if (predi(list[i])) res.push(list[i]);
  } else {
    var keys = Object.keys(list), i = -1, l = keys.length;
    while (++i < l) if (predi(list[keys[i]])) res.push(list[keys[i]]);
  }
  return res;
}

function reduce(list, iter, memo) {
  if (is_arr_like(list)) {
    var i = -1, l = list.length, 
    res = memo === undefined ? list[++i] : memo;
    while (++i < l) res = iter(res, list[i]);
  } else {
    var keys = Object.keys(list), i = -1, l = keys.length, 
    res = memo === undefined ? list[keys[++i]] : memo;
    while (++i < l) res = iter(res, list[keys[i]]);
  }
  return res;
}

function go() {
  return reduce(arguments, function(se, fn) {
    return fn(se);
  });
}

function pipe() {
  var args = arguments;
  return function(init) {
    return go(init, ...args);
  }
}