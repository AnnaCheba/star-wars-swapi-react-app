import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { People } from './People';
import { store } from './../../app/store';

test('renders People component', () => {
    //TODO: Can be added more tests
    const { getByText } = render(
        <Provider store={store}>
            <People />
        </Provider>
    );

    expect(getByText(/Name/i)).toBeInTheDocument();
});
