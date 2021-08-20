import { container } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider';

container.registerSingleton<IDateProvider>('DayJsDateProvider', DayJsDateProvider);
