import { Request, Response } from 'express';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

class ListCategoriesController {
  constructor(private listCategoriesUseCase: ListCategoriesUseCase) {}

  handle(request: Request, response: Response): Response {
    try {
      const all = this.listCategoriesUseCase.execute();

      return response.json(all);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}

export { ListCategoriesController };
