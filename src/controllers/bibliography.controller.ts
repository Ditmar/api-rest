import { HttpStatus } from '../utils/httpStatus'
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
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }

    }

    async post(req: Request, res: Response): Promise<void> {
        const body: IBibliography = req.body;
        try {
            const result = await this.bibliographyService.post(body);
            res.status(HttpStatus.CREATED).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const result = await this.bibliographyService.delete({ _id: id });
            res.status(HttpStatus.NO_CONTENT).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    }

    async put(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: 'ID is required' });
            return;
        }
        const body: Partial<Omit<IBibliography, '_id'>> = req.body;

        try {
            const result = await this.bibliographyService.put(body, id);
            res.status(HttpStatus.OK).json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const bibliography = await this.bibliographyService.getById(id);
            if (!bibliography) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Bibliography not found' });
                return;
            }
            res.json(bibliography);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    }
}