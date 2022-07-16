export enum Seasons {
    winter,
    spring,
    summer,
    autumn,
}

export const getSeasonFromDate = (date: Date): Seasons => {
    switch (date.getMonth()) {
        case 0:
        case 1:
        case 2:
            return Seasons.winter;

        case 3:
        case 4:
        case 5:
            return Seasons.spring;

        case 6:
        case 7:
        case 8:
            return Seasons.summer;

        case 9:
        case 10:
        case 11:
            return Seasons.autumn;

        default:
            throw Error();
    }
};
