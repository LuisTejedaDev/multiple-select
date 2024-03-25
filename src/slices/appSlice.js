import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    keyboard: {
        visible: false,
        keyboardHeight: 0
    }
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setKeyboard: (state, action) => {state.keyboard = action.payload},
    }
})

export const {setKeyboard} = navSlice.actions

export const selectKeyboard = (state) => state.navApp.keyboard;

export default navSlice.reducer