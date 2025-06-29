// src/article/article.routes.ts

import { Router } from 'express';
import { ArticleController } from './articleController'; // Importa el controlador

const router = Router();

// GET /articles - Listar todos los artículos
router.get('/', ArticleController.getAllArticles);

// GET /articles/:id - Obtener un artículo específico
router.get('/:id', ArticleController.getArticleById);

// POST /articles - Crear un nuevo artículo
router.post('/', ArticleController.createArticle);

// PUT /articles/:id - Actualizar un artículo
router.put('/:id', ArticleController.updateArticle); // Mantenemos esta ruta para PUT explícito

// DELETE /articles/:id - Eliminar un artículo
router.delete('/:id', ArticleController.deleteArticle);

export default router;