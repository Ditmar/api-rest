import { BaseCollection } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client';
import { ObjectId } from 'mongodb';

class Mongo extends BaseCollection {
  client;

  constructor() {
    super();
    this.client = MongoClient.getInstance();
  }


  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }


  async get(): Promise<unknown> {
    return await this.client.db().collection('users').find().sort({ position: 1 }).toArray();
  }


  async getById(id: string): Promise<unknown> {
    if (!this.isValidObjectId(id)) {
      throw new Error('ID inválido');
    }

    return await this.client.db().collection('users').findOne({ _id: new ObjectId(id) });
  }

 
  async post(body: any): Promise<unknown> {
    const { title, description, articles, position, visible } = body;

    const objectIds = Array.isArray(articles)
      ? articles.filter(this.isValidObjectId).map((id: string) => new ObjectId(id))
      : [];

    if (objectIds.length !== (articles?.length || 0)) {
      throw new Error('Uno o más artículos tienen un ID inválido');
    }

    if (objectIds.length > 0) {
      const articlesFound = await this.client.db().collection('articles').find({
        _id: { $in: objectIds }
      }).toArray();

      if (articlesFound.length !== objectIds.length) {
        throw new Error('Algunos artículos no existen');
      }
    }

    return await this.client.db().collection('users').insertOne({
      title,
      description,
      articles: objectIds,
      position,
      visible
    });
  }


  async put(body: any): Promise<unknown> {
    const { id, ...updateData } = body;

    if (!this.isValidObjectId(id)) {
      throw new Error('ID inválido');
    }

    if (updateData.articles) {
      const objectIds = updateData.articles
        .filter(this.isValidObjectId)
        .map((id: string) => new ObjectId(id));

      if (objectIds.length !== updateData.articles.length) {
        throw new Error('Uno o más artículos tienen un ID inválido');
      }

      const articlesFound = await this.client.db().collection('articles').find({
        _id: { $in: objectIds }
      }).toArray();

      if (articlesFound.length !== objectIds.length) {
        throw new Error('Algunos artículos no existen');
      }

      updateData.articles = objectIds;
    }

    return await this.client.db().collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

 
  async delete(body: any): Promise<unknown> {
    const { id } = body;

    if (!this.isValidObjectId(id)) {
      throw new Error('ID inválido');
    }

    return await this.client.db().collection('users').deleteOne({ _id: new ObjectId(id) });
  }


  async postArticle(body: any): Promise<unknown> {
    const { title, content, author, tags } = body;

    return await this.client.db().collection('articles').insertOne({
      title,
      content,
      author,
      tags
    });
  }
}

export { Mongo };
