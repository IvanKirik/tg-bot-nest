import { Injectable } from '@nestjs/common';
import {dirname, resolve} from "path";
import { removeFile } from "../utils/removeFile.util";
import axios from "axios";
import { createWriteStream } from "fs";
import { Ffmpeg, InjectFluentFfmpeg } from "@mrkwskiti/fluent-ffmpeg-nestjs";
import * as fs from "fs";

@Injectable()
export class ConverterService {
  constructor(@InjectFluentFfmpeg() private readonly ffmpeg: Ffmpeg) {
  }

  public toMp3(input: any, output: string) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        this.ffmpeg(input)
          .inputOptions('-t 30')
          .output(outputPath)
          .on('end', () => {
            removeFile(input)
            resolve(outputPath)

          })
          .on('error', (err) => {
            reject(err.message)
            console.log(err.message)
          })
          .run()
      })
    } catch (e: any) {
      console.log(`Error while creating mp3 ${e.message}`)
    }
  }

  public async create(url: string, filename: string) {
    try {
      const folderPath = resolve(__dirname, '../voices');
      if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const oggPath = resolve(folderPath, `${filename}.ogg`);
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
      })

      return new Promise(resolve => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      })

    } catch (e: any) {
      console.log(`Error while creating ogg ${e.message}`)
    }
  }
}
