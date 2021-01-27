import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { PersonData, FilmData } from '../../types';
import axios, { AxiosResponse } from 'axios';

interface PeopleState {
    count: number;
    next: string | null;
    previous: string | null;
    results: PersonData[];
    films: string[];
}

const initialState: PeopleState = {
    count: 1,
    next: null,
    previous: null,
    results: [
        {
            birth_year: '1988',
            films: [],
            filmsData: [],
            gender: 'female',
            height: '168',
            mass: '60',
            name: 'Anna',
        },
    ],
    films: [],
};

export const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {
        getPeople: (state, action: PayloadAction<PeopleState>) => {
            const { count, next, previous, results } = action.payload;
            state.previous = previous;
            state.next = next;
            state.results = results;
            state.count = count;
        },
        setFilms: (
            state,
            action: PayloadAction<{
                films: FilmData[];
                selectedPersonIndex: number;
            }>
        ) => {
            const { films, selectedPersonIndex } = action.payload;
            state.results[selectedPersonIndex].filmsData = films;
        },
    },
});

export const { getPeople, setFilms } = peopleSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(getPeopleData())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getPeopleData = (url: string): AppThunk => (dispatch) => {
    // Make a request for a people list
    axios
        .get(url)
        .then((response: AxiosResponse) => {
            // handle success
            dispatch(getPeople(response.data));
        })
        .catch((error: Error) => {
            // handle error
            console.log(error);
        });
};

export const getFilmsData = (
    filmsUrl: string[],
    selectedPersonIndex: number
): AppThunk => (dispatch) => {
    Promise.all(
        filmsUrl.map((film) => {
            // Make a request for a film data
            return axios
                .get(film)
                .then(function (response: AxiosResponse) {
                    // handle success
                    return response.data;
                })
                .catch(function (error: Error) {
                    // handle error
                    console.log(error);
                });
        })
    ).then((films) => {
        dispatch(setFilms({ films, selectedPersonIndex }));
    });
};

// selectors
export const selectPeople = (state: RootState) => state.people.results;
export const selectNext = (state: RootState) => state.people.next;
export const selectPrev = (state: RootState) => state.people.previous;
export const selectCount = (state: RootState) => state.people.count;

export default peopleSlice.reducer;
