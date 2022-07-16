export interface ISeasonMoeDataFile {
    data: ISeasonMoeDataFileDataItem[];
    meta: {
        current: number; // Total started airing this season
        total: number; // Total shows being tracked
    };
    updated: string; // ISO date of the last cron update
}

export interface ISeasonMoeDataFileDataItem {
    /** Kitsu Anime ID */
    i: number;
    /** Canonical title */
    t: string;
    /** Subtype (0: TV, 1: ONA) */
    u: number;
    /** 0: Leftover, 1: New */
    n: number;
    /** Data array containing each daily update */
    d: ISeasonMoeDataFileDataItemDailyUpdate[];
}

export interface ISeasonMoeDataFileDataItemDailyUpdate {
    /** Index */
    i: number;
    /** Hours since epoch (x3600000 to get datetime) */
    d: number;
    /** Wilson's confidence level (0.95) out of 100 (omitted if 0) */
    w: number;
    /** Laplace smoothing out of 100 (omitted if 0) */
    l: number;
    /** Upvotes, ratings >= 3 out of 5, omitted if 0) */
    p: number;
    /** Downvotes, ratings < 3 out of 5, omitted if 0) */
    o: number;
    /** Users Rated (omitted if 0) */
    r: number;
    /** Users (omitted if 0) */
    u: number;
    /** Users Favourited (omitted if 0) */
    f: number;
}
