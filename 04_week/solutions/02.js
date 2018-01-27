// 이지명님의 솔루션

console.log(
  map(filter(users, user => user.age < 30), user => user.name)
)

console.log(
  reduce(filter(users, user => user.age > 30), (memo, user) => memo + user.age, 0)
)

console.log(
  get(find(users, user => user.name === "JE"), "age")
)

function map(list, iter) {
  var i = -1; len = list.length; new_list = [];
  while (++i < len) {
      new_list.push(iter(list[i]));
  }
  return new_list;
}

function reduce(list, iter, memo) {
  var i = -1; len = list.length;
  memo = memo === undefined ? list[++i] : memo;
  while (++i < len) {
      memo = iter(memo, list[i]);
  }
  return memo;
}

function filter(list, pred) {
  var i = -1, len = list.length, new_list = [];
  while (++i < len) {
      if (pred(list[i])) {
          new_list.push(list[i]);
      }
  }
  return new_list;
}

function find(list, pred) {
  var i = -1, len = list.length;
  while (++i < len) {
      if (pred(list[i])) {
          return list[i];
      }
  }
  return null;
}

function get(obj, key) {
  return obj[key];
}