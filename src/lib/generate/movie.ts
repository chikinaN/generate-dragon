import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

const inputPath = './public/movie';
const outputPath = './src/lib/generate/test';

const inputFiles = ["percussion.wav", "harmony.wav", "piano.wav", "vocal.wav"];
const outputFile = "output.mp4";

const GenerateDragonVideo = async (): Promise<string> => {
  const balloonImage = await loadImage(process.env.DRAGON_BALLOON_IMAGE_PATH ?? "");
  const dragonImage = await loadImage(process.env.DRAGON_BODY_IMAGE_PATH ?? "");

  const canvas = createCanvas(dragonImage.width, dragonImage.height);
  const context = canvas.getContext('2d');

  context.fillStyle = 'rgb(255, 255, 255)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(balloonImage, 0, 0, canvas.width, canvas.height);
  context.drawImage(dragonImage, 0, 0, canvas.width, canvas.height);

  const mergedAudio = ffmpeg();

  inputFiles.forEach((file) => {
    mergedAudio.input(path.join(inputPath, file));
  });

  return new Promise((resolve, reject) => {
    mergedAudio
      .input(canvas.createPNGStream())
      .complexFilter([
        {
          filter: 'amix',
          options: {
            inputs: inputFiles.length,
            duration: 'longest',
          }
        }
      ])
      .outputOptions('-loop', '1')
      .videoCodec('mpeg4')
      .outputFormat('mp4')
      .on('start', (commandLine) => {
        console.log('Spawned FFmpeg with command: ' + commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('error', (err) => {
        console.error('Error: ' + err.message);
        reject(err);
      })
      .on('end', () => {
        console.log('Finished processing');
        resolve(path.join(outputPath, outputFile));
      })
      .save(path.join(outputPath, outputFile));
  });
};

export default GenerateDragonVideo;
