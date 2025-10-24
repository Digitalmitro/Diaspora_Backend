import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadFile = async (file) => {
    if (process.env.USE_S3 === 'true') {
        return { url: 's3://...', key: '...' };
    } else {
        const relativePath = `/uploads/${file.filename}`;
        const absolutePath = path.join(__dirname, '..', 'uploads', file.filename);
        return {
            url: relativePath,
            path: absolutePath,
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        };
    }
};

const deleteFile = async (filePath) => {
    if (process.env.USE_S3 === 'true') {
        return;
    } else {
        const absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(__dirname, '..', 'uploads', path.basename(filePath));

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    }
};

export {
    uploadFile,
    deleteFile
};
