import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import * as send from "./src/lib/send";
import GenerateDragon from "./src/generate";

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`起動しました ログインタグは ${c.user.tag}`);
	if (process.env.DISCORD_BOT_NAME != client.user?.username) {
		console.error('設定されたBOT名とログインしたBOT名が一致しません。');
		process.exit(1);
	}
	main();
});

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
	console.error('ログインに失敗しました:', error);
	process.exit(1);
});

function main() {
	const logChannel: TextChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID?? "") as TextChannel;
	if (!logChannel) {
			console.error('ログ用チャンネルが見つかりませんでした。');
			process.exit(1);
	}
	sendStartupLog(logChannel);
	try {
		client.user?.setActivity('好きな惣菜発表ドラゴン', { type: 0 })

		GenerateDragon(client);

	} catch (error) {
		console.error('An error occurred:', error);
		if (error instanceof Error) {
			sendFailedLog(logChannel, error.toString());
		} else {
			sendFailedLog(logChannel, `変なエラーが発生しました。\n 詳細はログを確認 ${error}`);
		}
		process.exit(1);
	}
}

function sendStartupLog(channel: TextChannel) {
	const descText = `${process.env.DISCORD_BOT_NAME}が起動しました。\n${new Date().toLocaleString()}`;
	const embed = send.GenerateEmbed({ title: 'Startup', description: descText, color: 0x00ff00});
	send.SendMessage(channel, embed);
}

function sendFailedLog(channel: TextChannel, errorLog: string) {
	const descText = `${process.env.DISCORD_BOT_NAME}でエラーが発生しました。\n${new Date().toLocaleString()}\n${errorLog}`;
	console.error(descText);
	const embed = send.GenerateEmbed({ title: 'Error', description: descText, color: 0xff0000});
	send.SendMessage(channel, embed);
}
