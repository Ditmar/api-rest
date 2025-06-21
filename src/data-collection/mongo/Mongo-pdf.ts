import { MongoClient } from './mongo-client';
import { BaseCollectionPdf } from '../base-collection/baseCollection';
import { ObjectId } from 'mongodb';
import { ConfigSingleton } from '../../config/config';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class MongoPdf extends BaseCollectionPdf {
    private client;
    private uploadPath: string;

    constructor() {
        super();
        this.client = MongoClient.getInstance();

        this.uploadPath = path.resolve(__dirname, '..', '..', '..', 'uploads');
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async get(id: string): Promise<unknown> {
        const fileDoc = await this.client.db().collection('pdf_files').findOne({ 
            _id: new ObjectId(id) 
        });
        
        if (!fileDoc) {
            throw new Error('File not found');
        }

        const filePath = path.join(this.uploadPath, fileDoc.filename);
        return {
            buffer: fs.readFileSync(filePath),
            contentType: fileDoc.contentType,
            originalName: fileDoc.originalName
        };
    }

    async post(file: any): Promise<unknown> {
        if (file.mimeType !== 'application/pdf') {
            throw new Error('Only PDF files are allowed');
        }

        const maxSize = ConfigSingleton.getInstance().MAX_FILE_SIZE || 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
            throw new Error(`File size exceeds the limit of ${maxSize / 1024 / 1024} MB`);
        }

        const uniqueFilename = `${uuidv4()}${path.extname(file.originalName)}`;
        const filePath = path.join(this.uploadPath, uniqueFilename);

        fs.writeFileSync(filePath, file.buffer);

        const result = await this.client
            .db()
            .collection('pdf_files')
            .insertOne({
                filename: uniqueFilename,
                originalName: file.originalName,
                contentType: file.mimeType,
                size: file.size,
                uploadDate: new Date(),
                localPath: filePath,
                downloadUrl: `${ConfigSingleton.getInstance().BASE_URL}/files/${uniqueFilename}`
            });

        return {
            id: result.insertedId,
            downloadUrl: `${ConfigSingleton.getInstance().BASE_URL}/files/${result.insertedId}`
        };
    }

    async delete(id: string): Promise<unknown> {
        const fileDoc = await this.client.db().collection('pdf_files').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!fileDoc) {
            throw new Error('File not found');
        }

        const filePath = path.join(this.uploadPath, fileDoc.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.client.db().collection('pdf_files').deleteOne({ 
            _id: new ObjectId(id) 
        });

        return { message: 'File deleted successfully' };
    }

    async getDownloadUrl(id: string): Promise<string> {
        const fileDoc = await this.client.db().collection('pdf_files').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!fileDoc) {
            throw new Error('File not found');
        }

        return `${ConfigSingleton.getInstance().BASE_URL}/files/${id}`
    }
}

export { MongoPdf };