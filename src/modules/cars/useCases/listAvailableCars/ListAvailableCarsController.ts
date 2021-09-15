import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { brand, category_id } = request.query;

    const [name] = String(request.query.name).split(',');

    const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase);

    const cars = await listAvailableCarsUseCase.execute({
      name,
      brand: brand as string,
      category_id: category_id as string,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
