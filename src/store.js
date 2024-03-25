import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk'
import {appSlice} from './slices';

export const store = configureStore({
    reducer: {
        navApp: appSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
}, applyMiddleware(thunk))