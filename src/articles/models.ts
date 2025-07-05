import { BaseCollection } from "../data-collection/base-collection/baseCollection";
import { MongoClient } from "../data-collection/mongo/mongo-client";
import { ObjectId } from "mongodb";

interface Article {
  id?: string;
  title: string;
  abstract: string;
  authors: string[]; 
  volume_id: string; 
  year: number;
  pdf_uri: string;
  images: string[]; 
}

class ArticleModel extends BaseCollection {
  client;

  constructor() {
    super(); 
    this.client = MongoClient.getInstance();
  }

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  async get() {
    return await this.client
      .db()
      .collection("articles")
      .find()
      .toArray();
  }

  async getById(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("articles")
      .findOne({ _id: new ObjectId(id) });
  }

  async post(body: Article) {
    const { title, abstract, authors, volume_id, year, pdf_uri, images } = body;

    if (!Array.isArray(authors) || !authors.every(this.isValidObjectId)) {
      throw new Error("Authors must be an array of valid ObjectId strings");
    }
    const authorObjectIds = authors.map(id => new ObjectId(id));

    const authorsFound = await this.client
      .db()
      .collection("authors") 
      .find({ _id: { $in: authorObjectIds } })
      .toArray();

    if (authorsFound.length !== authorObjectIds.length) {
      throw new Error("Some author IDs do not exist");
    }

    if (!this.isValidObjectId(volume_id)) {
      throw new Error("Invalid Volume ID format");
    }
    const volumeObjectId = new ObjectId(volume_id);

    const volumeExists = await this.client
      .db()
      .collection("volumes") 
      .findOne({ _id: volumeObjectId });
    if (!volumeExists) {
      throw new Error("Volume ID does not exist");
    }

    if (!this.isValidUrl(pdf_uri)) {
      throw new Error("Invalid PDF URI format");
    }

    if (!Array.isArray(images) || !images.every(this.isValidUrl)) {
      throw new Error("Images must be an array of valid URLs");
    }

    return await this.client.db().collection("articles").insertOne({
      title,
      abstract,
      authors: authorObjectIds,
      volume_id: volumeObjectId, 
      year,
      pdf_uri,
      images,
    });
  }

  async postArticle(body: unknown): Promise<unknown> {

    return this.post(body as Article);
  }

  async put(body: Partial<Article> & { id: string }) {
    const { id, authors, pdf_uri, images, volume_id, ...rest } = body; 

    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    const updateFields: Record<string, unknown> = { ...rest };

    if (authors) {
      if (!Array.isArray(authors) || !authors.every(this.isValidObjectId)) {
        throw new Error("Authors must be an array of valid ObjectId strings");
      }
      const authorObjectIds = authors.map(id => new ObjectId(id)); 

      const authorsFound = await this.client
        .db()
        .collection("authors") 
        .find({ _id: { $in: authorObjectIds } })
        .toArray();

      if (authorsFound.length !== authorObjectIds.length) {
        throw new Error("Some author IDs do not exist"); 
      }
      updateFields.authors = authorObjectIds; 
    }

    if (pdf_uri) {
      if (!this.isValidUrl(pdf_uri)) {
        throw new Error("Invalid PDF URI format");
      }
      updateFields.pdf_uri = pdf_uri;
    }

    if (images) {
      if (!Array.isArray(images) || !images.every(this.isValidUrl)) {
        throw new Error("Images must be an array of valid URLs");
      }
      updateFields.images = images;
    }

    if (volume_id !== undefined) { 
      if (!this.isValidObjectId(volume_id)) { 
        throw new Error("Invalid Volume ID format");
      }
      const volumeObjectId = new ObjectId(volume_id); 

      const volumeExists = await this.client
        .db()
        .collection("volumes")
        .findOne({ _id: volumeObjectId }); 
      if (!volumeExists) {
        throw new Error("Volume ID does not exist");
      }
      updateFields.volume_id = volumeObjectId; 
    }

    return await this.client
      .db()
      .collection("articles")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
  }

  async delete(body: { id: string }) {
    const { id } = body;

    if (!this.isValidObjectId(id)) {
      throw new Error("Invalid ID format");
    }

    return await this.client
      .db()
      .collection("articles")
      .deleteOne({ _id: new ObjectId(id) });
  }
}

export { ArticleModel };
