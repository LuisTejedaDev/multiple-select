import {SafeAreaView, StyleSheet, View} from "react-native"
import {MultiSelect} from "../src/components"
import {useKeyboard} from "./hooks"
import {items} from "./constants"

export default () => {

    useKeyboard()

	const handleSave = (elements) => {
		console.log('elements: ', elements)
	}
	
	return(
		<>
			<SafeAreaView style={{backgroundColor: '#2381B4'}}/>
			<View style={styles.container}>
				<MultiSelect title={"Seleccionar países"} items={items} handleSave={handleSave} />
			</View>
			<SafeAreaView style={{backgroundColor: '#2381B4'}}/>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
        paddingHorizontal: 12,
	}
})