import fs from 'fs';

export const fileMethods = {
  deleteFile: async (filename: string): Promise<void> => {
    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }

    await fs.promises.unlink(filename);
  },
};
