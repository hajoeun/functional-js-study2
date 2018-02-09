!function(lo) {
  const bind_current_list = data => lo.current_list = data;
  const item_filter = (k1, k2, k3) => 
    (arr1, arr2, arr3) =>
      _.filter(_.pipe(
        item => [[arr1, item[k1]], [arr2, item[k2]], [arr3, item[k3]]],
        _.map(_.if2(_.first, _.val('length'))(_.to_mr, _.contains).else(_.c(true))),
        _.every)) 

  const item_filter2 = (...keys) => 
    (...arrs) => {
      console.log("filter!!");
      return _.filter(_.pipe(
        item => _.map(keys, (key, i) => [arrs[i], item[key]]),
        _.map(_.if2(_.first, _.val('length'))(_.to_mr, _.contains).else(_.c(true))),
        _.every))
      }

  const movie_filter = _.memoize(item_filter2('rating', 'genre', 'director'));
  
  window.movie_filter = movie_filter;
  
  function async_movie_filter(query) {
    return new Promise(function(res) {
      setTimeout(function () {
        res(item_filter2(..._.keys(query))(..._.values(query))(movies));
        // _.go(query, _.all(_.keys, _.values), (keys, values) => item_filter2(...keys)(...values)(movies), res);
      }, 1000)
    })
  }

  _.each($('.movie_box'), __(
    _.c(movies),
    _.t$(`
      .header
        .title 
          h3 한국 영화 무비 박스
        .filter
          .rating
            label 등급 
            .inputs {{_.go($, _.map(m => m.rating), _.uniq, _.sum(`, _.t$(`
              input[type=checkbox name=rating value='{{$}}'] {{$}}
            `) ,`))}}
          .genre
            label 장르 
            .inputs {{_.go($, _.map(m => m.genre), _.uniq, _.sum(`, _.t$(`
              input[type=checkbox name=genre value='{{$}}'] {{$}}
            `) ,`))}}
          .director
            label 감독 
            .inputs {{_.go($, _.map(m => m.director), _.uniq, _.sum(`, _.t$(`
              input[type=checkbox name=director value='{{$}}'] {{$}}
            `) ,`))}}
        .sort
          label 정렬
          select
            option[value=name] 이름
            option[value=attendance] 관객수
            option[value=comment] 댓글
            option[value=like] 좋아요
      .body
        ul.movie_list {{_.go($, `, lo.items = _.sum(_.t$(`
          li.movie_item {{$.name}} | {{$.date}} | {{$.director}} | {{$.genre}} | {{$.rating}} [ {{$.attendance}} | {{$.like}} | {{$.comment}} ]
        `)) ,`)}}
        .extension
          .btns
            button.btn1 홍상수 감독의 영화가 아닌 15세 이상 관람가인 영화 TOP 3 
            button.btn2 2000년대 개봉한 영화 중 가장 관객수가 적은 영화
          .results
            .res1
            .res2
    `),
    $.prepend_to('.movie_box'),

    _.c('.movie_box'), $,
    $.on('change', '.filter input[type=checkbox]', pipe(
      () => {
        let query = reduce(['rating', 'genre', 'director'], (obj, key) => {
          obj[key] = go(`.${key}`, $.find('input:checked'), $.val)
          return obj;
        }, {}), 
        after_works = pipe(
          bind_current_list,
          lo.items,
          $.html_to('.movie_list')
        ),
        values = _.map(['.rating', '.genre', '.director'], _.pipe($, $.find('input:checked'), $.val));
        
        go(movies,
          movie_filter(...values),
          after_works)

        // async_movie_filter(query).then(after_works)
        // go(query, async_movie_filter, after_works)
        // go2(query, async_movie_filter, after_works)
      },
    )),

    $.on('change', '.sort select', _.pipe(
      e => {
        return _.sort_by(lo.current_list || movies, e.$currentTarget.value)
      },
      lo.items,
      $.html_to('.movie_list'))),

    $.on('click', '.extension .btn1', () => {
      var count = 0;

      _.go(lo.current_list || movies,
        _.sort_by('attendance'),
        arr => arr.reverse(),
        _.reject(arr => {
          count++
          return arr.director === '홍상수'
        }),
        _.filter(arr => {
          count++
          return arr.rating === '15세 이상 관람가'
        }),
        _.first(3),
        lo.items,
        $.html_to('.movie_list'))

        console.log(count); // 285
    }),

    $.on('click', '.extension .btn2', () => {

    })


  ))

}({});