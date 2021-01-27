import React from 'react';
import { People } from './features/people/People';
import './App.css';

const App = () => {
    return (
        <div className='App'>
            <h1>Table with list of people</h1>
            <People />
        </div>
    );
};

export default App;
