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

  async get() {
    return await this.client
      .db()
      .collection("indexes")
      .find()
      .sort({ position: 1 })
      .toArray();
  }

  async getById(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("indexes")
      .findOne({ _id: new ObjectId(id) });
  }

  async post(body: Indexes) {
    const { title, description, articles, position, visible } = body;

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

  async put(body: Partial<Indexes> & { id: string }) {
    const { id, articles, ...rest } = body;

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

  async delete(body: { id: string }) {
    const { id } = body;

    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("indexes")
      .deleteOne({ _id: new ObjectId(id) });
  }
}

export { IndexModel };
