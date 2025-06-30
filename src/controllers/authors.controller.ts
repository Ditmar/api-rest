import { AuthorsService, IAuthors } from '../services/authors.service';
import { Request, Response } from 'express';

export class AuthorsController {
    private authorsService: AuthorsService;

    constructor() {
        this.authorsService = new AuthorsService();
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const authors = await this.authorsService.get();
            res.json(authors);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }

    }

    async post(req: Request, res: Response): Promise<void> {
        const body: IAuthors = req.body;
        try {
            const result = await this.authorsService.post(body);
            res.status(201).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const result = await this.authorsService.delete({ _id: id });
            res.status(204).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async put(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID is required' });
            return;
        }
        const body: Partial<Omit<IAuthors, '_id'>> = req.body;
        try {
            const result = await this.authorsService.put(body, id);
            res.status(204).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const author = await this.authorsService.getById(id);
            if (!author) {
                res.status(404).json({ message: 'Author not found' });
                return;
            }
            res.json(author);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}