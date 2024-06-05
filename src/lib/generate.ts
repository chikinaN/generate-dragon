import { createCanvas, Image } from "canvas";
import { AttachmentBuilder } from "discord.js";

type TextDragonType = {
	subtitle: string;
	content: string;
	balloonImage: Image;
	dragonImage: Image;
}

type ImageDragonType = {
	subtitle: string;
	content: Image;
	balloonImage: Image;
	dragonImage: Image;
}

type ImageTextDragonType = {
	subtitle: string;
	content: string;
	contentImg: Image;
	balloonImage: Image;
	dragonImage: Image;
}

const fontSize = 90;
const fontStyle = '"GenJyuuGothic-Normal", sans-serif'

export function GenerateDragonText({ subtitle, content, balloonImage, dragonImage }: TextDragonType): AttachmentBuilder {
	const canvas = createCanvas(balloonImage.width, balloonImage.height);
	const context = canvas.getContext('2d');
	context.fillStyle = 'rgb( 255, 255, 255)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(balloonImage, 0, 0, canvas.width, canvas.height);
	context.drawImage(dragonImage, 0, 0, canvas.width, canvas.height);
	context.font = `${fontSize}px ${fontStyle}`;
	context.fillStyle = 'black';
	const lines = content.split('\\n');
	for (let i = 0; i < lines.length; i++) {
		context.fillText(lines[i], 175 + (500 - context.measureText(lines[i]).width) / 2, (400 - fontSize * lines.length / 2) + i * fontSize);
	}
	context.fillText(subtitle, (canvas.width - context.measureText(subtitle).width) / 2, 844);
	return new AttachmentBuilder(canvas.createPNGStream(), { name: 'hapyou-dragon.png' });
}

export function GenerateDragonImage({ subtitle, content, balloonImage, dragonImage }: ImageDragonType): AttachmentBuilder {
	const canvas = createCanvas(balloonImage.width, balloonImage.height);
	const context = canvas.getContext('2d');
	context.fillStyle = 'rgb( 255, 255, 255)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(balloonImage, 0, 0, canvas.width, canvas.height);
	context.drawImage(dragonImage, 0, 0, canvas.width, canvas.height);
	context.font = `${fontSize}px ${fontStyle}`;
	context.fillStyle = 'black';
	context.fillText(subtitle, (canvas.width - context.measureText(subtitle).width) / 2, 844);
	const [width, height] = calcContentSize(content.width, content.height, dragonImage.height / 3);
	context.drawImage(content, 425 - width / 2, 300 - height / 2, width, height);
	return new AttachmentBuilder(canvas.createPNGStream(), { name: 'hapyou-dragon.png' });
}

export function GenerateDragonImageAndText({ subtitle, content, contentImg, balloonImage, dragonImage }: ImageTextDragonType): AttachmentBuilder {
	const canvas = createCanvas(balloonImage.width, balloonImage.height);
	const context = canvas.getContext('2d');
	context.fillStyle = 'rgb( 255, 255, 255)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(balloonImage, 0, 0, canvas.width, canvas.height);
	context.drawImage(dragonImage, 0, 0, canvas.width, canvas.height);
	context.font = `${fontSize}px ${fontStyle}`;
	context.fillStyle = 'black';
	context.fillText(subtitle, (canvas.width - context.measureText(subtitle).width) / 2, 844);
	const [width, height] = calcContentSize(contentImg.width, contentImg.height, dragonImage.height / 4);
	context.drawImage(contentImg, 425 - width / 2, 250 - height / 2, width, height);
	context.font = `${fontSize - 15}px ${fontStyle}`;
	context.fillText(content, 175 + (500 - context.measureText(content).width) / 2, 250 + height / 2 + fontSize - 15)
	return new AttachmentBuilder(canvas.createPNGStream(), { name: 'hapyou-dragon.png' });
}

function calcContentSize(width: number, height:number, size: number): [number, number] {
	const ratio = width / height;
	if (ratio > 1) {
		return [size * ratio, size];
	} else {
		return [size, size / ratio];
	}
}
