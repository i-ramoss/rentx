import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, brand, category_id } = request.query;

    const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase);

    const cars = listAvailableCarsUseCase.execute({
      name: name as string, // força a tipagem do parâmetro
      brand: brand as string, // força a tipagem do parâmetro
      category_id: category_id as string, // força a tipagem do parâmetro
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
