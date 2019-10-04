const Discord = require('discord.js');
var {
	prefix,
	Administrateur_Id,
	banwords,
	AdminChannel,
	AccueilChannel,
	TicketSpacer,
} = require('./config.json');

const client = new Discord.Client();
var express = require('express');
var request = require('request');
const body = require('body-parser');
const dotenv = require('dotenv');

var fs = require('fs');
var fileName = './config.json';
var fileConfig = require(fileName);

var app = express();
app.use(body());
dotenv.config();

const discord_token = process.env.DISCORD_TOKEN;
const web_token = process.env.API_TOKEN;

client.once('ready', () => {
	console.log('Je suis connecté !');
});
client.once('reconnecting', () => {
	console.log('Je me reconnect!');
});
client.once('disconnect', () => {
	console.log('Je me suis déconectez!');
});


function sendError(message, description) {
    message.channel.send({embed: {
        color: 15158332,
        description: ':x: ' + description
    }});
}

function sendConfirmation(message, description) {
    message.channel.send({embed: {
        color: 15158332,
        description: ':white_check_mark: ' + description
    }});
}

function adminLog(description) {
    client.channels.get(AdminChannel).send({embed: {
        color: 15158332,
        description: ':white_check_mark: ' + description
    }});
}

client.on('message', async message => {
	let wordArray = message.content.split(" ");
	wordArray = wordArray.map(function(x){ return x.toLowerCase() })

	for (var i = 0; i < banwords.length; i++) {
		if (wordArray.includes(banwords[i])) {
			message.delete();
			sendError(message, 'Erreur, Merci de ne pas utiliser de mots interdits');
		break;
		}
	}
})


client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
    
    let splitMessage = message.content.split(" ");
    let cmd = splitMessage[0];
	console.log(cmd);

    
    switch (cmd) {
        case '!hello':
			message.reply('World');
        break;

        case '!cmd':
            if (splitMessage.length === 2) {
                message.channel.send('Param: ' + splitMessage[1]);
            } else {
                sendError(message, 'Erreur, problème dans les paramètre');
            }
        break;

        case '!ban':
			if (message.member.roles.has(Administrateur_Id)) {
				if (splitMessage.length === 2) {
					message.guild.ban(message.mentions.users.first());
					adminLog(splitMessage[1] + ' a été bannie');
				}
			} else {
				sendError(message, "Erreur, Vous n\'avvez pas la permission");
			}
		break;
			
		case '!ticket':
			var userName = message.author.username;
			var userId = message.author.discriminator;
			var alreadyTicket = false;
			var AlreadySpacer = false;
			
			message.guild.channels.forEach((channel) => {
				if (channel.name == userName.toLowerCase() + "-" + userId) {
					sendError(message, "Erreur, Vous avez déja un ticket supportt d\'ouvert !");
					alreadyTicket = true;
				}
			});
			if (alreadyTicket == true) return;
			
			message.guild.channels.forEach((channel) => {
				if (channel.name == "Ticket") {
					AlreadySpacer = true;
				}
			});
			if (AlreadySpacer == false) {
				message.guild.createChannel('Ticket', { type: 'category' }).then((createdSpace) => {
					TicketSpacer = createdSpace.id;
	
					fileConfig.TicketSpacer = createdSpace.id;
					fs.writeFile(fileName, JSON.stringify(fileConfig), function (err) {
					if (err) return console.log(err);
						console.log(JSON.stringify(fileConfig));
						console.log('writing to ' + fileName);
					});
				});
			}

			message.guild.createChannel(userName + "-" + userId, "text", [
				{
					id: message.guild.defaultRole.id,
					deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
					allow: []
				},
				{
					id: Administrateur_Id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
				{
					id: message.author.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
			]).then((createdChan) => {
				createdChan.setParent(TicketSpacer);
				createdChan.send("Merci d'expliquer ton problème ici. Un administrateur vous répondras d'ici peu. Si ton problème est résolue écrit '!close'.");
			
				const rep = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setDescription("Ton ticket a été créé ==> <#" + createdChan.id + ">")
					.setTimestamp()
				message.channel.send(rep)
			});
		break;

		case '!close':
			if (message.channel.parentID == TicketSpacer) {
				message.channel.delete();
			} else {
				sendError(message, "Erreur, Ce n\'est pas un ticket support.");
			}
		break;

		case '!set':
			var param = splitMessage[1];
			var value = splitMessage[2];

			if (message.member.roles.has(Administrateur_Id)) {
				switch (param) {
					case 'Administrateur_Id':
						Administrateur_Id = value;
	
						fileConfig.Administrateur_Id = value;
						fs.writeFile(fileName, JSON.stringify(fileConfig), function (err) {
						if (err) return console.log(err);
							console.log(JSON.stringify(fileConfig));
							console.log('writing to ' + fileName);
						});
						sendConfirmation(message, "Vous avez changé(e) l\'Id du groupe Administrateur");
					break;
	
					case 'AdminChannel':
						AdminChannel = value;
	
						fileConfig.AdminChannel = value;
						fs.writeFile(fileName, JSON.stringify(fileConfig), function (err) {
						if (err) return console.log(err);
							console.log(JSON.stringify(fileConfig));
							console.log('writing to ' + fileName);
						});
						sendConfirmation(message, "Vous avez changé(e) le channel Admin");
					break;
	
					case 'AccueilChannel':
						AccueilChannel = value;
	
						fileConfig.AccueilChannel = value;
						fs.writeFile(fileName, JSON.stringify(fileConfig), function (err) {
						if (err) return console.log(err);
							console.log(JSON.stringify(fileConfig));
							console.log('writing to ' + fileName);
						});
						sendConfirmation(message, "Vous avez changé(e) le channel d\'Accueil");
					break;
				
					default:
						sendError(message, "Paramète invalide!")
					break;
				}
			} else {
				sendError(message, "Erreur, Vous n\'avez pas la permission");
			}
		break;

		case ('!blague'):
			request({url: 'https://blague.xyz/joke/random', json: true}, function(err, res, json) {
				if (err) {
					throw err;
				}
				var blague = json.joke;
				const rep = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setDescription(blague.question + "\n\n" + "||" + blague.answer + "||")
					.setTimestamp()
				message.channel.send(rep)
			});	
		break;

		case ('!canard'):
			request({url: 'https://random-d.uk/api/v2/random', json: true}, function(err, res, json) {
				if (err) {
					throw err;
				}
				const rep = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setTitle('Voici un beau canard!')
					.setImage(json.url)
					.setTimestamp()
				message.channel.send(rep)
			});	
		break;

        default:
			sendError(message, 'Erreur, La commande est inconnue.');
		break;
    }  
})


app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil, que puis-je pour vous ?');
});

app.post('/notif', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    const token = req.body.token
    const msg = req.body.msg

    if (token === web_token) {
		client.channels.get(AccueilChannel).send(msg);
		console.log(msg);
    } else {
        res.send("echecs");
    }
})

client.login(discord_token);
app.listen(3001);