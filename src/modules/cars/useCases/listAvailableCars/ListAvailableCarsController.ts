import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, brand, category_id } = request.query;

    const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase);

    const cars = await listAvailableCarsUseCase.execute({
      name: name as string,
      brand: brand as string,
      category_id: category_id as string,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
