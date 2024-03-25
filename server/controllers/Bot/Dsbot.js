const Discord = require('discord.js');
const client = new Discord.Client({ intents: 2048 });
const config = require('config');
const { EmbedBuilder } = require('discord.js');


client.once('ready', () => {
    console.log('Bot is ready!');
});

client.login(config.get("botToken"));

async function sendBotBuyMessage(userName,roleId,channelId,buy){
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const fields = buy.map(item => {
                return { name: `** ${item.item}**`,value:`Количество: ${item.count}`, inline: false }})
            const roleMention = `<@&${roleId}>`
            const embed = new EmbedBuilder()
                .setColor('#190747')
                .setTitle('**Покупка**')
                .setDescription(`**Модератор:** ${userName}`)
                .addFields(fields)
            channel.send({ embeds: [embed], content: roleMention });

            console.log(`Styled message sent to channel with ID ${channelId}`);
        } else {
            console.log(`Channel with ID ${channelId} not found.`);
        }
    } catch (error) {
        console.error(error);
        console.log("Internal Server Error");
    }
}

module.exports = { sendBotBuyMessage }