var RandomChars = function() {
	this.randomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.uid = function(len) {
		var buf = []
    	, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    	, charlen = chars.length;

		for (var i = 0; i < len; ++i) {
			buf.push(chars[this.randomInt(0, charlen - 1)]);
		}

		return buf.join('');
	}

	return {
		uid: uid,
		randomInt: randomInt
	}
}();

module.exports = RandomChars;
