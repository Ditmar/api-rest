import { Request, Response } from 'express';
import { HttpStatus } from '../utils/httpStatus';
import { ObjectId } from 'mongodb';
import MongoConnection from '../db';

const db = () => MongoConnection.getClient().db();

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

const userController = {
  async get(req: Request, res: Response) {
    const indexes = await db().collection('indexes').find().sort({ position: 1 }).toArray();
    res.status(HttpStatus.OK).json({ message: 'Datos obtenidos correctamente', data: indexes });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'ID inválido' });
    }

    try {
      const index = await db().collection('indexes').findOne({ _id: new ObjectId(id) });
      if (!index) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Índice no encontrado' });
      }
      res.status(HttpStatus.OK).json({ message: 'Índice encontrado', data: index });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error interno del servidor', error: (error as Error).message });
    }
  },

  async post(req: Request, res: Response) {
    try {
      const { title, description, articles, position, visible } = req.body;

      if (!Array.isArray(articles)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "'articles' debe ser un arreglo" });
      }

      for (const id of articles) {
        if (!isValidObjectId(id)) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: `ID inválido en articles: ${id}` });
        }
      }

      if (articles.length > 0) {
        const objectIds = articles.map((id: string) => new ObjectId(id));
        const validArticles = await db().collection('articles').find({
          _id: { $in: objectIds }
        }).toArray();

        if (validArticles.length !== articles.length) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Algunos artículos no existen' });
        }
      }

      const result = await db().collection('indexes').insertOne({
        title,
        description,
        articles: articles.map((id: string) => new ObjectId(id)),
        position,
        visible
      });

      res.status(HttpStatus.CREATED).json({ message: 'Registro de datos exitoso', data: result });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al registrar datos', error: error.message });
    }
  },

  async put(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'ID inválido' });
    }

    const update = req.body;

    try {
      if (update.articles) {
        if (!Array.isArray(update.articles)) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: "'articles' debe ser un arreglo" });
        }

        for (const artId of update.articles) {
          if (!isValidObjectId(artId)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: `ID inválido en articles: ${artId}` });
          }
        }

        if (update.articles.length > 0) {
          const objectIds = update.articles.map((id: string) => new ObjectId(id));
          const validArticles = await db().collection('articles').find({
            _id: { $in: objectIds }
          }).toArray();

          if (validArticles.length !== update.articles.length) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Algunos artículos no existen' });
          }
          update.articles = objectIds;
        } else {
          update.articles = [];
        }
      }

      const result = await db().collection('indexes').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

      if (result.matchedCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Índice no encontrado para actualizar' });
      }

      res.status(HttpStatus.OK).json({ message: 'Actualización exitosa', data: result });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar', error: err.message });
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'ID inválido' });
    }

    try {
      const result = await db().collection('indexes').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Índice no encontrado para eliminar' });
      }
      res.status(HttpStatus.OK).json({ message: 'Eliminación exitosa' });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar el índice' });
    }
  },

  async createArticle(req: Request, res: Response) {
    try {
      const { title } = req.body;

      if (!title || typeof title !== 'string') {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "'title' es requerido y debe ser texto" });
      }

      const result = await db().collection('articles').insertOne({ title });

      res.status(HttpStatus.CREATED).json({ message: 'Artículo creado exitosamente', data: result });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear artículo', error: error.message });
    }
  }
};

export { userController };
