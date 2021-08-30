import { Router } from 'express';

import { ResetUserPasswordController } from '@modules/accounts/useCases/resetUserPassword/ResetUserPasswordController';
import { SendForgotPasswordMailController } from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController';

const passwordRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetUserPasswordController = new ResetUserPasswordController();

passwordRoutes.post('/forgot', sendForgotPasswordMailController.handle);
passwordRoutes.post('/reset', resetUserPasswordController.handle);

export { passwordRoutes };
