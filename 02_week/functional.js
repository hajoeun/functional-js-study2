function is_arr_like(list) {
  return list.length && typeof list.length === 'number';
}

function each(list, iter) {
  if (is_arr_like(list)) {
    var i = -1, len = list.length;
    while (++i < len) iter(list[i]);
  } else {
    var keys = Object.keys(list), i = -1, len = keys.length;
    while (++i < len) iter(list[keys[i]]);
  }
  return list;
}

function map(list, mapper) {
  var res = [], i = -1, len = list.length;
  while (++i < len) res.push(mapper(list[i]));
  return res;
}

function filter(list, predi) {
  var res = [], i = -1, len = list.length;
  while (++i < len) if (predi(list[i])) res.push(list[i]);
  return res;
}

function reject(list, predi) {
  var res = [], i = -1, len = list.length;
  while (++i < len) if (!predi(list[i])) res.push(list[i]);
  return res;
}

function reduce(list, reducer, memo) {
  var i = -1, len = list.length, res = memo === undefined ? list[++i] : memo;
  while (++i < len) res = reducer(res, list[i]);
  return res; 
}

function go() {
  return reduce(arguments, function(seed, fn) {
    return fn(seed);
  })
}

function pipe() {
  var args = arguments;
  return function(init) {
    return reduce(args, function(seed, fn) {
      return fn(seed);
    }, init)
  }
}

function pipe2() {
  var args = arguments;
  return function(init) {
    return go(init, ...args);
  }
}

function pipe3() {
  var args = Array.prototype.slice.call(arguments);
  return function(init) {
    return go.apply(null, [init].concat(args));
  }
}
