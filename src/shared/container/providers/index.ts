import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import { LocalStorageProvider } from './StorageProvider/implementations/LocalStorageProvider';
import { IStorageProvider } from './StorageProvider/IStorageProvider';

container.registerSingleton<IDateProvider>('DayJsDateProvider', DayJsDateProvider);

container.registerInstance<IMailProvider>('EtherealMailProvider', new EtherealMailProvider());

container.registerSingleton<IStorageProvider>('StorageProvider', LocalStorageProvider);
