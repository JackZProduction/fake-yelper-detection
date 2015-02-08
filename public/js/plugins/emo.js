function _RegExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function _replaceEmoticons(text) {
    var emots = {
        '0:)'         : '/images/emoticons/angel.png',
        ':)'         : '/images/emoticons/smile.png',
        '>:-('         : '/images/emoticons/angry.png',
        ':('         : '/images/emoticons/sad.png',
		':\'('		 : '/images/emoticons/cry.png',
		'8)'		 : '/images/emoticons/sun.png',
		':|'		 : '/images/emoticons/neutral.png',
		':^*'		 : '/images/emoticons/sendKiss.png',
        ':*'         : '/images/emoticons/kiss.png',
		':o'		 : '/images/emoticons/surprise.png',
		'xd'		 : '/images/emoticons/xlaugh.png',
		':d' 		 : '/images/emoticons/glad.png',
        '<333'       : '/images/emoticons/tripleHeart.png',
        '<33'         : '/images/emoticons/doubleHeart.png',
        '<3'         : '/images/emoticons/heart.png',
        '</3'       : '/images/emoticons/heartBroke.png',
        ':p'         : '/images/emoticons/tongue.png'
    }
    _.each(emots, function(value, key){
        emots[_.escape(key)] = value;
    });

    var result = text;
    var emotcode;
    var regex;

    for (emotcode in emots){

        regex = new RegExp(_RegExpEscape(emotcode), 'gi');
        result = result.replace(regex, function(match) {
            var pic = emots[match.toLowerCase()];

            if (pic != undefined) {
                return '<img src="' + pic + '"/ height="18" width="18" style="vertical-align:middle">';
            } else {
                return match;
            }
        });
    }
    return result;
}