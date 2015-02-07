// RESTful API ====================================
// !TODO: error response should also be json, aka res.json(), since it's a RESTful api


// loaded all we need
var _ = require('underscore');
var fs = require("fs");
var LineByLineReader = require('line-by-line');
var readline = require('readline');
var stream = require('stream');




// =========================== helper functions ===========================





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

module.exports = function(app){

    // parse("user_id", "yelp_academic_dataset_user.json", "user.json");
    // parse("user_id", "yelp_academic_dataset_tip.json", "tip.json");
    // parse("business_id", "yelp_academic_dataset_business.json", "business.json");
    // parse("business_id", "yelp_academic_dataset_checkin.json", "checkin.json");
    parse("user_id", "yelp_academic_dataset_review_1.json", "review1.json");
    parse("user_id", "yelp_academic_dataset_review_2.json", "review2.json");


}
