app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
		sendMessage(event.sender.id, {text: "Hi. Send your location"}); // event.message.text
        }
	else if (event.message && event.message.attachments && event.message.attachments[0] && event.message.attachments[0].payload && event.message.attachments[0].payload.coordinates) {
		urlBase = "http://api.wunderground.com/api/57fd25cc02e9da86/conditions/forecast/alert/q/"
		lat = event.message.attachments[0].payload.coordinates.lat
		lon = event.message.attachments[0].payload.coordinates.long
		totUrl = urlBase + String(lat) + "," + String(lon) + ".json"

//                sendMessage(event.sender.id, {text: totUrl});

		request({
		    url: totUrl,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
			var rain = body.current_observation.precip_1hr_metric
			if (rain > 0) {
				sendMessage(event.sender.id, {text: "It's gonna rain. Grab an umbrella!"});
			}
			else {
				sendMessage(event.sender.id, {text: "No rain ahead!"});
			}
		    }
		})
	} 
	events = []
    }
	req.body.entry[0].messaging = []
    res.sendStatus(200);
});