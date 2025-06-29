// src/article/ArticleCollection.ts

import { Collection, ObjectId, Document } from 'mongodb'; // Importamos 'Document' en lugar de 'WithId'
import { MongoClient as MongoConnection } from '../data-collection/mongo/mongo-client'; // Verifica tu ruta
import { IArticle } from './article.interface'; // Verifica tu ruta

export class ArticleCollection {
    // Método para obtener la colección. La tipamos con <IArticle> para que las operaciones
    // de la colección (findOne, find, etc.) ya devuelvan el tipo correcto IArticle.
    private collection(): Collection<IArticle> { 
        // MongoClient.getInstance().db().collection<IArticle>('articles') asegura que el tipo es IArticle
        return MongoConnection.getInstance().db().collection<IArticle>('articles');
    }

    // --- FUNCIONES CRUD ---

    public async create(articleData: Omit<IArticle, '_id' | 'createdAt' | 'updatedAt'>): Promise<IArticle> {
        const now = new Date();
        const documentToInsert = {
            ...articleData,
            createdAt: now,
            updatedAt: now,
        } as IArticle; // Aseguramos el tipo antes de insertar

        const result = await this.collection().insertOne(documentToInsert);

        // Ya que la colección está tipada como <IArticle>, findById devolverá IArticle | null
        const insertedArticle = await this.findById(result.insertedId.toHexString());
        if (!insertedArticle) {
            throw new Error('Error al recuperar el artículo insertado después de la creación.');
        }
        return insertedArticle;
    }

    public async findAll(): Promise<IArticle[]> {
        try {
            // .toArray() sobre una Collection<IArticle> ya devuelve IArticle[]
            return await this.collection().find({}).toArray();
        } catch (error) {
            console.error('Error al obtener todos los artículos:', error);
            return [];
        }
    }

    public async findById(id: string): Promise<IArticle | null> {
        try {
            const objectId = new ObjectId(id);
            // findOne sobre una Collection<IArticle> ya devuelve IArticle | null
            return await this.collection().findOne({ _id: objectId });
        } catch (error) {
            console.error('Error al buscar artículo por ID:', error);
            return null;
        }
    }

    // --- FUNCIÓN update con tipado robusto y compatible ---
    public async update(id: string, updateData: Partial<Omit<IArticle, '_id' | 'createdAt'>>): Promise<IArticle | null> {
        try {
            const objectId = new ObjectId(id);
            const now = new Date();

            // findOneAndUpdate devuelve un objeto que contiene 'value' (el documento actualizado)
            // o null si no se encontró. Tipamos el 'result' de forma genérica como 'any'
            // para evitar problemas con versiones específicas de '@types/mongodb',
            // y luego comprobamos y casteamos 'result.value' de forma segura.
            const result: any = await this.collection().findOneAndUpdate(
                { _id: objectId },
                { $set: { ...updateData, updatedAt: now } },
                { returnDocument: 'after' } 
            );

            // Verificamos si 'result' existe y si 'result.value' contiene un documento.
            // Si 'value' es null (porque no se encontró el _id), el 'if' no se cumple.
            if (result && result.value) { 
                return result.value as IArticle; // Casteamos a IArticle
            } else {
                return null; // Si no se encontró o actualizó el documento, devuelve null.
            }

        } catch (error) {
            console.error('Error al actualizar artículo:', error);
            return null;
        }
    }

    // --- FUNCIÓN delete ---
    public async delete(id: string): Promise<boolean> {
        try {
            const objectId = new ObjectId(id);
            const result = await this.collection().deleteOne({ _id: objectId });
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error al eliminar artículo:', error);
            return false;
        }
    }

    // --- Funciones de validación (mantienen la advertencia pendiente de implementación real) ---
    public async authorExists(authorId: string | ObjectId): Promise<boolean> {
        console.warn(`[VALIDACIÓN PENDIENTE] Verificar existencia de autor con ID: ${authorId}`);
        return true; 
    }

    public async volumeExists(volumeId: string | ObjectId): Promise<boolean> {
        console.warn(`[VALIDACIÓN PENDIENTE] Verificar existencia de volumen con ID: ${volumeId}`);
        return true;
    }
}