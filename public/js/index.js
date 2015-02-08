$( document ).ready(function () {



$('#get_biz').click(function(){
  $.get('/biz', function(list){
    if (_.isEmpty(list)) return;

    console.log('rendering..');

    list.sort(function(a, b){
      if (a[1] > b[1]) {
        return -1;
      }
      else if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });

    console.log(list)

    WordCloud( document.getElementById('frequency'), {
      list: list,
      minSize: 10,
      weightFactor: 2,
      gridSize: 4,
      shape: "circle",
      backgroundColor: "rgb(245,245,241)",
      hover: (function(item, d){
        if (!item) {
          // $('#freq_text').hide();
          return;
        };
        var left = d.x + 5 + $('#frequency').offset().left;
        var top = d.y + 5 + $('#frequency').offset().top;
        $('#freq_text').width(d.w).height(d.h).offset({ left: left, top: top }).show();
        $('#freq_bubble').show().text(item[0] + " (" + item[1]+')').offset({ left: left + d.w/2 - $('#freq_bubble').width()/2, top: top + 10 })
        console.log(item, d)
      })
    });

  });
});

});
