import { AttachmentBuilder, ChatInputCommandInteraction, Client, Events, REST, Routes, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { loadImage, registerFont } from "canvas";
import { GenerateDragonImage, GenerateDragonImageAndText, GenerateDragonText } from "./lib/generate/image";
import * as send from "./lib/send";
import { styleText } from "util";
import GenerateDragonVideo from "./lib/generate/movie";

type commandHandlerType = (interaction: ChatInputCommandInteraction) => Promise<any>;

type commandType = {
  name: string;
  builder: SlashCommandOptionsOnlyBuilder;
  handler: commandHandlerType;
}

type logType = {
  title: string;
  type: string;
  content: string | null;
  isImage: boolean;
}

registerFont('./public/font/GenJyuuGothic-Normal.ttf', { family: 'GenJyuuGothic-Normal' });

const commands: commandType[] = [
  {
    name: "generate_dragon_image",
    builder: new SlashCommandBuilder()
      .setName('generate_dragon_image')
      .setDescription('発表ドラゴンジェネレーターの画像です.')
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
      const generateType = interaction.options.getString("type")
      const contentImgUrl = interaction.options.getAttachment("image")?.url
      const balloonImage = await loadImage(process.env.DRAGON_BALLOON_IMAGE_PATH ?? "");
      const dragonImage = await loadImage(process.env.DRAGON_BODY_IMAGE_PATH ?? "");
      if (!subtitle || !generateType) return await send.SendReply(interaction, send.GenerateText(`タイトルとタイプを入力してください。`))
      getLog({ title: subtitle, type: generateType, content: content, isImage: !!contentImgUrl });
      switch (generateType) {
        case "text":
          if (!content) return await send.SendReply(interaction, send.GenerateText(`内容を入力してください。`))
          const textAttachment = new AttachmentBuilder(GenerateDragonText({ subtitle, content, balloonImage, dragonImage }), { name: 'hapyou-dragon.png' });
          return await send.SendReply(interaction, send.GenerateFile(textAttachment));
        case "image":
          if (!contentImgUrl) return await send.SendReply(interaction, send.GenerateText(`画像を入力してください。`))
          const contentImage = await loadImage(contentImgUrl);
          const imgAttachment = new AttachmentBuilder(GenerateDragonImage({ subtitle, content: contentImage, balloonImage, dragonImage }), { name: 'hapyou-dragon.png' });
          return await send.SendReply(interaction, send.GenerateFile(imgAttachment));
        case "text_image":
          if (!content || !contentImgUrl) return await send.SendReply(interaction, send.GenerateText(`内容と画像を入力してください。`))
          const figureImg = await loadImage(contentImgUrl);
          const textImgAttachment = new AttachmentBuilder(GenerateDragonImageAndText({ subtitle, content, contentImg: figureImg, balloonImage, dragonImage }), { name: 'hapyou-dragon.png' });
          return await send.SendReply(interaction, send.GenerateFile(textImgAttachment));
        default:
          return await send.SendReply(interaction, send.GenerateText(`タイプが不正です。`))
      }
    }
  },{
    name: "generate_dragon_movie",
    builder: new SlashCommandBuilder()
      .setName('generate_dragon_movie')
      .setDescription('発表ドラゴンジェネレーターの動画です.'),
    handler: async (interaction) => {
      const reply = await send.SendReply(interaction, send.GenerateText(`動画生成中...`))
      GenerateDragonVideo().then(async (path) => {
        const videoAttachment = new AttachmentBuilder(path, { name: 'hapyou-dragon.mp4' })
        return await send.SendEdit(reply, send.GenerateFile(videoAttachment));
      })
      .catch((error) => {
        console.error('Failed to generate movie:', error);
        return send.SendEdit(reply, send.GenerateText(`動画の生成に失敗しました。`))
      })
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

function getLog(data: logType) {
	console.log(styleText('bgWhiteBright', styleText('black','----- Get Log -----')));
	console.log(styleText('yellow', `日付: ${new Date().toLocaleString()}`));
  console.log(styleText('white', `タイトル: ${JSON.stringify(data, null, 1)}\n`));
}


export default GenerateDragon;
