import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getPeopleData,
    selectPeople,
    selectNext,
    selectPrev,
    getFilmsData,
} from './peopleSlice';
import { RootState } from './../../app/store';
import { PersonData, FilmData } from './../../types';
import './People.css';

export const People = () => {
    const dispatch = useDispatch();

    const [active, setActive] = useState<number>();
    const [showDetail, setShowDetail] = useState(false);
    const results = useSelector(selectPeople);
    const next = useSelector(selectNext);
    const previous = useSelector(selectPrev);
    const filmsTitles = useSelector(
        (state: RootState) =>
            active &&
            state.people.results[active].filmsData
                ?.map((film: FilmData) => {
                    return film.title;
                })
                .join(', ')
    );

    useEffect(() => {
        // Make a request for a people list
        dispatch(getPeopleData('https://swapi.dev/api/people/'));
    }, [dispatch]);

    const showDetails = (e: React.MouseEvent<HTMLTableRowElement>) => {
        const selectedIndex = Number((e.currentTarget as any).attributes['data-index'].value);

        setActive(selectedIndex);
        dispatch(getFilmsData(results[selectedIndex]?.films, selectedIndex));
        setShowDetail(true);
    };

    const onClickNext = () => {
        // Make a request for a people list on Next
        next && dispatch(getPeopleData(next));
        setActive(undefined);
        setShowDetail(false);
    };

    const onClickPrev = () => {
        // Make a request for a people list on Prev
        previous && dispatch(getPeopleData(previous));
        setActive(undefined);
        setShowDetail(false);
    };

    return (
        <>
            <table className='people-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Heigth</th>
                        <th>Mass</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((people: PersonData, index: number) => {
                        return (
                            <tr
                                key={people.name}
                                data-index={index}
                                onClick={showDetails}
                                className={`people-row${
                                    active && index === active
                                        ? ' active'
                                        : ''
                                }`}
                            >
                                <td>{people.name}</td>
                                <td>{people.height}</td>
                                <td>{people.mass}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {/* Pagination section: could be extracted in a separate component in case of reuse */}
            <div className='pagination'>
                Pagination:
                <button
                    disabled={previous === null}
                    onClick={onClickPrev}
                    type='button'
                >
                    &lt; Prev
                </button>
                <button
                    disabled={next === null}
                    onClick={onClickNext}
                    type='button'
                >
                    Next &gt;
                </button>
            </div>

            {/* Details section: could be extracted in a separate component in case of reuse */}
            {showDetail && (
                <div className='details'>
                    <h2>Detail section</h2>
                    <dl>
                        <dt><b>Name:</b></dt>
                        <dd>{active && results[active]?.name}</dd>

                        <dt><b>Birth year:</b></dt>
                        <dd>{active && results[active]?.birth_year}</dd>

                        <dt><b>Gender:</b></dt>
                        <dd>{active && results[active]?.gender}</dd>

                        <dt><b>List of films:</b></dt>
                        <dd>{filmsTitles}</dd>
                    </dl>
                </div>
            )}
        </>
    );
};
