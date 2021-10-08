import { container } from 'tsyringe';

import { IDateProvider } from './IDateProvider';
import { DayJsDateProvider } from './implementations/DayJsDateProvider';

container.registerSingleton<IDateProvider>('DayJsDateProvider', DayJsDateProvider)