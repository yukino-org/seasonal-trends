import axios from "axios";
import { ISeasonMoeDataFileDataItem } from "./model";

export const getKitsuAnimeURLFromID = (id: number) =>
    `https://kitsu.io/api/edge/anime?filter[id]=${id}`;

export type IKitsuAnime = Record<any, any>;

const kitsuAnimeCache: Record<number, IKitsuAnime> = {};
export const transpileSeasonMoeDataFileDataItem = async (
    item: ISeasonMoeDataFileDataItem
): Promise<IKitsuAnime> => {
    const id = item.i;
    return (kitsuAnimeCache[id] =
        kitsuAnimeCache[id] ?? (await _fetchKitsuAnimeFromID(id)));
};

const _fetchKitsuAnimeFromID = async (id: number): Promise<IKitsuAnime> => {
    const url = getKitsuAnimeURLFromID(id);
    const {
        data: {
            meta: { count },
            data: [data],
        },
    } = await axios.get(url, {
        responseType: "json",
    });
    if (count !== 1) {
        throw new Error(`Invalid Kitsu Anime ID: ${id}`);
    }
    return data;
};
