// Example radius server doing authentication

var radius = require('radius');
var dgram = require("dgram");

var secret = 'radius_secret';
var server = dgram.createSocket("udp4");

var mainPassword;

server.on("message", function (msg, rinfo) {
	var code, username, password, packet;
	try {
		packet = radius.decode({packet: msg, secret: secret});
	} catch (e) {
		console.log("Failed to decode radius packet, silently dropping:", e);
		return;
	}

	if (packet.code != 'Access-Request') {
		console.log('unknown packet type: ', packet.code);
		return;
	}

	username = packet.attributes['User-Name'];
	password = packet.attributes['User-Password'];

	console.log('Access-Request for ' + username);
	console.log("password", password);

	if (username == 'guest' && password.toLowerCase() == mainPassword.toLowerCase()) {
		code = 'Access-Accept';
	} else {
		code = 'Access-Reject';
	}

	var response = radius.encode_response({
		packet: packet,
		code: code,
		secret: secret
	});

	console.log('Sending ' + code + ' for user ' + username);
	server.send(response, 0, response.length, rinfo.port, rinfo.address, function(err, bytes) {
		if (err) {
			console.log('Error sending response to ', rinfo);
		}
	});
});

server.on("listening", function () {
	var address = server.address();
	console.log("Radius server listening " + address.address + ":" + address.port);
});

exports.start = function (password) {
	mainPassword = password;
	server.bind(1812);
}


