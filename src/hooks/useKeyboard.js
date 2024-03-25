import {useEffect} from "react";
import {Keyboard} from "react-native";
import {useDispatch} from "react-redux";
import {setKeyboard} from "../slices/appSlice";

export default () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', 
            (e) => dispatch(setKeyboard({
                visible: true,
                keyboardHeight: e.endCoordinates.height
            }))
        );
        
        const hideSubscription = Keyboard.addListener('keyboardDidHide', 
            (e) => dispatch(setKeyboard({
                visible: false,
                keyboardHeight: 0
            }))
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
}