(function(w) {
  w.identity = w.idtt = function(v) { return v };
  w.noop = function() {};
  w.keys = function(obj) { return obj ? Object.keys(obj) : [] };
  w.mr = function() { return arguments.__mr = true, arguments };
  w.to_mr = function(arr) { return arr.__mr = true, arr };

  w.pipe = function() {
    var fs = arguments, len = fs.length;
    return function(res) {
      var i = -1;
      while (++i < len) res = res && res.__mr ? fs[i].apply(null, res) : fs[i](res);
      return res;
    }
  };

  w.go = function() {
    var i = 0, fs = arguments, len = fs.length, res = arguments[0];
    while (++i < len) res = res && res.__mr ? fs[i].apply(null, res) : fs[i](res);
    return res;
  };

  w.all = function(...fs) {
    return function(arg) { return go(fs, map(fn => fn(arg)), to_mr) }
  }

  w.spread = function(...fs) {
    return function(...args) { 
      var i = 0, res = map(fs, fn => fn(args[i++]))
      return to_mr(res);
    }
  }

  w.tap = function() {
    var pipe = w.pipe.apply(null, arguments);
    return function() {
      var a = arguments;
      return pipe(a = a.length > 1 ? (a.__mr = true && a) : a[0]), a;
    }
  };

  w.log = tap(console.log);

  w.each = function f(data, iter) {
    if (!iter) return function(data2) { return f(data2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data);
    if (keys && (len = keys.length))
      while (++i < len) iter(data[keys[i]]);
    else
      while (++i < len) iter(data[i]);
    return data;
  };

  w.map = function f(data, iter) {
    if (!iter) return function(data2) { return f(data2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data), res = [];
    if (keys && (len = keys.length))
      while (++i < len) res[i] = iter(data[keys[i]]);
    else
      while (++i < len) res[i] = iter(data[i]);
    return res;
  };

  w.flatmap = w.mapcat = function f(data, iter) {
    if (!iter) return function(data2) { return f(data2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data), res = [], evd;

    if (keys && (len = keys.length))
      while (++i < len) Array.isArray(evd = iter(data[keys[i]])) ? res.push.apply(res, evd) : res.push(evd);
    else
      while (++i < len) Array.isArray(evd = iter(data[i])) ? res.push.apply(res, evd) : res.push(evd);
    return res;
  };

  w.filter = function f(data, iter) {
    if (!iter) return function(data2) { return f(data2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data), res = [];
    if (keys && (len = keys.length))
      while (++i < len) { if (iter(data[keys[i]])) res.push(data[keys[i]]); }
    else
      while (++i < len) { if (iter(data[i])) res.push(data[i]); }
    return res;
  };

  w.reject = function f(data, iter) {
    if (!iter) return function(data2) { return f(data2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data), res = [];
    if (keys && (len = keys.length))
      while (++i < len) { if (!iter(data[keys[i]])) res.push(data[keys[i]]); }
    else
      while (++i < len) { if (!iter(data[i])) res.push(data[i]); }
    return res;
  };

  w.reduce = function f(data, iter, init) {
    if (typeof data == "function") return function(data2) { return f(data2, data, iter) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data),
      res = init === undefined ? data[keys ? keys[++i] : ++i] : clone(init);
    if (keys && (len = keys.length))
      while (++i < len) res = iter(res, data[keys[i]]);
    else
      while (++i < len) res = iter(res, data[i]);
    return res;
  };

  w.find = function f(data, iter) {
    if (!iter) return function(arr2) { return f(arr2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data);
    if (keys && (len = keys.length))
      while (++i < len) { if (iter(data[keys[i]])) return data[keys[i]]; }
    else
      while (++i < len) { if (iter(data[i])) return data[i]; }
  };

  w.findval = function f(data, iter) {
    if (!iter) return function(arr2) { return f(arr2, data) };
    var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : keys(data), evd;
    if (keys && (len = keys.length))
      while (++i < len) { if (evd = iter(data[keys[i]]) !== 'undefined') return evd; }
    else
      while (++i < len) { if (evd = iter(data[i])) return evd; }
  };

  w.sum = function f(data, iter) {
    if (!iter) {
      if (typeof data == 'function') return function(arr2) { return f(arr2, data) };
      iter = w.idtt;
    }
    var i = 0, len = data && data.length, keys = typeof len == 'number' ? null : keys(data);
    if (keys) len = keys.length;
    if (len == 0) return;
    if (keys) {
      var res = iter(data[keys[0]]);
      while (++i < len) res += iter(data[keys[i]]);
    } else {
      var res = iter(data[0]);
      while (++i < len) res += iter(data[i]);
    }
    return res;
  };

  w.has = function(obj, key) {
    return obj != null && Object.hasOwnProperty.call(obj, key);
  };

  w.val = function f(obj, key) {
    if (!key) return function(obj2) { return f(obj2, obj) }
    return obj[key];
  }

  w.ternary = function(...condition) {
    return function(...true_predi) {
      return function(...false_predi) {
        return _.if2(...condition)(...true_predi).else(...false_predi);
      }
    }
  }
  
  function bexdf(setter, args) {
    for (var i = 1, len = args.length, obj1 = args[0]; i < len; i++)
      if (obj1 && args[i]) setter(obj1, args[i]);
    if (obj1) delete obj1._memoize;
    return obj1;
  }
  function setter(r, s) { for (var key in s) r[key] = s[key]; }
  function dsetter(r, s) { for (var key in s) if (!has(r, key)) r[key] = s[key]; }

  w.extend = function() { return bexdf(setter, arguments); };
  w.defaults = function() { return bexdf(dsetter, arguments); };

  w.clone = function(obj) {
    return !obj || typeof obj != 'object' ? obj : Array.isArray(obj) ? obj.slice() : extend({}, obj);
  };

  w.curryr = function(f) {
    return function(b, a) {
      return arguments.length == 2 ? f(b, a) : function(a) { return f(a, b) };
    };
  };
  w.eq = w.curryr(function(a, b) { return a == b; });
  w.lt = w.curryr(function(a, b) { return a < b; });
  w.lte = w.curryr(function(a, b) { return a <= b; });
  w.gt = w.curryr(function(a, b) { return a > b; });
  w.gte = w.curryr(function(a, b) { return a >= b; });
  w.add = w.curryr(function(a, b) { return a + b; });
  w.sub = w.curryr(function(a, b) { return a - b; });
})(typeof global == 'object' ? global : window);