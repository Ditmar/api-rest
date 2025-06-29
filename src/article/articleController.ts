// src/article/article.controller.ts

import { Request, Response } from 'express';
import { ArticleCollection } from './article.collection';
import { IArticle } from './article.interface';
import { ObjectId } from 'mongodb';

// Instancia de nuestra colección de artículos para interactuar con la DB
const articleCollection = new ArticleCollection();

export class ArticleController {
    // GET /articles - Listar todos los artículos
    public static async getAllArticles(req: Request, res: Response): Promise<void> {
        try {
            console.log('[Controller - getAllArticles] Recibida petición para obtener todos los artículos.'); // Log
            const articles = await articleCollection.findAll();
            console.log(`[Controller - getAllArticles] Se encontraron ${articles.length} artículos.`); // Log
            res.status(200).json(articles);
        } catch (error: any) {
            console.error('Error al obtener todos los artículos:', error);
            res.status(500).json({ message: 'Error interno del servidor al listar artículos', error: error.message });
        }
    }

    // GET /articles/:id - Obtener un artículo específico
    public static async getArticleById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        console.log(`[Controller - getArticleById] Recibida petición GET para ID: ${id}`); // Log
        if (!ObjectId.isValid(id)) {
            console.warn(`[Controller - getArticleById] ID de artículo inválido: ${id}`); // Log
            res.status(400).json({ message: 'ID de artículo inválido.' });
            return;
        }
        try {
            const article = await articleCollection.findById(id);
            if (!article) {
                console.log(`[Controller - getArticleById] Artículo con ID ${id} no encontrado.`); // Log
                res.status(404).json({ message: 'Artículo no encontrado.' });
                return;
            }
            console.log(`[Controller - getArticleById] Artículo con ID ${id} encontrado.`); // Log
            res.status(200).json(article);
        } catch (error: any) {
            console.error(`Error al obtener el artículo con ID ${id}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al obtener artículo', error: error.message });
        }
    }

    // POST /articles - Crear un nuevo artículo
    public static async createArticle(req: Request, res: Response): Promise<void> {
        const newArticleData: Omit<IArticle, '_id' | 'createdAt' | 'updatedAt'> = req.body;
        console.log(`[Controller - createArticle] Recibida petición POST para crear artículo. Datos:`, newArticleData); // Log

        // VALIDACIONES DE CRITERIOS DE ACEPTACIÓN
        if (!newArticleData.title || !newArticleData.abstract || !newArticleData.year) {
            console.warn('[Controller - createArticle] Faltan campos obligatorios: title, abstract o year.'); // Log
            res.status(400).json({ message: 'Los campos title, abstract y year son obligatorios.' });
            return;
        }
        if (!newArticleData.authors || !Array.isArray(newArticleData.authors) || newArticleData.authors.length === 0) {
            console.warn('[Controller - createArticle] El campo authors es obligatorio y debe ser un array no vacío.'); // Log
            res.status(400).json({ message: 'El campo authors es obligatorio y debe ser un array no vacío.' });
            return;
        }
        for (const authorId of newArticleData.authors) {
            if (typeof authorId !== 'string' || !ObjectId.isValid(authorId)) {
                console.warn(`[Controller - createArticle] ID de autor inválido: ${authorId}. Debe ser un ObjectId.`); // Log
                res.status(400).json({ message: `ID de autor inválido: ${authorId}. Debe ser un ObjectId.` });
                return;
            }
        }
        if (!newArticleData.volume_id) {
            console.warn('[Controller - createArticle] El campo volume_id es obligatorio.'); // Log
            res.status(400).json({ message: 'El campo volume_id es obligatorio.' });
            return;
        }
        if (typeof newArticleData.volume_id !== 'string' || !ObjectId.isValid(newArticleData.volume_id)) {
            console.warn(`[Controller - createArticle] ID de volumen inválido: ${newArticleData.volume_id}. Debe ser un ObjectId.`); // Log
            res.status(400).json({ message: `ID de volumen inválido: ${newArticleData.volume_id}. Debe ser un ObjectId.` });
            return;
        }
        if (newArticleData.pdf_url && !ArticleController.isValidUrl(newArticleData.pdf_url)) {
            console.warn('[Controller - createArticle] URL de PDF inválida.'); // Log
            res.status(400).json({ message: 'URL de PDF inválida.' });
            return;
        }
        if (newArticleData.images) {
            if (!Array.isArray(newArticleData.images)) {
                console.warn('[Controller - createArticle] El campo images debe ser un array de URLs.'); // Log
                res.status(400).json({ message: 'El campo images debe ser un array de URLs.' });
                return;
            }
            for (const imageUrl of newArticleData.images) {
                if (!ArticleController.isValidUrl(imageUrl)) {
                    console.warn(`[Controller - createArticle] URL de imagen inválida: ${imageUrl}.`); // Log
                    res.status(400).json({ message: `URL de imagen inválida: ${imageUrl}.` });
                    return;
                }
            }
        }

        try {
            const createdArticle = await articleCollection.create(newArticleData);
            console.log(`[Controller - createArticle] Artículo creado exitosamente con ID: ${createdArticle._id}`); // Log
            res.status(201).json(createdArticle);
        } catch (error: any) {
            console.error('Error al crear artículo:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear artículo', error: error.message });
        }
    }

    // PUT /articles/:id - Actualizar un artículo
    public static async updateArticle(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updateData: Partial<Omit<IArticle, '_id' | 'createdAt'>> = req.body;
        
        console.log(`[Controller - updateArticle] Recibida petición PUT para ID: ${id}`); // Log clave
        console.log(`[Controller - updateArticle] Datos a actualizar (req.body):`, updateData); // Log clave

        if (!ObjectId.isValid(id)) {
            console.warn(`[Controller - updateArticle] ID de artículo inválido: ${id}`); // Log
            res.status(400).json({ message: 'ID de artículo inválido.' });
            return;
        }

        // VALIDACIONES PARA ACTUALIZACIÓN (similares a CREATE, pero condicionales)
        // ... (tus validaciones existentes se mantienen) ...
        if (updateData.authors !== undefined) {
            if (!Array.isArray(updateData.authors) || updateData.authors.length === 0) {
              res.status(400).json({ message: 'Si se provee, authors debe ser un array no vacío.' });
              return;
            }
            for (const authorId of updateData.authors) {
              if (typeof authorId !== 'string' || !ObjectId.isValid(authorId)) {
                res.status(400).json({ message: `ID de autor inválido: ${authorId}. Debe ser un ObjectId.` });
                return;
              }
            }
        }
        if (updateData.volume_id !== undefined) {
            if (typeof updateData.volume_id !== 'string' || !ObjectId.isValid(updateData.volume_id)) {
              res.status(400).json({ message: `ID de volumen inválido: ${updateData.volume_id}. Debe ser un ObjectId.` });
              return;
            }
        }
        if (updateData.pdf_url && !ArticleController.isValidUrl(updateData.pdf_url)) {
            res.status(400).json({ message: 'URL de PDF inválida.' });
            return;
        }
        if (updateData.images !== undefined) {
            if (!Array.isArray(updateData.images)) {
              res.status(400).json({ message: 'El campo images debe ser un array de URLs.' });
              return;
            }
            for (const imageUrl of updateData.images) {
              if (!ArticleController.isValidUrl(imageUrl)) {
                res.status(400).json({ message: `URL de imagen inválida: ${imageUrl}.` });
                return;
              }
            }
        }

        try {
            console.log(`[Controller - updateArticle] Llamando a articleCollection.update con ID: ${id} y datos:`, updateData); // Log clave
            const updatedArticle = await articleCollection.update(id, updateData);
            
            if (!updatedArticle) {
                console.log(`[Controller - updateArticle] Artículo con ID ${id} no encontrado para actualizar (respuesta 404).`); // Log clave
                res.status(404).json({ message: 'Artículo no encontrado para actualizar.' });
                return;
            }
            console.log(`[Controller - updateArticle] Artículo con ID ${id} actualizado exitosamente.`); // Log clave
            res.status(200).json(updatedArticle);
        } catch (error: any) {
            console.error(`Error al actualizar el artículo con ID ${id}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al actualizar artículo', error: error.message });
        }
    }

    // DELETE /articles/:id - Eliminar un artículo
    public static async deleteArticle(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        console.log(`[Controller - deleteArticle] Recibida petición DELETE para ID: ${id}`); // Log
        if (!ObjectId.isValid(id)) {
            console.warn(`[Controller - deleteArticle] ID de artículo inválido: ${id}`); // Log
            res.status(400).json({ message: 'ID de artículo inválido.' });
            return;
        }
        try {
            const deleted = await articleCollection.delete(id);
            if (!deleted) {
                console.log(`[Controller - deleteArticle] Artículo con ID ${id} no encontrado para eliminar.`); // Log
                res.status(404).json({ message: 'Artículo no encontrado para eliminar.' });
                return;
            }
            console.log(`[Controller - deleteArticle] Artículo con ID ${id} eliminado exitosamente.`); // Log
            res.status(204).send(); // 204 No Content para eliminación exitosa sin cuerpo
        } catch (error: any) {
            console.error(`Error al eliminar el artículo con ID ${id}:`, error);
            res.status(500).json({ message: 'Error interno del servidor al eliminar artículo', error: error.message });
        }
    }

    // Método auxiliar para validar URLs
    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
}