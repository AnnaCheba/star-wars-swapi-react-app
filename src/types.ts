export interface FilmData {
    title: string;
}

export type PersonData = {
    birth_year: string;
    films: string[];
    gender: string;
    height: string;
    mass: string;
    name: string;
    filmsData: FilmData[];
};
