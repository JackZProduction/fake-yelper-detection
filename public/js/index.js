$( document ).ready(function () {

$('#project_start').click(function(){
  $("#first_screen").fadeOut(1000);
});





// get viewport size
  getViewportSize = function() {
      return {
          height: window.innerHeight,
          width:  window.innerWidth
      };
  };

  // update canvas size
  var updateSizes = function() {
      var viewportSize = getViewportSize();
      $('canvas').width(viewportSize.width).height(viewportSize.height - 150);
      $('canvas').attr('width', viewportSize.width).attr('height', viewportSize.height - 150);
  };

  // run on load
  updateSizes();


$('#word').click(function(){
  $.get('/biz', function(data){
    var info = data.info;
    var list = data.word;

    var wifi = false;
    var parking = false;
    _.each(list, function(arr){
      if (arr[0]=='wifi' || arr[0]=='wi-fi' || arr[0]=='internet') wifi = true;
      if (arr[0]=='parking' || arr[0]=='park') parking = true;
    });

    var seperator = "&nbsp;&nbsp; - &nbsp;&nbsp";
    $('#business_name').html(
      '<b>Name:</b> ' + info.name + seperator +
      '<b>Stars:</b> ' + info.stars + seperator +
      '<b>City:</b> ' + info.city + seperator +
      '<b2>Free wifi:</b2> ' + wifi+ seperator +
      '<b3>Parking:</b3> ' + parking
    );

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
