module.exports = {
	name: 'ban',
	description: 'Tag a member and ban them.',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('vous devez marquer un utilisateur pour le bannir!');
		}

		const taggedUser = message.mentions.users.first();

		message.channel.send(`Tu as ban : ${taggedUser.username}`);
		console.log(taggedUser.username);
		message.guild.ban(taggedUser);
	},
};