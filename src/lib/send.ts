import { ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, MessageCreateOptions } from "discord.js";
import { styleText } from "util";

function GenerateText(text: string, ephemeral?: true) {
	if (ephemeral) {
		return {content: text, ephemeral: true};
	}
	return {content: text};
}

function GenerateEmbed(text: { title: string, description: string, color: ColorResolvable}) {
	const embedObject = new EmbedBuilder()
														.setColor(text.color)
														.setTitle(text.title)
														.setDescription(text.description)
	return {embeds: [embedObject]};
}

function GenerateButton(id: string, label: string, style: ButtonStyle) {
	const button = new ButtonBuilder()
											.setCustomId(id)
											.setLabel(label)
											.setStyle(style);
	const actionRow = new ActionRowBuilder<ButtonBuilder>()
													.addComponents(button);
	return {components: [actionRow]};
}

async function SendMessage(channel: BaseGuildTextChannel, data: MessageCreateOptions) {
	sendLog(data);
	await channel.send(data);
}

async function SendReply(interaction: any, data: MessageCreateOptions) {
	sendLog(data);
	await interaction.reply(data);
}

function sendLog(data: any) {
	const text = typeof data === 'object' ? JSON.stringify(data, null, 1) : data;
	console.log(styleText('bgWhiteBright', styleText('black','----- Send Log -----')));
	console.log(styleText('yellow', `日付: ${new Date().toLocaleString()}`));
	console.log(styleText('white', `内容: ${text}\n`));
}

export { GenerateText, GenerateEmbed, GenerateButton, SendMessage, SendReply};
