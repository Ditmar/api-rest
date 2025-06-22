import { ObjectId } from 'mongodb';
import { BaseCollection } from '../base-collection/baseCollection';
import { MongoClient as MongoConnection } from './mongo-client'; 

export class IndexCollection extends BaseCollection {
  private collection() {
    return MongoConnection.getInstance().db().collection('indexes');
  }



  async postArticle(body: any) {
  const { title, content, author, tags } = body;

  return await MongoConnection.getInstance().db().collection('articles').insertOne({
    title,
    content,
    author,
    tags
  });
}





  async get() {
    return await this.collection().find().sort({ position: 1 }).toArray();
  }

  // MÉTODO AGREGADO para obtener un índice por id
  async getById(id: string) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  async post(body: any) {
    const { title, description, articles, position, visible } = body;
    const objectIds = articles.map((id: string) => new ObjectId(id));
    const articlesFound = await MongoConnection.getInstance().db().collection('articles').find({
      _id: { $in: objectIds }
    }).toArray();

    if (articlesFound.length !== articles.length) {
      throw new Error('Algunos artículos no existen');
    }

    return await this.collection().insertOne({
      title,
      description,
      articles: objectIds,
      position,
      visible
    });
  }

  async put(body: any) {
    const { id, ...updateData } = body;

    if (updateData.articles) {
      const objectIds = updateData.articles.map((id: string) => new ObjectId(id));
      const articlesFound = await MongoConnection.getInstance().db().collection('articles').find({
        _id: { $in: objectIds }
      }).toArray();

      if (articlesFound.length !== updateData.articles.length) {
        throw new Error('Algunos artículos no existen');
      }

      updateData.articles = objectIds;
    }

    return await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  async delete(body: any) {
    const { id } = body;
    return await this.collection().deleteOne({ _id: new ObjectId(id) });
  }
  
}

