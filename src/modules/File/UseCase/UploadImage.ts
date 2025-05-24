import { MultipartFile } from "@fastify/multipart";
import { uploadDir } from "../../../utils/UploadDir";
import util from 'util';
import { pipeline } from 'stream';
import path from "path";
import fs from 'fs';


export default class UploadImage {
    constructor(
        private dir: string
    ) {}

    public async execute(file: MultipartFile): Promise<string> {
        const pump = util.promisify(pipeline);
        
        const divisionFileName = file.filename.split('.');
        const indexExtension = divisionFileName.length - 1;
        const fileExtension = divisionFileName[indexExtension];
        

        const data = new Date()
        const filename = `${data.getTime()}.${fileExtension}`;

        const filepath = path.join(uploadDir, filename);

        await pump(file.file, fs.createWriteStream(filepath));

        return `/api/image/${filename}`;
    }
}