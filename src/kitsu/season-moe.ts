import axios from "axios";
import json5 from "json5";
import { Seasons } from "../utils";
import {
    ISeasonMoeDataFile,
    ISeasonMoeDataFileDataItemDailyUpdate,
} from "./model";

export const getSeasonMoeDataURL = (year: number, season: Seasons) =>
    `https://cdn.jsdelivr.net/gh/wopian/kitsu-season-trends@master/data/${year}-${Seasons[season]}.json5`;

const ISeasonMoeDataFileDataItemDailyUpdateKeys = [
    "w",
    "l",
    "p",
    "o",
    "r",
    "u",
    "f",
] as (keyof ISeasonMoeDataFileDataItemDailyUpdate)[];

export const fetchSeasonMoe = async (
    year: number,
    season: Seasons
): Promise<ISeasonMoeDataFile> => {
    const url = getSeasonMoeDataURL(year, season);
    const resp = await axios.get<string>(url);
    const parsed: ISeasonMoeDataFile = json5.parse(resp.data);
    parsed.data.forEach((_, i) => {
        parsed.data[i].d.forEach((_, j) => {
            ISeasonMoeDataFileDataItemDailyUpdateKeys.forEach((x) => {
                parsed.data[i].d[j][x] = parsed.data[i].d[j][x] ?? 0;
            });
        });
    });
    return parsed as ISeasonMoeDataFile;
};

// Source: https://github.com/wopian/kitsu-season-trends/blob/master/src/util/index.js
export const sortSeasonMoeData = (
    data: ISeasonMoeDataFile,
    by: keyof ISeasonMoeDataFileDataItemDailyUpdate
) => {
    return Object.values(data.data).sort((A, B) => {
        let a = null,
            b = null;

        if (by === "r") {
            a = A.d.slice(-1)[0][by] / A.d.slice(-1)[0].u;
            b = B.d.slice(-1)[0][by] / B.d.slice(-1)[0].u;
        } else {
            a = A.d.slice(-1)[0][by];
            b = B.d.slice(-1)[0][by];
        }

        return a > b ? -1 : a < b ? 1 : 0;
    });
};
