import path from "path";
import fs from "fs/promises";
import {
    ISeasonMoeDataFileDataItemDailyUpdate,
    fetchSeasonMoe,
    sortSeasonMoeData,
    transpileSeasonMoeDataFileDataItem,
    ISeasonMoeDataFileDataItem,
    IKitsuAnime,
} from "./kitsu";
import { capitalize, getSeasonFromDate, recreateDir, Seasons } from "./utils";

const outputDir = path.join(__dirname, "../dist");

const start = async () => {
    const date = new Date();
    const season = getSeasonFromDate(date);
    const data = await fetchSeasonMoe(date.getFullYear(), season);

    const updatedAt = {
        source: new Date(data.updated).valueOf(),
        data: date.valueOf(),
    };
    const sortKeys: [string, keyof ISeasonMoeDataFileDataItemDailyUpdate][] = [
        ["wilson", "w"],
        ["laplace", "l"],
        ["upvotes", "p"],
        ["rated", "r"],
        ["users", "u"],
    ];
    const summary: string[] = [
        `# Trends of ${capitalize(Seasons[season])} ${date.getFullYear()}`,
        `> Last updated at ${date.toLocaleString()}`
    ];

    await recreateDir(outputDir);
    for (const [name, key] of sortKeys) {
        const sorted: ISeasonMoeDataFileDataItem[] = [];
        for (const x of sortSeasonMoeData(data, key)) {
            if (sorted.length === 10) break;

            const startedAt = Math.min(...x.d.map((x) => x.d)) * 3600000;
            const xSeason = getSeasonFromDate(new Date(startedAt));
            if (season === xSeason && x.n === 1 && x.u === 0) {
                sorted.push(x);
            }
        }

        const animes = await Promise.all(
            sorted.map(async (x, i) => {
                const transpiled = await transpileSeasonMoeDataFileDataItem(x);
                transpiled.index = i;
                return transpiled;
            })
        );

        await fs.writeFile(
            path.join(outputDir, `data-${name}.json`),
            JSON.stringify({
                season: Seasons[season],
                year: date.getFullYear(),
                data: animes,
                updatedAt,
            })
        );
        summary.push(getKitsuAnimeMd(name, animes));
    }

    await fs.writeFile(path.join(outputDir, "README.md"), summary.join("\n\n"));
};

start();

function getKitsuAnimeMd(name: string, animes: IKitsuAnime[]) {
    return `
## ${capitalize(name)}

${animes.map((x, i) => `${i + 1}. [${x.attributes.canonicalTitle}](https://kitsu.io/anime/${x.attributes.slug})`).join("\n")}
    `.trim();
}
