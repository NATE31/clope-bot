'use strict'
// ----------------------- NOS MODULES -------------------------
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const express = require( 'express' );
const fetch = require( 'node-fetch' );
const request = require( 'request' );
const requestify = require( 'requestify' );
const firebase = require('firebase');
const admin = require("firebase-admin");

let Wit = null;
let log = null;
try {
  Wit = require( '../' ).Wit;
  log = require( '../' ).log;
} catch ( e ) {
  Wit = require( 'node-wit' ).Wit;
  log = require( 'node-wit' ).log;
}

// ----------------------- FIREBASE INIT -------------------------
firebase.initializeApp(
  {
    apiKey: "AIzaSyCBWm78EsKP4f4hiDko7MYgMjvaqs25zak",
     authDomain: "nateoccitanie.firebaseapp.com",
     databaseURL: "https://nateoccitanie.firebaseio.com",
     projectId: "nateoccitanie",
     storageBucket: "nateoccitanie.appspot.com",
     messagingSenderId: "253894949858"
  }
);

admin.initializeApp( {
  credential: admin.credential.cert( {
    "type": "service_account",
    "project_id": "nateoccitanie",
    "private_key_id": "7a9e3703c14c42f375f5d79f46550fc295be9c1c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkp2Tlqt+oYxrJ\nTpReDYePldiWRy+bBol115/OnSh04NeFVcaVHrpdQ8Ph2FruB3tqN2Q+BA+ODx/B\nPv3z4z+FGZB19jJmjzeZH68Ykp8AXwZiEfMf6IpX39Xh4OGxSc1LFswKL5KXSrat\ns6p4/pFKG9JLKipCU/mN7mx6ajvZoQ4KOhEfM9JRpnUkuo5ROy4Xc73+h66WmuFY\nodImB1M1w1Fqu8EcAKwmmfu1RihNJ5HG2zTwplHDkmcU6M3loMuyZXSMCrcvmbWR\nomIvscUUpwlYaKUoQ62n8CEIjo6oV8VIJtCrIqpLxdB3UDNl8lJmTnBVgl/vzKy0\nYZCQcKkxAgMBAAECggEAROEh/FH3LmIHGp+cwZu3UgHFkVhGOfwKFRoW6EAmZH6K\nqmSvpkIshEeM8jWoFFtc7ZoufSMFvs/k4NqRMi2mrO9811weyXiwMYZnoUf07BrU\neMI5iuekuA4TU2LYB2pwTzFCOiCcml3O/etjLSqRbQcmefsxon2usAlFqBA46Vki\nbqpX7jNnSCmq4Xc7t/rt0uIuoIj7gMZCiscKdMJ1Eo7jD1SRfiA6B4KLq5wqIX5c\nDkE2gms9pgHoKMzHb8/Jb/oqIh5wEOpVgTo8RY+Q0WLkaPyOqc1aJvj1N40YcDAH\n8D0bMWkAUkuoBgMzs0gubIxnGBcKQFLRmJM6Sl3C4QKBgQDcBYTWXJyg6Kc47p78\ndjb7qdQ30J/dEimGoyvMbbCv0qI9mr0TL+rsWbK+g20W01Isk4U42MajQOC5II7e\nmB9VxN1ZgUiVVMOEetD0xPA1wiyHxhUbDDuJb/ofwvCmmkC9IKUpEZWgAApQYmU5\nQd9hfZfqCzD+QHr2AjMfPbdsqwKBgQC/lBbNUXZZHiNJjbZNNnaChyu5P9ZgGt+7\nNnRnnhKRj8NsuSPMTOGbRizBgdqod+MDhfsHfRO/YZsP79K5U2oRTtVToBSBxt5/\nkQf7gAKQlU0byvDJxR397m0dIXCjR+dyOiJ0JQ2VlQ0zkojg+xoFjpjotELeJHpC\nIYPyzWHJkwKBgQCElGLGVQogv/C8ErYExSs+nMh/VZxvN1mEguCKj/JvEEqpOowC\netZh028s878RiQc0SzR029NeXmLLyz2sDhibs0P6gjf9nBUwyF0PkXh5vGbe7dKb\n+NQLbklXSD2A9uRZ0skTJUB3KG8OnywFw5bahTa8VkAQhURS52JsyeC0fwKBgAey\nYmwjTrbr4A0PdXiKrJ434gjSSMGZss1ptamID0Tr2rUehxKpMBM18YxgtDE6h9NX\naat2WfnBaSJtxzCM6mEBos52SvyfycakRAbVsMSwSuXH9H6Wvcq67oVSF51nwSO0\ntDeoWXBeCaa9x2QKkpQQk5Id0+Xq30KS6CM0Hy6jAoGAfzfULVLzU78bladfK8hf\n7KLkL96uBJ4q6NlQr6hqcNYkxthAuCwfw1nEHLy14XVMR56U1kkjovoRjxcCz8DZ\nYfJ4sTgwIx3kwjqsmsJArF4tgE6qbcy/NceNc5xJi8Z2fXJL1LZ/0DAPwKySoPev\nAid4e3rJ9aEqFS0UXmaqKRg=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qmj6e@nateoccitanie.iam.gserviceaccount.com",
    "client_id": "114926604003074143787",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qmj6e%40nateoccitanie.iam.gserviceaccount.com"
  }),
  databaseURL: "https://nateoccitanie.firebaseio.com"
});


// ----------------------- API KEY openweathermap -------------------------
var api_key_weather = "xxxx";
// ----------------------- PARAMETRES DU SERVEUR -------------------------
const PORT = process.env.PORT || 5000;
// Wit.ai parameters
const WIT_TOKEN = "XRMXW46ZCH2ZGTNEP2QAZKYGDVFDRZFH";   // saisir ici vos informations (infos sur session XX)
// Messenger API parameters
const FB_PAGE_TOKEN = "EAADU3dPjxZBgBAPjZCwQLmrlQJeOauOJNNIdyyE0L7xmZBZAjwt2EXY1OxM7kaTL3Y9mTZATIfVMepxjYf6D567HZAK3fiQgcqtgXpEuAd2ZAcD21Gq0aIHWW5EKurcwpVHUBbRLkkyD1IpRMDZAPZBRO427totGBb09LJvDbI3ODhTOsOr9pu7BZC";   // saisir ici vos informations (infos sur session XX)
if ( !FB_PAGE_TOKEN ) {
  throw new Error( 'missing FB_PAGE_TOKEN' )
}
const FB_APP_SECRET = "02ee3a1804ec4367761f6f779be939bf";   // saisir ici vos informations (infos sur session XX)
if ( !FB_APP_SECRET ) {
  throw new Error( 'missing FB_APP_SECRET' )
}
let FB_VERIFY_TOKEN = "Ppastaga51";   // saisir ici vos informations (infos sur session XX)
crypto.randomBytes( 8, ( err, buff ) => {
  if ( err ) throw err;
  FB_VERIFY_TOKEN = buff.toString( 'hex' );
  console.log( `/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"` );
} );

// ----------------------- FONCTION POUR VERIFIER UTILISATEUR OU CREER ----------------------------
var checkAndCreate = (fbid, prenom, nom, genre) => {
	var userz = firebase.database()
		.ref()
		.child("accounts")
		.orderByChild("fbid")
		.equalTo(fbid)
		.once("value", function(snapshot) {
				admin.auth()
					.createCustomToken(fbid)
					.then(function(customToken) {
						firebase.auth()
							.signInWithCustomToken(customToken)
							.then(function() {
								//inserer notre compte
								var user2 = firebase.auth().currentUser;
								var keyid = firebase.database()
									.ref()
									.child('accounts')
									.push();
								firebase.database()
									.ref()
									.child('accounts')
									.child(keyid.key)
									.set({
										fbid: fbid,
                    prenom : prenom,
                    nom : nom,
                    genre : genre,
										date: new Date()
											.toISOString()
									})
									.catch(function(error2) {
										console.log(error2);
									});
							})
							.catch(function(error) {
								// Handle Errors here.
								var errorCode = error.code;
								var errorMessage = error.message;
							});
					})
					.catch(function(error3) {
						console.log("Erreur : "+ error3);
					});
		});
};
// ------------------------ FONCTION DEMANDE INFORMATIONS USER -------------------------
var requestUserName = (id) => {
	var qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
	return fetch('https://graph.facebook.com/v2.8/' + encodeURIComponent(id) + '?' + qs)
		.then(rsp => rsp.json())
		.then(json => {
			if (json.error && json.error.message) {
				throw new Error(json.error.message);
			}
			return json;
		});
};
// ------------------------- ENVOI MESSAGES SIMPLES ( Texte, images, boutons g�n�riques, ...) -----------
var fbMessage = ( id, data ) => {
  var body = JSON.stringify( {
    recipient: {
      id
    },
    message: data,
  } );
  console.log( "BODY" + body );
  var qs = 'access_token=' + encodeURIComponent( FB_PAGE_TOKEN );
  return fetch( 'https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
  } ).then( rsp => rsp.json() ).then( json => {
    if ( json.error && json.error.message ) {
      console.log( json.error.message + ' ' + json.error.type + ' ' +
        json.error.code + ' ' + json.error.error_subcode + ' ' + json.error
        .fbtrace_id );
    }
    return json;
  } );
};
// ----------------------------------------------------------------------------
const sessions = {};
// ------------------------ FONCTION DE CREATION DE SESSION ---------------------------
var findOrCreateSession = (fbid) => {
	let sessionId;
	Object.keys(sessions)
		.forEach(k => {
			if (sessions[k].fbid === fbid) {
				sessionId = k;
			}
		});
	if (!sessionId) {
		sessionId = new Date()
			.toISOString();
		sessions[sessionId] = {
			fbid: fbid,
			context: {}
		};
    requestUserName(fbid)
      .then((json) => {
        sessions[sessionId].name = json.first_name;
				checkAndCreate(fbid, json.first_name,  json.last_name, json.gender);
      })
      .catch((err) => {
        console.error('Oops! Il y a une erreur : ', err.stack || err);
      });
	}
	return sessionId;
};
// ------------------------ FONCTION DE RECHERCHE D'ENTITES ---------------------------
var firstEntityValue = function( entities, entity ) {
    var val = entities && entities[ entity ] && Array.isArray( entities[ entity ] ) &&
      entities[ entity ].length > 0 && entities[ entity ][ 0 ].value
    if ( !val ) {
      return null
    }
  return typeof val === 'object' ? val.value : val
}
// ------------------------ LISTE DE TOUTES VOS ACTIONS A EFFECTUER ---------------------------

var actions = {
  // fonctions gen�rales � d�finir ici
  send( {sessionId}, response ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      if ( response.quickreplies ) {
        response.quick_replies = [];
        for ( var i = 0, len = response.quickreplies.length; i < len; i++ ) {
          response.quick_replies.push( {
            title: response.quickreplies[ i ],
            content_type: 'text',
            payload: response.quickreplies[ i ]
          } );
        }
        delete response.quickreplies;
      }
      return fbMessage( recipientId, response )
        .then( () => null )
        .catch( ( err ) => {
          console.log( "Je send" + recipientId );
          console.error(
            'Oops! erreur ',
            recipientId, ':', err.stack || err );
        } );
    } else {
      console.error( 'Oops! utilisateur non trouv� : ', sessionId );
      return Promise.resolve()
    }
  },
  envoyer_message_text( sessionId, context, entities, text ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response = {
      "text": text
    };
    return fbMessage( recipientId, response )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
  getUserName( sessionId, context, entities ) {
    const recipientId = sessions[ sessionId ].fbid;
    const name = sessions[ sessionId ].name || null;
    return new Promise( function( resolve, reject ) {
      if ( recipientId ) {
        if ( name ) {
            context.userName = name;
            resolve( context );
        } else {
          requestUserName( recipientId )
            .then( ( json ) => {
              sessions[ sessionId ].name = json.first_name;
              context.userName = json.first_name;
              resolve( context );
            } )
            .catch( ( err ) => {
              console.log( "ERROR = " + err );
              console.error(
                'Oops! Erreur : ',
                err.stack || err );
              reject( err );
            } );
        }
      } else {
        console.error( 'Oops! pas trouv� user :',
          sessionId );
        reject();
      }
    } );
  },
envoyer_message_bouton_generique( sessionId, context, entities, elements ) {
    const recipientId = sessions[ sessionId ].fbid;
    return fbMessage( recipientId, elements )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_bouton_generique" + recipientId );
      } );
  },
envoyer_message_quickreplies( sessionId, context, entities, text, quick ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response2 = {
      "text": text,
      "quick_replies": quick
    };
    return fbMessage( recipientId, response2 )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
envoyer_message_image( sessionId, context, entities, image_url ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response = {
        "attachment":{
        "type":"image",
        "payload":{
          "url": image_url
        }
      }
    };
    return fbMessage( recipientId, response )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
choixCategories( sessionId,context ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      console.log( "CONTEXT DANS choixCategories" + context );
      var response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                        {
                          "title": "NutriScore",
                          "image_url": "https://mon-chatbot.com/nutribot2018/images/nutriscore-good.jpg",
                          "subtitle": "Recherchez ici un produit alimentaire et ses équivalents plus sains.",
                          "buttons": [
                            {
                              "type": "postback",
                              "title": " Informations",
                              "payload": "INFOS_SUR_LE_NUTRI"
                            },
                            {
                              "type": "postback",
                              "title": " Rechercher",
                              "payload": "PRODUIT_PLUS_SAIN"
                            },
                            {
                              "type": "postback",
                              "title": " Produit + sain",
                              "payload": "ALTERNATIVE_BEST"
                            }

                   ]
                 },
                 {
                "title": "Le sucre",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/sucre.jpg",
                "subtitle": "Connaissez-vous réellement le Sucre ? Percez ici tous ses mystères !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_SUCRE"
                 }
               ]
             },
              {
                "title": "Les aliments",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/aliments.jpg",
                "subtitle": "Quels aliments contiennent du sucre ? Vous allez être surpris !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ALIMENTS"
                }
              ]
            },
              {
                "title": "Les additifs",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/additifs.jpg",
                "subtitle": "C'est quoi un additif ? Où les trouvent-on ?",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ADDITIFS"
               }
             ]
           },
              {
                "title": "Les nutriments",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/nutriments.jpg",
                "subtitle": "Eléments indispensables �  l'Homme ! Découvrez tous les secrets des nutriments.",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_NUTRIMENTS"
              }
            ]
          },
              {
                "title": "La diététique",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/diet.jpg",
                "subtitle": "Découvrez ici tous mes conseils concernant la diététique !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_DIETETIQUE"
             }
           ]
         },
              {
                "title": "L'organisme",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/organisme.jpg",
                "subtitle": "Ici vous découvrirez tous les secrets concernant votre corps et le sucre !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ORGANISME"
            }
          ]
        }


        ]
          }
        }
      };
      var response_text = {
        "text": "PS : Voici mes derniers posts ^^ Si cela peux t'aider ..."
      };
      return fbMessage( recipientId, response_text ).then( () => {
        return fbMessage( recipientId, response ).then( () => {
          console.log( "okay choixCategories " + recipientId );
        } ).catch( ( err ) => {
          console.log( "Erreur choixCategories" + recipientId );
          console.error( 'Oops! An error forwarding the response to',
            recipientId, ':', err.stack || err );
        } );
        console.log( "okay choixCategories " + recipientId );
      } ).catch( ( err ) => {
        console.log( "Erreur choixCategories" + recipientId );
        console.error( 'Oops! An error forwarding the response to',
          recipientId, ':', err.stack || err );
      } );
    } else {
      console.error( 'Oops! Couldn\'t find user for session:', sessionId );
      return Promise.resolve()
    }
  },
choixCategories_retour( sessionId,context ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      console.log( "CONTEXT DANS choixCategories_retour" + context );
      var response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                        {
                          "title": "NutriScore",
                          "image_url": "https://mon-chatbot.com/nutribot2018/images/nutriscore-good.jpg",
                          "subtitle": "Recherchez ici un produit alimentaire et ses équivalents plus sains.",
                          "buttons": [
                            {
                              "type": "postback",
                              "title": "❓ Informations",
                              "payload": "INFOS_SUR_LE_NUTRI"
                            },

                            {
                              "type": "postback",
                              "title": "🔍 Rechercher",
                              "payload": "PRODUIT_PLUS_SAIN"
                            },
                            {
                              "type": "postback",
                              "title": "🍏 Produit + sain",
                              "payload": "ALTERNATIVE_BEST"
                            }
                   ]
                 },
                 {
                "title": "Le sucre",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/sucre.jpg",
                "subtitle": "Connaissez-vous réellement le Sucre ? Percez ici tous ses mystères !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_SUCRE"
                 }
               ]
             },
              {
                "title": "Les aliments",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/aliments.jpg",
                "subtitle": "Quels aliments contiennent du sucre ? Vous allez être surpris !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ALIMENTS"
                }
              ]
            },
              {
                "title": "Les additifs",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/additifs.jpg",
                "subtitle": "C'est quoi un additif ? Où les trouvent-on ?",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ADDITIFS"
               }
             ]
           },
              {
                "title": "Les nutriments",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/nutriments.jpg",
                "subtitle": "Eléments indispensables �  l'Homme ! Découvrez tous les secrets des nutriments.",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_NUTRIMENTS"
              }
            ]
          },
              {
                "title": "La diététique",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/diet.jpg",
                "subtitle": "Découvrez ici tous mes conseils concernant la diététique !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_DIETETIQUE"
             }
           ]
         },
              {
                "title": "L'organisme",
                "image_url": "https://mon-chatbot.com/nutribot2018/images/organisme.jpg",
                "subtitle": "Ici vous découvrirez tous les secrets concernant votre corps et le sucre !",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En Savoir +",
                    "payload": "CAT_ORGANISME"
            }
          ]
        }


        ]
          }
        }
      };
      var response_text = {
        "text": "Tr�s bien, recommen�ons ! Voici les th�mes que je peux vous te sug�rer:"
      };
      return fbMessage( recipientId, response_text ).then( () => {
        return fbMessage( recipientId, response ).then( () => {
          console.log( "okay choixCategories " + recipientId );
        } ).catch( ( err ) => {
          console.log( "Erreur choixCategories" + recipientId );
          console.error( 'Oops! An error forwarding the response to',
            recipientId, ':', err.stack || err );
        } );
        console.log( "okay choixCategories " + recipientId );
      } ).catch( ( err ) => {
        console.log( "Erreur choixCategories" + recipientId );
        console.error( 'Oops! An error forwarding the response to',
          recipientId, ':', err.stack || err );
      } );
    } else {
      console.error( 'Oops! Couldn\'t find user for session:', sessionId );
      return Promise.resolve()
    }
  },
remerciements(entities,context,sessionId) {
    const recipientId = sessions[ sessionId ].fbid;
    var response2 = {
    "text": "De rien, n'h�sites-pas �  me solliciter ! :-)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Retourner �  l'accueil",
        "payload": "RETOUR_ACCUEIL",
        "image_url": "https://mon-chatbot.com/nutribot2018/images/back.png"
          },
      {
        "content_type": "text",
        "title": "Au revoir",
        "payload": "ByeByeBye",
        "image_url": "https://mon-chatbot.com/nutribot2018/images/exit.png"
          }
        ]
    };
    return fbMessage( recipientId, response2 ).then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur genese" + recipientId );
        console.error(
          'Oops! An error forwarding the response to',
          recipientId, ':', err.stack || err );
      } );

  },
byebye( sessionId,context ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      var response = {
        "text": "Je suis ravie d'avoi pu t'aider dans ta qu�te, j'esp�re maintenant que vous êtes incollable sur le sucre. Sachez que je suis mis �  jour r�guli�rement, n'hesistes pas �  revenir poser des questions ! � bient�t."
      };
      return fbMessage( recipientId, response ).then( () => {
        console.log( "Send byebye sur " + recipientId );
      } ).catch( ( err ) => {
        console.log( "Erreur byebye" + recipientId );
        console.error(
          'Oops! An error occurred while forwarding the byebye to',
          recipientId, ':', err.stack || err );
      } );
    } else {
      console.error( 'Oops! Couldn\'t find user for session:', sessionId );
      return Promise.resolve()
    }
  },
insultes(entities,context,sessionId) {
    const recipientId = sessions[ sessionId ].fbid;
    var response2 = {
    "text": "BOH BOH BOH !  !!",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Retourner �  l'accueil",
        "payload": "RETOUR_ACCUEIL",
        "image_url": "https://mon-chatbot.com/nutribot2018/images/back.png"
          },
      {
        "content_type": "text",
        "title": "Non merci !",
        "payload": "ByeByeBye",
        "image_url": "https://mon-chatbot.com/nutribot2018/images/exit.png"
          }
        ]
    };
    return fbMessage( recipientId, response2 ).then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur genese" + recipientId );
        console.error(
          'Oops! An error forwarding the response to',
          recipientId, ':', err.stack || err );
      } );

  },
	
 reset_context( entities, context, sessionId ) {
    console.log( "Je vais reset le context" + JSON.stringify( context ) );
    return new Promise( function( resolve, reject ) {
      context = {};
      return resolve( context );
    } );
  }
};
// --------------------- CHOISIR LA PROCHAINE ACTION (LOGIQUE) EN FCT DES ENTITES OU INTENTIONS------------
function choisir_prochaine_action( sessionId, context, entities ) {
  // ACTION PAR DEFAUT CAR AUCUNE ENTITE DETECTEE
  if(Object.keys(entities).length === 0 && entities.constructor === Object) {

  }
  // PAS DINTENTION DETECTEE
  if(!entities.intent) {

  }
  // IL Y A UNE INTENTION DETECTION : DECOUVRONS LAQUELLE AVEC UN SWITCH
  else {
    switch ( entities.intent && entities.intent[ 0 ].value ) {
		

case "Dire_Bonjour":
		actions.reset_context( entities, context, sessionId ).then(function() {
      actions.getUserName( sessionId, context, entities ).then( function() {
        actions.envoyer_message_text(sessionId, context, entities, "🎈").then(function() {  
         actions.envoyer_message_text( sessionId, context, entities, 'Hey '+context.userName+"! Moi c'est NAT∑") .then(function() {
         actions.envoyer_message_text(sessionId, context, entities, "Mon but c'est de consommer local et de t'inspirer sur notre riche région Occitanie tout en étant eco-responsables. Qui as dit que cela rythmer avec Has Been ? 😂").then(function() {
           actions.envoyer_message_text(sessionId, context, entities, "Ce que je te propose : on tcharre de temps à autre sur mon défi Occitanie et je t'aide à t'inspirer ").then(function() {  
		        actions.envoyer_message_text(sessionId, context, entities, "C'est partie 😎?");
         // laisser le tribune libre pour la réponse ( intégrer du coup une case dire_ouiçava ou non j'ai pas le moral )
                  })
                })
              })
            })
          }) 
        })  
        break;
			
	//case "Dire_oui_ça_vas"
	// case "Dire_non-pas_la_motiv"
        
			
			
	case "Premier_Bonjour":
		actions.envoyer_message_text( sessionId, context, entities, '🎉');
		actions.envoyer_message_text( sessionId, context, entities, 'Hey '+context.userName+" ! Moi c'est Nat∑ 🤙 ! Je me suis lancer un challenge en Occitanie ").then(function() {
        actions.envoyer_message_text( sessionId, context, entities, "Ce que je te propose on discute de temps �  autre d'un des divers sujets de mon challenge.Tout en exprimant mes resentit... Et si tu rejoignez mon challenge d'après Covid 19").then(function() {
									 
		// intégrer le quickreply c'est partie ? oui! Dis m'en plus? non !
		})
		})
			
        break;
			
	case "RETOUR_ACCUEIL":
        // Revenir �  l'accueil et changer de texte
        actions.reset_context( entities,context,sessionId ).then(function() {
          actions.choixCategories_retour( sessionId,context );
        })
        break;
			
	case "Dire_Thanks":
        actions.remerciements(entities,context,sessionId);
        break;
			
	case "Repondre_injures":
        actions.insultes(entities, context, sessionId).then(function() {
		})
        break;
			
	case "Dire_Aurevoir":
        actions.byebye( sessionId,context ).then(function() {
		})
        break;
			
	case "GO_TO_MENU_DEMARRER":
        actions.reset_context( entities,context,sessionId ).then(function() {
          actions.choixCategories( sessionId,context );
        })
        break;
			
		// autres case ici au fil du temps 	
			
    };
  }
};

// --------------------- FONCTION POUR AFFICHER LA METEO EN FCT DE LA LAT & LNG ------------

// --------------------- LE SERVEUR WEB ------------
const wit = new Wit( {
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger( log.INFO )
} );
const app = express();
app.use(( {
    method,
    url
  }, rsp, next ) => {
    rsp.on( 'finish', () => {
      console.log( `${rsp.statusCode} ${method} ${url}` );
    } );
    next();
});
app.use( bodyParser.json( {
  verify: verifyRequestSignature
} ) );
// ------------------------- LE WEBHOOK / hub.verify_token � CONFIGURER AVEC LE MEME MOT DE PASSE QUE FB_VERIFY_TOKEN ------------------------
app.get( '/webhook', ( req, res ) => {
  if ( req.query[ 'hub.mode' ] === 'subscribe' && req.query[
      'hub.verify_token' ] === "Ppastaga51" ) { // remplir ici � la place de xxxx le meme mot de passe que FB_VERIFY_TOKEN
    res.send( req.query[ 'hub.challenge' ] );
  } else {
    res.sendStatus( 400 );
  }
} );
// ------------------------- LE WEBHOOK / GESTION DES EVENEMENTS ------------------------
app.post( '/webhook', ( req, res ) => {
  const data = req.body;
  if ( data.object === 'page' ) {
    data.entry.forEach( entry => {
      entry.messaging.forEach( event => {
        if ( event.message && !event.message.is_echo ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
          var {
            text,
            attachments,
            quick_reply
          } = event.message;

          function hasValue( obj, key ) {
            return obj.hasOwnProperty( key );
          }
          console.log(JSON.stringify(event.message));
          // -------------------------- MESSAGE IMAGE OU GEOLOCALISATION ----------------------------------
          if (event.message.attachments != null  && typeof event.message.attachments[0] != 'undefined') {
              // envoyer � Wit.ai ici
            
					}
          // --------------------------- MESSAGE QUICK_REPLIES --------------------
					else if ( hasValue( event.message, "text" ) && hasValue(event.message, "quick_reply" ) ) {
            // envoyer � Wit.ai ici
          
          }
          // ----------------------------- MESSAGE TEXT ---------------------------
          else if ( hasValue( event.message, "text" ) ) {
              // envoyer � Wit.ai ici
              wit.message( text, sessions[ sessionId ].context )
                .then( ( {
                  entities
                } ) => {
                  choisir_prochaine_action( sessionId, sessions[
                    sessionId ].context, entities );
                  console.log( 'Yay, on a une response de Wit.ai : ' + JSON.stringify(
                    entities ) );
                } )
                .catch( console.error );
          }
          // ----------------------------------------------------------------------------
          else {
              // envoyer � Wit.ai ici
          }
        }
        // ----------------------------------------------------------------------------
        else if ( event.postback && event.postback.payload ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
            // envoyer � Wit.ai ici
            

          }
        // ----------------------------------------------------------------------------
        else {
          console.log( 'received event : ', JSON.stringify( event ) );
        }
      } );
    } );
  }
  res.sendStatus( 200 );
} );
// ----------------- VERIFICATION SIGNATURE -----------------------
function verifyRequestSignature( req, res, buf ) {
  var signature = req.headers[ "x-hub-signature" ];
  if ( !signature ) {
    console.error( "Couldn't validate the signature." );
  } else {
    var elements = signature.split( '=' );
    var method = elements[ 0 ];
    var signatureHash = elements[ 1 ];
    var expectedHash = crypto.createHmac( 'sha1', FB_APP_SECRET ).update( buf )
      .digest( 'hex' );
    if ( signatureHash != expectedHash ) {
      throw new Error( "Couldn't validate the request signature." );
    }
  }
}
app.listen( PORT );
console.log( 'Listening on :' + PORT + '...' );
