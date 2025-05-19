import path from "path";
import fs from 'fs';

export const uploadDir = path.join(`${__dirname}/..`, 'uploads');

if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
}