var users = [
  { id: 1, name: 'ID', age: 36 },
  { id: 2, name: 'BJ', age: 32 },
  { id: 3, name: 'JM', age: 34 },
  { id: 4, name: 'PJ', age: 27 },
  { id: 5, name: 'HA', age: 25 },
  { id: 6, name: 'JE', age: 26 },
  { id: 7, name: 'JI', age: 31 },
  { id: 8, name: 'MP', age: 23 }
];


// 1. 30세 미만의 유저의 이름 목록
go(users,
  filter(function(user) { return user.age < 30 }),
  map(function(user) { return user.name }),
  log
);

// 2. 30세 이상의 유저의 id 목록
go(users,
  filter(function(user) { return user.age >= 30 }),
  map(function(user) { return user.id }),
  log
);


// 3. 30세 미만의 유저들의 나이의 총합
go(users,
  filter(function(user) { return user.age < 30 }),
  reduce(function(init, user) { return init + user.age }, 0),
  log
);


// 4. 이름이 'JE'인 유저의 나이
go(users,
  find(function(user) { return user.name == 'JE' }),
  val('age'),
  log
)