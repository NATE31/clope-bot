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
  res.send('hello world i am a secret bot')
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
      if (text === 'Clope') {
        sendQuickReply(sender)
        continue
      }
      if (text === 'Menu') {
        sendGenericMessage(sender)
        continue
      }
      sendTextMessage(sender, "😆 Dsl je ne comprend pas " + text.substring(0, 200) + "😆")
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
          "subtitle": "nous avons trouvé un tabac proche de toi ",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "🚬charger la carte 🚬",
            "webview_height_ratio": "compact"
          }, {
            "type": "postback",
            "title": "Clope",
            "payload": "Payload for first element in a generic bubble",
          },{
            "type": "element_share",
            }],
        }, ]
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
    "text": "Merci d'envoyer ta géolocalisation pour que je te propose les tabacs à proximité",
    "quick_replies": [{
        "content_type": "location",
      }]
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