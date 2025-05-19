import { FastifyReply, FastifyRequest } from "fastify";
import fs from 'fs';
import path from "path";
import { uploadDir } from "../../../utils/UploadDir";

export default class ImageController {
    static async show(
        req: FastifyRequest<{
            Params: {
                filename: string
            }
        }>,
        reply: FastifyReply,
    ) {
        const { filename } = req.params;
        
        // Check if file exists
        const filePath = path.join(uploadDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return reply.code(404).send({ error: 'Image not found' });
        }
        
        // Determine content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };
        
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        // Stream the file
        return reply
            .code(200)
            .header('Content-Type', contentType)
            .send(fs.createReadStream(filePath));
    }
}