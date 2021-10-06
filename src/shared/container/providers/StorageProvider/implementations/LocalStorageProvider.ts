import fs from 'fs';
import { resolve } from 'path';

import uploadConfig from '@config/upload';

import { IStorageProvider } from '../IStorageProvider';

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    // remove o que está dentro de tmp para a pasta recebida nos parâmetros do método
    // o primeiro parâmetro é onde está o arquivo, o caminho completo e o nome do arquivo
    // o segundo parâmetro é para onde o arquivo será enviado, além do nome do arquivo
    await fs.promises.rename(
      resolve(uploadConfig.tmpFolder, file),
      resolve(`${uploadConfig.tmpFolder}/${folder}`, file)
    );

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    // recupera o nome do arquivo dentro da pasta avatar ou cars, em tmpFolder
    const filename = resolve(`${uploadConfig.tmpFolder}/${folder}`, file);

    // verifica se o arquivo existe
    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }

    // se existir, é deletado
    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
