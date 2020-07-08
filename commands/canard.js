var request = require('request');
const Discord = require('discord.js');
module.exports = {
    name: 'canard',
    description: 'Send duck!',
    execute(message) {
        request({
            url: 'https://random-d.uk/api/v2/random',
            json: true
        }, function (err, res, json) {
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
    },
};