import { BibliographyService, IBibliography } from '../services/bibliography.service';
import { Request, Response } from 'express';

export class BibliographyController {
    private bibliographyService: BibliographyService;

    constructor() {
        this.bibliographyService = new BibliographyService();
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const bibliographies = await this.bibliographyService.get();
            res.json(bibliographies);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }

    }

    async post(req: Request, res: Response): Promise<void> {
        const body: IBibliography = req.body;
        try {
            const result = await this.bibliographyService.post(body);
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
            const result = await this.bibliographyService.delete({ _id: id });
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
        const body: Partial<Omit<IBibliography, '_id'>> = req.body;
        
        try {
            const result = await this.bibliographyService.put(body, id);
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
            const bibliography = await this.bibliographyService.getById(id);
            if (!bibliography) {
                res.status(404).json({ message: 'Bibliography not found' });
                return;
            }
            res.json(bibliography);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}