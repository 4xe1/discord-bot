module.exports = {
    name: 'close',
    description: 'Close Ticket!',
    execute(message) {
        const {
            prefix,
            token,
            token_blague,
            Administrateur_Id,
            TicketSpacer
        } = require('../config.json');

        if (message.channel.parentID == TicketSpacer) {
            message.channel.delete();
        } else {
            sendError(message, "Erreur, Ce n\'est pas un ticket support.");
        }
    },
};