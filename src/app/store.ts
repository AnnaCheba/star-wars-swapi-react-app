import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import peopleReducer from '../features/people/peopleSlice';

export const store = configureStore({
    reducer: {
        people: peopleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
