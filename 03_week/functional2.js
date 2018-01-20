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

function is_arr_like(list) {
  return list && typeof list.length === 'number' && list.length > -1;
}

function constant(value) {
  return function() {
    return value;
  }
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

function find(list, predi) {
  if (is_arr_like(list)) {
    var i = -1, l = list.length;
    while (++i < l) if (predi(list[i])) return list[i];
  } else {
    var keys = Object.keys(list), i = -1, l = keys.length;
    while (++i < l) if (predi(list[keys[i]])) return list[keys[i]]
  }
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
  if (typeof list === 'function') return iter === undefined ? _(reduce, _, list) : _(reduce, _, list, iter);
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
  return reduce(arguments, (se, fn) => fn(se));
}

function pipe() {
  var args = arguments;
  return init => go(init, ...args)
}

function curry(fn) {
  return function(a, b) {
    return b ? fn(a, b) : b => fn(a, b);
  }
}

function curryr(fn) {
  return function(b, a) {
    return a ? fn(b, a) : a => fn(a, b);
  }
}

function curryr3(fn) {
  return function(b, c, a) {
    return typeof b === 'function' ? c ? a => fn(a, b, c) : a => fn(a, b) : fn(b, c, a);
  }
}

each = curryr(each);
map = curryr(map);
filter = curryr(filter);
// reduce = curryr3(reduce);

fif = function() {
  var predi = pipe.apply(this, arguments); // [1]
  return function() {
    var store = [[predi, pipe.apply(this, arguments)]]; // [2]
    
    function If() { // [3]
      var context = this, args = arguments; 
      return go.call(this, store,
        partial(find, _, function(fnset) { return fnset[0].apply(context, args); }),
        function(fnset) { return fnset ? fnset[1].apply(context, args) : void 0; });
    }
    
    return Object.assign(If, {
      else_if: function() {
        var predi = pipe.apply(this, arguments); // [4]
        return function() { return store.push([predi, pipe.apply(this, arguments)]) && If; }; // [5]
      },
      else: function() { return store.push([constant(true), pipe.apply(this, arguments)]) && If; }
    });
  };
};

var log = console.log