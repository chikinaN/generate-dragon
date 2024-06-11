import { ChatInputCommandInteraction, Client, Events, REST, Routes, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { loadImage, registerFont } from "canvas";
import { GenerateDragonImage, GenerateDragonImageAndText, GenerateDragonText } from "./lib/generate";
import * as send from "./lib/send";

type commandHandlerType = (interaction: ChatInputCommandInteraction) => Promise<any>;

type commandType = {
  name: string;
  builder: SlashCommandOptionsOnlyBuilder;
  handler: commandHandlerType;
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
        .setName('type')
        .setDescription('contentのタイプ')
        .setRequired(true)
        .addChoices(
          {name:'テキスト', value:'text'},
          {name:'画像', value:'image'},
          {name:'テキスト＋画像', value:'text_image'}
        )
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('吹き出しのテキスト')
        .setRequired(false)
      )
      .addAttachmentOption(option => option
        .setName('image')
        .setDescription('吹き出し内の画像')
        .setRequired(false)
      ),
    handler: async (interaction) => {
      const subtitle = interaction.options.getString("title")
      const content = interaction.options.getString("content")
      const contentImgUrl = interaction.options.getAttachment("image")?.url
      const balloonImage = await loadImage(process.env.DRAGON_BALLOON_IMAGE_PATH ?? "");
      const dragonImage = await loadImage(process.env.DRAGON_BODY_IMAGE_PATH ?? "");
      if (!subtitle) return await send.SendReply(interaction, send.GenerateText(`タイトルを入力してください。`))
      switch (interaction.options.getString("type")) {
        case "text":
          if (!content) return await send.SendReply(interaction, send.GenerateText(`内容を入力してください。`))
          const textAttachment = GenerateDragonText({ subtitle, content, balloonImage, dragonImage });
          return await send.SendReply(interaction, send.GenerateFile(textAttachment));
        case "image":
          if (!contentImgUrl) return await send.SendReply(interaction, send.GenerateText(`画像を入力してください。`))
          const contentImage = await loadImage(contentImgUrl);
          const imgAttachment = GenerateDragonImage({ subtitle, content: contentImage, balloonImage, dragonImage });
          return await send.SendReply(interaction, send.GenerateFile(imgAttachment));
        case "text_image":
          if (!content || !contentImgUrl) return await send.SendReply(interaction, send.GenerateText(`内容と画像を入力してください。`))
          const figureImg = await loadImage(contentImgUrl);
          const textImgAttachment = GenerateDragonImageAndText({ subtitle, content, contentImg: figureImg, balloonImage, dragonImage });
          return await send.SendReply(interaction, send.GenerateFile(textImgAttachment));
      }
    }
  }
]
function dragonHandlers(commands: commandType[]): { [key: string]: commandHandlerType } {
  return commands.reduce((handlers, command) => {
    handlers[command.name] = command.handler;
    return handlers;
  }, {} as { [key: string]: commandHandlerType });
}

async function registerCommands(client: Client, rest: REST) {
  try {
    await rest.put(
      Routes.applicationCommands(client.user?.id ?? ""),
      { body: commands.map(command => command.builder.toJSON()) }
    );
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

function GenerateDragon(client: Client) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? "");
  const commandHandlers = dragonHandlers(commands);

  if (process.env.DISCORD_BOT_TOKEN) {
    registerCommands(client, rest).then(() => {
      client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
          return commandHandlers[interaction.commandName](interaction);
        }
      });
    });
  }
}

export default GenerateDragon;
