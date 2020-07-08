const Discord = require('discord.js');
module.exports = {
    name: 'ticket',
    description: 'Create Ticket!',
    execute(message) {
        const {
            prefix,
            token,
            Administrateur_Id,
            TicketSpacer
        } = require('../config.json');

        var userName = message.author.username;
        var userId = message.author.discriminator;
        var alreadyTicket = false;
        var AlreadySpacer = false;

        message.guild.channels.forEach((channel) => {
            if (channel.name == userName.toLowerCase() + "-" + userId) {
                sendError(message, "Erreur, Vous avez déjà un ticket support d\'ouvert !");
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
            message.guild.createChannel('Ticket', {
                type: 'category'
            }).then((createdSpace) => {
                TicketSpacer = createdSpace.id;

                fileConfig.TicketSpacer = createdSpace.id;
                fs.writeFile(fileName, JSON.stringify(fileConfig), function (err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(fileConfig));
                    console.log('writing to ' + fileName);
                });
            });
        }

        message.guild.createChannel(userName + "-" + userId, "text", [{
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
            createdChan.send("Merci d’expliquer ton problème ici. Un administrateur vous répondra d’ici peu. Si ton problème est résolu écrit '!close'.");

            const rep = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setDescription("Ton ticket a été crée ==> <#" + createdChan.id + ">")
                .setTimestamp()
            message.channel.send(rep)
        });
    },
};