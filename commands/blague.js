var request = require('request');
const Discord = require('discord.js');
module.exports = {
    name: 'blague',
    description: 'Send joke!',
    execute(message) {
        const {
            prefix,
            token,
            token_blague,
            Administrateur_Id,
            TicketSpacer
        } = require('../config.json');
        request({
            url: 'https://www.blagues-api.fr/api/random',
            headers: {
                'Authorization': 'Bearer ' +  token_blague + ''
            },
            json: true
        }, function (err, res, json) {
            if (err) {
                throw err;
            }
            console.log(json);
            const rep = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setDescription(json.joke + "\n\n" + "||" + json.answer + "||")
                .setTimestamp()
            message.channel.send(rep)
        });
    },
};