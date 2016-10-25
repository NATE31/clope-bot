'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 80))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello je suis un bot qui trouve le tabac le plus proche de toi ;-)')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === '123456789') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
      if (text === 'clope') {
        sendQuickReply(sender)
        continue
      }
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAPl1gRvsSYBABEmk5BKObmZC2AXdCbexRKZBFj58towIH1GT89kZAjYATnVlRkjaqrfQuZBQiXl8kWGrNoZCWsOHbkta1jIfnA9BnbSlC3bRykD2GtOjLTorjZBQ7hg5kuY9IpWLRcvDPG5ZAetfbZCgimvTbghtkuIWic2W7BbAwZDZD"





function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Tabacouvert.fr",
					"subtitle": "clique sur le lien pour chargé la page",
					"image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
					"buttons": [{
						"type": "web_url",
						"url": "'http://localhost/tabacMap/&lat=' + lat + '&lon=' + lon + '&zoom=10'  ",
						"title": "La carte"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Données",
					"subtitle": "données publiques",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendQuickReply(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "YO",
          "subtitle": "clique sur le lien pour chargé la page",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "'http://localhost/tabacMap/&lat=' + lat + '&lon=' + lon + '&zoom=10'  ",
            "title": "La carte"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        }, {
          "title": "YO2",
          "subtitle": "données publiques",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}


// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})