var products = [
  {
    is_selected: true, // <--- 장바구니에서 체크 박스 선택
    name: "반팔티",
    price: 10000, // <--- 기본 가격
    sizes: [ // <---- 장바구니에 담은 동일 상품의 사이즈 별 수량과 가격
      { name: "L", quantity: 2, price: 0 },
      { name: "XL", quantity: 3, price: 0 },
      { name: "2XL", quantity: 2, price: 2000 }, // <-- 옵션의 추가 가격
    ]
  },
  {
    is_selected: true,
    name: "후드티",
    price: 21000,
    sizes: [
      { name: "L", quantity: 3, price: -1000 },
      { name: "2XL", quantity: 1, price: 2000 },
    ]
  },
  {
    is_selected: false,
    name: "맨투맨",
    price: 16000,
    sizes: [
      { name: "L", quantity: 4, price: 0 }
    ]
  }
];


// 1. 모든 수량
var i = -1, len = products.length, total_quantity = 0;
while (++i < len) {
  var j = -1, l = products[i].sizes.length;
  while (++j < l) { 
    total_quantity += products[i].sizes[j].quantity;
  }
}
console.log("1. 모든 수량:", total_quantity);

log(
  "1. 모든 수량 (함수):",
  reduce(products, function(memo, product) {
    return reduce(product.sizes, function(init, size) {
      return init + size.quantity;
    }, memo)
  }, 0)
)

// 2. 선택 된 총 수량
var i = -1, len = products.length, selected_len = 0;
while (++i < len) {
  var j = -1, l = products[i].sizes.length;
  if (products[i].is_selected) {
    while (++j < l) {  
      selected_len += products[i].sizes[j].quantity;
    }
  }
}
console.log("2. 선택된 총 수량:", selected_len);

log(
  "2. 선택된 총 수량 (함수):",
  go(filter(products, product => product.is_selected),
    products => reduce(products, function(memo, product) {
      return reduce(product.sizes, function(init, size) {
        return init + size.quantity;
      }, memo)
    }, 0)
  )
)

// 3. 모든 가격
var price_sum = (memo, product) => {
  return reduce(product.sizes, (init, size) => {
    return init + (product.price + size.price) * size.quantity; 
  }, memo)
};
console.log("3. 모든 가격:", reduce(products, price_sum, 0));


// 4. 선택 된 총 가격
console.log("4. 선택된 모든 가격:", reduce(filter(products, product => product.is_selected), price_sum, 0));

function curryr_reduce(fn) {
  return function (a, b, c) {
    return c === undefined ? function (c) { return fn(c, a, b)} : fn(a, b, c);
  }
}

// reduce = curryr3(reduce);

log("====== reduce 커링 테스트 =======");
go(products,
  reduce(price_sum, 0),
  log)



log("====== 5. 이벤트 문제 =======");
// 5. n개 이상 구매하면 할인해주는 이벤트 (fif, curry, curryr, partial, val, constant)
// 선택된 상품이 n개 이상이면 '총 *개를 선택하셨습니다. 할인가로 모시겠습니다.'라는 안내 메시지, 
// 미만이면 '아쉽네요. *개만 더 담으시면 할인이 됩니다. 더 구매하시겠어요?' 메시지

// 방법 1
var n = 4, 
  selected_len = go(
    products, 
    filter(product => product.is_selected),
    function(products) { return products.length });

if (selected_len > n) {
  log('총 ' + selected_len + '개를 선택하셨습니다. 할인가로 모시겠습니다.');
} else {
  log('아쉽네요. ' + (n - selected_len) + '개만 더 담으시면 할인이 됩니다. 더 구매하시겠어요?');
}


// 방법 2
var value = curryr(function(obj, key) { return obj[key] })
var gte = curryr(function(a, b) { return a >= b })
var sub = curry(function(a, b) { return a - b })

go(products,
  filter(product => product.is_selected),
  value('length'),
  fif(gte(n))(
    _(log, '총', _, '개를 선택하셨습니다. 할인가로 모시겠습니다.')
  ).else(
    sub(n),
    _(log, '아쉽네요.', _, '개만 더 담으시면 할인이 됩니다. 더 구매하시겠어요?')
  ))
