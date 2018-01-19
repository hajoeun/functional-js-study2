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

// 2. 선택 된 총 수량
var i = -1, len = products.length, selected_quantity = 0;
while (++i < len) {
  var j = -1, l = products[i].sizes.length;
  if (products[i].is_selected) {
    while (++j < l) {  
      selected_quantity += products[i].sizes[j].quantity;
    }
  }
}
console.log("2. 선택된 총 수량:", selected_quantity);


// 3. 모든 가격
var price_sum = (memo, product) => {
  return reduce(product.sizes, (init, size) => {
    return init + (product.price + size.price) * size.quantity; 
  }, memo)
};
console.log("3. 모든 가격:", reduce(products, price_sum, 0));

// 4. 선택 된 총 가격
console.log("4. 선택된 모든 가격:", reduce(filter(products, product => product.is_selected), price_sum, 0));




// 5. 세개 이상 담으면 할인해주는 이벤트 (fif, curry, curryr, partial, val, constant)
// 선택된 상품이 n개 이상이면 '총 *개를 선택하셨습니다. 할인가로 모시겠습니다.'라는 안내 메시지, 
// 미만이면 '아쉽네요. *개만 더 담으시면 할인이 됩니다. 더 구매하시겠어요?' 메시지
