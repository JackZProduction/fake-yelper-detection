// RESTful API ====================================
// !TODO: error response should also be json, aka res.json(), since it's a RESTful api


// loaded all we need
var _ = require('underscore');
var fs = require("fs");
var LineByLineReader = require('line-by-line');
var readline = require('readline');
var stream = require('stream');


GLOBAL.review = {};


// =========================== helper functions ===========================


function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}


var yelp = require("yelp").createClient({
  consumer_key: "OpQ432JIAP7-P_ld1gICOA",
  consumer_secret: "YXc2pXc4EGdkN9nLtiTP8Y_N8Ww",
  token: "PakRc0KPF2-W8gapVxM6Ni_ptl0SN59U",
  token_secret: "CexjJEYbXZiaG4N0_mBtO-hbzIE"
});

// See http://www.yelp.com/developers/documentation/v2/search_api
// yelp.search({term: "hooker", location: "Montreal"}, function(error, data) {
//   console.log(error);
//   console.log(data);
// });

// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business("yelp-san-francisco", function(error, data) {
//   console.log(error);
//   console.log(data);
// });



function parse(key, old_file, new_file){
    var instream = fs.createReadStream('db/' + old_file);
    var outstream = new stream;
    var lr = readline.createInterface(instream, outstream);

    lr.on('error', function (err) {
      console.log(err);
    });

    var res = {};
    lr.on('line', function (line) {
      var json = JSON.parse(line);
      res[json[key]] = json;
    });

    lr.on('close', function () {
        fs.writeFile('db/' + new_file, JSON.stringify(res, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file", new_file, "was saved!");
            }
        });
    });
}

// return a list of business that has free wifi
function wifi(reviewObj){
  var hasWifi = {};
  _.each(reviewObj, function(obj, id){
    if (obj.text.toLowerCase().indexOf("wifi") > -1){
      hasWifi[id] = true;
    }
  });
  return hasWifi;
}

// frequency of most used words in a sentence
// format is [['foo', 12], ['bar, 9']]
function frequency(reviewText){
  var sWords = reviewText.toLowerCase().trim().replace(/[,;.?!-=%$()&#1234567890]/g,'').split(/[\s\/]+/g).sort();
  var iWordsCount = sWords.length; // count w/ duplicates

  // array of words to ignore
  var ignore = ['and','the','to','a', 'an', 'of','for','as','i','with','it','is','on','that','this', 'these', 'those', 'can','in','be','has','if', 'will', 'who',
  'when', 'will', 'was', 'you', 'your', 'were', 'was', 'he', 'his', 'she', 'her', 'they', 'there', 'them', 'their', 'my', 'me', 'at', 'im', "i\'m",
  'its', 'ive', "it\'s", "i\'ve", "he\'s", "you\'re", "you\'ve", "you\'ll", "you\'d", "we", "we\'re", "we\'ve", "we\'ll", "we\'d", 'about', 'all', 'have', 'not',
  'over', 'all', 'get', 'or', "isn\'t", "they\'ll", 'are', 'no', 'out', 'now', 'because', 'let', 'are', 'why', 'but', 'only', 'so', 'such', 'being', 'many', 'every',
  'other', 'what', 'also', 'by', 'etc', 'had', 'our', 'place', 'one', 'here', 'do', 'go', 'too', 'up'];
  ignore = (function(){
    var o = {}; // object prop checking > in array checking
    var iCount = ignore.length;
    for (var i=0;i<iCount;i++){
      o[ignore[i]] = true;
    }
    return o;
  }());

  var counts = {}; // object for math
  for (var i=0; i<iWordsCount; i++) {
    var sWord = sWords[i];
    if (!ignore[sWord]) {
      counts[sWord] = counts[sWord] || 0;
      counts[sWord]++;
    }
  }

  var arr = []; // an array of objects to return
  for (sWord in counts) {
    arr.push([ sWord, counts[sWord] ]);
  }

  return arr;
}



// for each business, gather all its reviews into one string
function createReview(reviewBank){
  var reviews = {};
  _.each(reviewBank, function(obj, id){
    reviews[obj.business_id] = reviews[obj.business_id] ? reviews[obj.business_id].concat(" " + obj.text) : ' ';
  });
  console.log("finish merge all reviews for each business")
  return (reviews);
}




module.exports = function(app){

    // parse("user_id", "yelp_academic_dataset_user.json", "user.json");
    // parse("user_id", "yelp_academic_dataset_tip.json", "tip.json");
    // parse("business_id", "yelp_academic_dataset_business.json", "business.json");
    // parse("business_id", "yelp_academic_dataset_checkin.json", "checkin.json");
    // parse("user_id", "yelp_academic_dataset_review_1.json", "review1.json");
    // parse("user_id", "yelp_academic_dataset_review_2.json", "review2.json");

    fs.readFile("db/review1.json", "utf8", function(err, data){
      if (err) {
        console.log(err);
        return;
      }
      var json = JSON.parse(data);



      var count = 0;
      _.each(createReview(json), function(reviewString, business_id){
        // console.log("finished:", count + "/" + _.size(json));
        if (count > 10) return;
        var freq = frequency(reviewString);
        review[business_id] = freq;
        console.log(freq)
        count ++ ;
      });



      console.log("Done");

    });

    app.get('/biz', function(req, res){
      res.json(review[pickRandomProperty(review)]);
    });




}
