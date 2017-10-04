'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 8000))


// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))


// index
app.get('/', function (req, res) {
  res.send('je suis RobotClop ')
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
      if (text === 'Clope🚬') {
        sendQuickReplyLoc(sender)
        continue
      }
      if (text === '🤖 Copains Robots') {
        sendRobot(sender)
        continue
      }
      if (text === 'liste') {
        sendListRobot(sender)
        continue
      }
      if (text === 'Bonjour') {
        sendQuickReplyHello(sender)
        continue
      }
      if (text === 'bonjour') {
        sendQuickReplyHello(sender)
        continue
      }
      if (text === 'Like') {
        sendLike(sender)
        continue
      }
      if (text === '❤ Aimez nous') {
        sendLike(sender)
        continue
      }
      if (text === 'Salut') {
        sendQuickReplyHello(sender)
        continue
      }
      if (text === 'Hello') {
        sendQuickReplyHello(sender)
        continue
      }
      if (text === 'hello') {
        sendQuickReplyHello(sender)
        continue
      }
      if (text === '💬 Partagez') {
        share(sender)
        continue
      }
      if (text === 'Partagez') {
        share(sender)
        continue
      }
      if (text === '🚑 Arrêter de fumer') {
        sendGenericStop(sender)
        continue
      }
      if (text === '📅 Ouvert le Dimanche') {
        sendTextMessage(sender, "Malheuresement, la base de données du gouvernement ne précise pas les horaires d'ouverture des tabacs. Nous allons prochainement ajouter une fonctionnalité pour ajouter les tabacs ouverts en attendant, vous pouvez nous envoyer des photos des tabacs pour nous remonter l'information. Merci. ")
      continue
      }

      if (text === 'Menu') {
        sendQuickReplyAction(sender)
        continue
      }
      if (text === 'menu') {
        sendQuickReplyAction(sender)
        continue
      }
      if (text === '🖥 Version Web') {
        sendGenericVersionWeb(sender)
        continue
      }

      if (text === 'Merci') {
          sendTextMessage(sender, "De rien ! Reviens me voir quand tu veux, mais ne fume pas trop quand même 😆 ")
        continue
      }
      sendQuickReplyHello(sender)
      //sendTextMessage(sender, "😆 Dsl je ne comprend pas " + text.substring(0, 200) + "😆 Tape Menu pour commencer.")
    }
    if (event.message && event.message.attachments && event.message.attachments[0].payload) {
        if (!event.message.attachments[0].payload.coordinates) continue;
        let long = event.message.attachments[0].payload.coordinates.long;
        let lat = event.message.attachments[0].payload.coordinates.lat;
        sendTextMessage(sender, "Merci j'ai bien reçu ta géolocalisation, clic sur le lien pour chargé la carte des Tabacs a proximité https://malorchrd.github.io/first-map/?lat=" + lat +"&long="+ long + "&zoom=15 .")

        //console.log('Event.lat : ', JSON.stringify(event.message.attachments[0].payload.coordinates.lat));
        //console.log('Event.long : ', JSON.stringify(event.message.attachments[0].payload.coordinates.long));
      }
    //console.log('Event: ', event);
    //console.log('Event.message : ', event.message);
    //console.log('Event.attachments : ', JSON.stringify(event.message.attachments));
    //console.log('Event.lat : ', JSON.stringify(event.message.attachments[0].payload.coordinates.lat));
    //console.log('Event.long : ', JSON.stringify(event.message.attachments[0].payload.coordinates.long));

     //if (event.message && event.message.attachments && event.message.attachments[0] && event.message.attachments[0].payload && event.message.attachments[0].payload.coordinates) {
    	//let	latitutde = JSON.stringify(event.message.attachments[0].payload.coordinates.lat);
    //	let	longitude = JSON.stringify(event.message.attachments[0].payload.coordinates.long);
      //  console.log( 'location : ',latitutde + ',' +longitude);
    		//totUrl = urlBase + String(lat) + "," + String(lon) + ".json"

  //if (event.message) {
  //lat = JSON.stringify(event.attachments[0].payload.coordinates.lat)
  //  console.log(lat)
    //sendTextMessage(sender, "position received: " +  + JSON.stringify(event.attachments[0].payload.coordinates.long))
    //continue
    //}
  }
  res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAPl1gRvsSYBAHADDXnt0q25LaFuahVcXdCESjxwQEXbJWZBTeIaiZBH6IfSzeDpv1vKrjoaY9hSZBn3IvkVyHQg7tc2KBqjrIF45MLRJ35K3JwBC89j4QIGlThrWR77jZAZBEDKZCgbaPlm8AYAwcnqPkOysDrDUZC8ZAZBFZBs845wZDZD"

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
          "subtitle": "la vesion web de RoboClope",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://malorchrd.github.io/first-map/",
            "title": "🚬chargez la carte 🚬",
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

function sendLike(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Tabacouvert.fr",
          "subtitle": "la carte des tabacs a proximité",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.facebook.com/Tabac-ouvert-960621237397515/" ,
            "title": "👍 Notre page",
            "webview_height_ratio": "tall"
          }, {
            "type": "web_url",
            "url": "https://www.facebook.com/sharer/sharer.php?app_id=113869198637480&sdk=joey&u=https%3A%2F%2Fm.me%2F960621237397515&display=popup&ref=plugin&src=share_button" ,
            "title": "Partagez sur facebook ",
            "webview_height_ratio": "compact"
          },
          {
            "type": "web_url",
            "url": "https://www.instagram.com/robotclopes/" ,
            "title": "📷 Instagram ",
            "webview_height_ratio": "tall"
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


function sendRobot(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Nos copains Robots 🤖",
          "subtitle": "Un robots pour tout faire.",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/15107426_985854458207526_8242138474337741286_n.png?oh=ed1bfdfc287e8c27ff48ba478f5ac450&oe=58D4AF28",
          "buttons": [
          {
            "type": "web_url",
            "url": "http://m.me/forhellojam",
            "title": "🎓 Jam",
          },
          {
            "type": "web_url",
            "url": "http://m.me/196907940722816",
            "title": "🗳 HelloBot",
          },{
            "type": "web_url",
            "url": "http://m.me/meetcitron",
            "title": "🍻 Citron",
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

function sendListRobot(sender) {
  let messageData = {
    "attachment": {
       "type": "template",
       "payload": {
           "template_type": "list",
           "top_element_style": "large",
           "elements": [
               {
                   "title": "Classic White T-Shirt",
                   "default_action": {
                       "type": "web_url",
                       "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                       "messenger_extensions": true,
                       "webview_height_ratio": "tall",
                       "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                   },
                   "buttons": [
                       {
                           "title": "Buy",
                           "type": "web_url",
                           "url": "https://peterssendreceiveapp.ngrok.io/shop?item=100",
                           "messenger_extensions": true,
                           "webview_height_ratio": "tall",
                           "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                       }
                   ]
               },
               {
                   "title": "Classic Blue T-Shirt",
                   "default_action": {
                       "type": "web_url",
                       "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                       "messenger_extensions": true,
                       "webview_height_ratio": "tall",
                       "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                   },
                   "buttons": [
                       {
                           "title": "Buy",
                           "type": "web_url",
                           "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                           "messenger_extensions": true,
                           "webview_height_ratio": "tall",
                           "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                       }
                   ]
               },
               {
                   "title": "Classic Black T-Shirt",
                   "default_action": {
                       "type": "web_url",
                       "url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
                       "messenger_extensions": true,
                       "webview_height_ratio": "tall",
                       "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                   },
                   "buttons": [
                       {
                           "title": "Buy",
                           "type": "web_url",
                           "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
                           "messenger_extensions": true,
                           "webview_height_ratio": "tall",
                           "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                       }
                   ]
               },
               {
                   "title": "Classic Gray T-Shirt",
                   "default_action": {
                       "type": "web_url",
                       "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                       "messenger_extensions": true,
                       "webview_height_ratio": "tall",
                       "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                   },
                   "buttons": [
                       {
                           "title": "Buy",
                           "type": "web_url",
                           "url": "https://peterssendreceiveapp.ngrok.io/shop?item=103",
                           "messenger_extensions": true,
                           "webview_height_ratio": "tall",
                           "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                       }
                   ]
               }
           ],
            "buttons": [
               {
                   "title": "View More",
                   "type": "postback",
                   "payload": "payload"
               }
           ]
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


function sendGenericVersionWeb(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Tabacouvert.fr",
          "subtitle": "la vesion web de RoboClope",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14976513_979319085527730_5493980096925820644_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://malorchrd.github.io/first-map/",
            "title": "Aller sur le site",
          },
          {
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


function sendGenericStop(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Arrêter de fumer 😉",
          "subtitle": " 📱 La nouvelle app de l'assurance maladie",
          "image_url": "http://a2.mzstatic.com/eu/r30/Purple62/v4/aa/76/f0/aa76f0b1-d1ba-f9ce-fa03-c880d6e85c77/screen696x696.jpeg",
          "buttons": [{
            "type": "web_url",
            "url": "https://appsto.re/fr/xhu2db.i",
            "title": "Apple store 📱",
          },
          {
            "type": "web_url",
            "url": "https://play.google.com/store/apps/details?id=fr.cnamts.tis&hl=fr",
            "title": "Androïd store 📱",
          },
          {
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




function share(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "RobotClope 🤖🚬",
          "subtitle": "Merci de partager ❤❤ RobotClope le ChatBot qui te trouve des clopes 🚬🚬",
          "image_url": "https://scontent-cdg2-1.xx.fbcdn.net/t31.0-8/14714985_960631460729826_5366735335003603455_o.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://m.me/960621237397515",
            "title": "RobotClope 🤖🚬",
          },
          {
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


function sendQuickReplyLoc(sender) {
  let messageData = {
    "text": "Haha, je t'ai eu !! Il me faut dans tout les cas ta géolocalisation 📍📍 pour que je te propose les tabacs à proximité",
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

function sendQuickReplyHello(sender) {
  let messageData = {
    "text":"Bonjour je suis RobotClop,\n un petit 🤖 qui t'aide a trouver des 🚬🚬. \n \n  Pour commencer il suffit de m'envoyer ta géolocalisation. 📍📍 \n \n A tout moment tu peux tapper Menu pour retrouvez toutes les actions. 👍 PS : je suis un 👶🤖, je ne comprends pas encore tout ce que vous dites, merci de votre compréhension.",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Menu",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"location",
        "title":"position",
      }
    ]
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

function sendQuickReplyAction(sender) {
  let messageData = {
    "text":"Choisis une action",
    "quick_replies":[
      {
        "content_type":"location",
        "title":"position",
      },
      {
        "content_type":"text",
        "title":"🖥 Version Web",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"text",
        "title":"❤ Aimez nous",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"text",
        "title":"📅 Ouvert le Dimanche",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"text",
        "title":"💬 Partagez",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"text",
        "title":"🤖 Copains Robots",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      },
      {
        "content_type":"text",
        "title":"🚑 Arrêter de fumer",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
      }
    ]
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
