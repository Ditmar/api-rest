// src/article/article.interface.ts

import { ObjectId } from 'mongodb';

export interface IArticle {
    _id?: ObjectId; // Opcional porque MongoDB lo genera
    title: string;
    abstract: string;
    authors: (string | ObjectId)[]; // Puede ser string al recibirlo, luego convertir a ObjectId si es necesario
    volume_id: string | ObjectId; // Puede ser string al recibirlo, luego convertir a ObjectId si es necesario
    year: number;
    pdf_url?: string; // Opcional
    images?: string[]; // Array de URLs de imágenes, opcional
    createdAt?: Date; // Opcional, generado por el servidor
    updatedAt?: Date; // Opcional, generado por el servidor
}