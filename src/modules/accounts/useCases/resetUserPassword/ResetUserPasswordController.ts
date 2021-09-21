import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetUserPasswordUseCase } from './ResetUserPasswordUseCase';

class ResetUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password, date_now } = request.body;

    const resetUserPasswordUseCase = container.resolve(ResetUserPasswordUseCase);

    await resetUserPasswordUseCase.execute({ token: String(token), password, date_now });

    return response.send();
  }
}

export { ResetUserPasswordController };
