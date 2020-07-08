var request = require('request');
const Discord = require('discord.js');
module.exports = {
    name: 'blague',
    description: 'Send joke!',
    execute(message) {
        request({
            url: 'https://www.blagues-api.fr/api/random',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTczMDAyMjY2MTkyNjQyMDQ5IiwibGltaXQiOjEwMCwia2V5IjoiWXd0RUJPSE9VNEhjNGNsSEpQMHRHZGpyWGw2bDRvR2E1dEF2dHZGQnphY3pHY0hIM2giLCJjcmVhdGVkX2F0IjoiMjAyMC0wNy0wOFQyMDozNzoxOCswMjowMCIsImlhdCI6MTU5NDIzMzQzOH0.RubLWDozMILhvu2zKWXYclRRT5j5lZ1iOLIDw-Pk1wM'
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