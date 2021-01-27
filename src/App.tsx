import React, { useState, useEffect } from 'react';
import './App.css';
const axios = require('axios').default;

type PersonData = {
    birth_year: string;
    films: string[];
    gender: string;
    height: string;
    mass: string;
    name: string;
};

type People = PersonData[];

const App = () => {
    const [peopleList, setPeopleList] = useState<People>([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [active, setActive] = useState<number>(0);
    const [filmList, setFilmList] = useState<string[]>([]);

    useEffect(() => {
        // Make a request for a people list
        axios
            .get('https://swapi.dev/api/people/')
            .then(function (response: any) {
                // handle success

                const peopleResult = response.data.results;
                const nextUrl = response.data.next;
                const prevUrl = response.data.previous;
                setPeopleList(peopleResult);
                setNext(nextUrl);
                setPrev(prevUrl);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
            });

        return () => {};
    }, []);

    const showDetails = (e: any) => {
        setActive(e.currentTarget.attributes['data-index'].value);
    };

    const getFilm = (filmUrl: string) => {
        // Make a request for a film list
        return axios
            .get(filmUrl)
            .then(function (response: any) {
                // handle success
                return response.data;
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
            });
    };

    useEffect(() => {
        if (peopleList.length > 0) {
            const getFilms = (films: string[]) => {
                const filmsPromiseArray = films.map((film, i) => {
                    return getFilm(films[i]);
                });

                Promise.all(filmsPromiseArray).then((values) => {
                    setFilmList(values);
                });
            };

            getFilms(peopleList[active]?.films);
        }
    }, [active, peopleList]);

    const onClickNext = () => {
        // Make a request for a people list on Next
        axios
            .get(next)
            .then(function (response: any) {
                // handle success

                const peopleResult = response.data.results;
                const nextUrl = response.data.next;
                const prevUrl = response.data.previous;
                setPeopleList(peopleResult);
                setNext(nextUrl);
                setPrev(prevUrl);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
            });
    };

    const onClickPrev = () => {
        // Make a request for a people list on Prev
        axios
            .get(prev)
            .then(function (response: any) {
                // handle success

                const peopleResult = response.data.results;
                const nextUrl = response.data.next;
                const prevUrl = response.data.previous;
                setPeopleList(peopleResult);
                setNext(nextUrl);
                setPrev(prevUrl);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
            });
    };

    const filmsListString = filmList
        ?.map((film: any) => {
            return film.title;
        })
        .join(', ');

    return (
        <div className='App'>
            <h1>Table with list of people</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Heigth</th>
                        <th>Mass</th>
                    </tr>
                </thead>
                <tbody>
                    {peopleList.map((people, index) => {
                        return (
                            <tr
                                key={people.name}
                                data-index={index}
                                onClick={showDetails}
                            >
                                <td>{people.name}</td>
                                <td>{people.height}</td>
                                <td>{people.mass}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='pagination'>
                Pagination:
                <button
                    disabled={prev === null}
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
            <div className='details'>
                <h2>Detail section</h2>
                <dl>
                    <dt>Name:</dt>
                    <dd>{peopleList[active]?.name}</dd>

                    <dt>Birth year:</dt>
                    <dd>{peopleList[active]?.birth_year}</dd>

                    <dt>Gender:</dt>
                    <dd>{peopleList[active]?.gender}</dd>

                    <dt>List of films:</dt>
                    <dd>{filmsListString}</dd>
                </dl>
            </div>
        </div>
    );
};

export default App;
