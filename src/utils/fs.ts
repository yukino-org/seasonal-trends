import { constants as fsConstants } from "fs";
import fs from "fs/promises";

export const recreateDir = async (dir: string) => {
    if (await pathExists(dir)) {
        await fs.rm(dir, {
            recursive: true,
        });
    }

    await fs.mkdir(dir, {
        recursive: true,
    });
};

export const pathExists = async (dir: string): Promise<boolean> => {
    try {
        await fs.access(dir, fsConstants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
};
