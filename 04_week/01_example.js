// 1. 30세 미만의 유저의 이름 목록
go(users,
  filter(pipe(val('age'), lt(30))),
  map(val('name')),
  log
)

// 2. 30세 미만의 유저들의 나이의 총합
go(users,
  filter(pipe(val('age'), gt(30))),
  reduce((memo, user) => memo + user.age, 0),
  log
)

// 3. 이름이 'JE'인 유저의 나이
go(users,
  find(pipe(val('name'), eq('JE'))),
  val('age'),
  log
)

go(users,
  all(
    pipe(filter(pipe(val('age'), lt(30))), map(val('name')),),
    pipe(filter(pipe(val('age'), gt(30))), reduce((memo, user) => memo + user.age, 0)),
    pipe(find(pipe(val('name'), eq('JE'))), val('age'))),
  log
)