import { AttachmentBuilder, ChatInputCommandInteraction, Client, Events, REST, Routes, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { SendReply, GenerateText } from "./lib/send";
import { createCanvas, loadImage, registerFont } from "canvas";

type commandType = {
  name: string;
  builder: SlashCommandOptionsOnlyBuilder;
  handler: (interaction: ChatInputCommandInteraction) => Promise<any>;
}

registerFont('./public/font/GenJyuuGothic-Normal.ttf', { family: 'GenJyuuGothic-Normal' });

const commands: commandType[] = [
  {
    name: "generate_dragon",
    builder: new SlashCommandBuilder()
      .setName('generate_dragon')
      .setDescription('発表ドラゴンジェネレーターです.')
      .addStringOption(option => option
        .setName('title')
        .setDescription('下部のタイトル')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('吹き出しのテキスト')
        .setRequired(true)
      ),
    handler: async (interaction) => {
      const subtitle = interaction.options.getString("title")
			const content = interaction.options.getString("content")
			if (!subtitle || !content) return await SendReply(interaction, GenerateText(`タイトルと内容を入力してください。`))
			const balloonImage = await loadImage('./public/img/balloon.png');
			const dragonImage = await loadImage('./public/img/dragon.png');
			const canvas = createCanvas(balloonImage.width, balloonImage.height);
			const context = canvas.getContext('2d');
			context.fillStyle = 'rgb( 255, 255, 255)';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.drawImage(balloonImage, 0, 0, canvas.width, canvas.height);
			context.drawImage(dragonImage, 0, 0, canvas.width, canvas.height);
			context.font = '90px "GenJyuuGothic-Normal", sans-serif';
			context.fillStyle = 'black';
			context.fillText(content, 175 + (500 - context.measureText(content).width) / 2, 358);
			context.font = '77px "GenJyuuGothic-Normal", sans-serif';
			context.fillText(subtitle, (canvas.width - context.measureText(subtitle).width) / 2, 844);
			const attachment = new AttachmentBuilder(canvas.createPNGStream(), { name: 'profile-image.png' });
      await interaction.reply({ files: [attachment] });
    }
  }
]


function GenerateDragon(client: Client) {
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? "")
  async function main() {
    await rest.put(
      Routes.applicationCommands(client.user?.id ?? ""),
      { body: commands.map(command => command.builder.toJSON()) }
    )
  }
  const commandHandlers = commands.reduce((handlers, command) => {
    handlers[command.name] = command.handler;
    return handlers;
  }, {} as { [key: string]: (interaction: ChatInputCommandInteraction) => Promise<any> });

  if (process.env.DISCORD_BOT_TOKEN) main().then(() => {
    client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
				return commandHandlers[interaction.commandName](interaction)
      }
    })
  })
    .catch(err => console.log(err))
}

export default GenerateDragon;
