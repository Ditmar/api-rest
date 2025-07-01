import { BaseCollection } from "../data-collection/base-collection/baseCollection";
import { MongoClient } from "../data-collection/mongo/mongo-client";
import { ObjectId } from "mongodb";

interface Indexes {
  id?: string;
  title: string;
  description: string;
  articles: string[];
  position: number;
  visible: boolean;
}

class IndexModel extends BaseCollection {
  client;

  constructor() {
    super();
    this.client = MongoClient.getInstance();
  }

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  async get(): Promise<unknown> {
    return await this.client
      .db()
      .collection("indexes")
      .find()
      .sort({ position: 1 })
      .toArray();
  }

  async getById(id: string): Promise<unknown> {
    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("indexes")
      .findOne({ _id: new ObjectId(id) });
  }

  async post(body: unknown): Promise<unknown> {
    const { title, description, articles, position, visible } = body as Indexes;

    if (!Array.isArray(articles) || !articles.every(this.isValidObjectId)) {
      throw new Error("Articles must be an array of valid ObjectId strings");
    }

    const objectIds = articles.map(id => new ObjectId(id));

    const found = await this.client
      .db()
      .collection("articles")
      .find({ _id: { $in: objectIds } })
      .toArray();

    if (found.length !== objectIds.length) {
      throw new Error("Some article IDs do not exist");
    }

    return await this.client.db().collection("indexes").insertOne({
      title,
      description,
      articles: objectIds,
      position,
      visible,
    });
  }

  async put(body: unknown): Promise<unknown> {
    const { id, articles, ...rest } = body as Partial<Indexes> & { id: string };

    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    const updateFields: Record<string, unknown> = { ...rest };

    if (articles) {
      if (!Array.isArray(articles) || !articles.every(this.isValidObjectId)) {
        throw new Error("Articles must be an array of valid ObjectId strings");
      }

      const objectIds = articles.map(id => new ObjectId(id));

      const found = await this.client
        .db()
        .collection("articles")
        .find({ _id: { $in: objectIds } })
        .toArray();

      if (found.length !== objectIds.length) {
        throw new Error("Some article IDs do not exist");
      }

      updateFields.articles = objectIds;
    }

    return await this.client
      .db()
      .collection("indexes")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
  }

  async delete(body: unknown): Promise<unknown> {
    const { id } = body as { id: string };

    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("indexes")
      .deleteOne({ _id: new ObjectId(id) });
  }

  async postArticle(_body: unknown): Promise<unknown> {
  void _body;
  throw new Error("Method not implemented in IndexModel");
}

}

export { IndexModel };
