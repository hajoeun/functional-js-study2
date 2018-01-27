// 김재억님의 솔루션

function filter(list,fn){
  result = []
  each(list,function(item){
      if(fn(item)){
          result.push(item)
      }
  });
  return result
}

function map(list,fn){
  result = [];
  each(list,function(item){
      result.push(fn(item));
  })
  return result;
}

function each(list,fn){
  index = 0;
  while(index < list.length){
      fn(list[index++]);
  }
  return list
}

function sum(list,fn){
  result = 0;
  each(list,function(item){
      if(typeof fn(item) === 'number' ){
          result += fn(item);
      }
  });
  return result;
}

function search(list,fn){
  each(list,function(item){
      if(fn(item)){
          result = item;
      }
  });
  return result;
}


console.log(
  '30세 미만의 유저들의 이름 목록',
  map(
      filter(users,function(item){
      return item.age < 30;
      }),
      function(item){
          return item['name'];
      }
  )
  
);



console.log(
  '30세 이상의 유저들의 나이의 총합',
  sum(
      filter(users,function(item){
      return item.age >= 30;
      }),
      function(item){
          return item['age'];
      }
  )
  
);

console.log(
  "이름이 'JE'인 유저의 나이 (첫번째로 발견한 'JE')",
  search(users,function(item){
      return item['name'] == 'JE';
  })['age']
);