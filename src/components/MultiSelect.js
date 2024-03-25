import {useEffect, useRef, useState} from 'react'
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions} from 'react-native'
import {useSelector} from 'react-redux'
import {selectKeyboard} from '../slices/appSlice'
import {isIphone} from '../constants'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'

const {height, width} = useWindowDimensions()

export default ({title = 'Countries', items = [], handleSave = () => {}}) => {

    const keyboard = useSelector(selectKeyboard)

    const inputRef = useRef()
    const scrollRef = useRef()
    
    const [filter, setFilter] = useState('')
    const [data, setData] = useState(items)

    const [filteredData, setFilteredData] = useState({
        selected: [],
        notSelectedMaster: [],
        notSelected: [],
    })

    const {selected, notSelectedMaster, notSelected} = filteredData
    
    useEffect(() => {
        inputRef.current.blur()
        setFilter('')
        scrollToTop()
        setFilteredData({
            ...filteredData,
            selected: data.filter(x => x.selected).map(x => x.id),
            notSelected: data.filter(x => !x.selected),
            notSelectedMaster: data.filter(x => !x.selected)
        })
    }, [data])

    const handleSelected = (id) => {
        const nuevos = data.map(x => x.id === id ? ({...x, selected: !x.selected}) : x)
        const element = nuevos.find(x => x.id === id)
        const withOutSelected = nuevos.filter(x => x.id !== id)

        const todos = [element , ...withOutSelected]

        setData(todos)
    }

    const toggle = useSharedValue(false)

    const translateStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(toggle.value ? 0 : (height + 100))
            }
        ]
    }))

    const ItemChecked = ({id}) => {
        const checkedStyle = {textDecorationColor: '#383838', textDecorationStyle: 'solid', textDecorationLine: 'line-through'}
        return(
            <TouchableOpacity
                onPress={() => handleSelected(id)}
                style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            >
                
                <View style={{height: 22, width: 22, backgroundColor: '#248EC8', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#248EC8', borderRadius: 4, marginRight: 10}}>
                    <Material name={'check-bold'} size={13} color={'#FFF'}/>
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Text style={[{fontSize: 16, color: '#383838'}, checkedStyle]}>{data.find(x => x.id === id)?.description}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    const ItemUnchecked = ({id, description}) => {
        return(
            <TouchableOpacity 
                onPress={() => handleSelected(id)}
                style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            >
                
                <View style={{height: 22, width: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#adadad', borderRadius: 4, marginRight: 10}} />

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 16, color: '#383838'}}>{description}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    const handleInputChange = (text) => {
        const updatedData = notSelectedMaster.filter((item) => {
            const item_data = `${item.description.toUpperCase()})`;
            const text_data = text.toUpperCase();
            return item_data.indexOf(text_data) > -1;
        });
        
        setFilteredData({...filteredData, notSelected: updatedData})
        setFilter(text)
    }

    const handleClean = () => {
        setData(items)
    }

    const scrollToTop = () => {
        scrollRef.current.scrollTo({x: 0, y: 0, animated: true})
    }

    return(
        <>
            <TouchableOpacity
                onPress={() => toggle.value = !toggle.value}
                style={{height: 50, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#dadada', borderRadius: 2, flexDirection: 'row', zIndex: 0}}>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#adadad'}}>{selected.length === 0 ? 'Seleccionar opciones' : `Opciones seleccionadas: ${selected.length}`}</Text>
                <View style={{height: 20, width: 20, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 15}}>
                    <Material name={'chevron-down'} size={18} color={'#adadad'}/>
                </View>
            </TouchableOpacity>

            <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', marginTop: 15}}>
                {
                    selected.map(y => 
                        <TouchableOpacity
                            onPress={() => handleSelected(y)}
                            key={y}
                            style={{paddingHorizontal: 6, paddingVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#dadada', marginRight: 8, marginBottom: 8}}
                        >
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#adadad', marginRight: 5}}>{data.find(x => x.id === y)?.description}</Text>
                            <View style={{width: 15, height: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dc3545'}}>
                                <Material name={'close-thick'} size={10} color={'#fff'}/>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>

            <Animated.View
                style={[{height: '100%', width: width, backgroundColor: '#fff', position: 'absolute', zIndex: 10}, translateStyles]}>

                <View style={styles.header}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#383838'}}>{title}</Text>
                    </View>
                    {
                        selected.length === 0
                        &&
                            <TouchableOpacity 
                                style={{height: '100%', width: 'auto', paddingHorizontal: 20, justifyContent: 'center', alignItems: 'flex-end'}}
                                onPress={() => {
                                    toggle.value = !toggle.value
                                    Keyboard.dismiss()
                                }}
                            >
                                <Text style={{fontSize: 15, color: '#dc3545'}}>Cancelar</Text>
                            </TouchableOpacity>
                    }
                </View>

                <View style={styles.content}>

                    {/* Sección de buscador */}
                    <View style={styles.inputContainer}>
                        
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            placeholder='Buscar'
                            placeholderTextColor={'#dadada'}
                            selectionColor={'#248EC8'}
                            value={filter}
                            onChangeText={handleInputChange}
                        />

                        {
                            filter
                            &&
                                <TouchableOpacity
                                    onPress={() => {
                                        inputRef.current.blur()
                                        setFilter('')
                                        setFilteredData({...filteredData, notSelected: notSelectedMaster})
                                    }}
                                    style={{width: 50, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{height: 22, width: 22, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#adadad'}}>
                                        <Material name={'close-thick'} size={12} color={'#fff'}/>
                                    </View>
                                </TouchableOpacity>
                        }

                    </View>

                    <ScrollView
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false} 
                        style={{height: 'auto', alignSelf: 'stretch'}}
                    >
                        {/* Sección seleccionados */}
                        {
                            selected.length > 0
                            &&
                                <>
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#248EC8',  marginBottom: 13, marginTop: 23}}>Seleccionados</Text>
                                    {
                                        selected
                                        .map(x => 
                                            <ItemChecked key={x} id={x} />    
                                        )
                                    }
                                </>
                        }

                        {/* Sección no seleccionados */}
                        {
                            notSelected.length > 0
                            &&
                                <>
                                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#248EC8', marginBottom: 13, marginTop: selected.length > 0 ? 13 : 23}}>No Seleccionados</Text>
                                    {
                                        notSelected
                                            .map(x => 
                                                <ItemUnchecked key={x.id} {...x} />    
                                            )
                                    }
                                </>
                        }
                        <View style={{height: isIphone ? keyboard.keyboardHeight - 80 : 0}}/>
                    </ScrollView>
                </View>

                <View style={{height: 50, alignSelf: 'stretch', flexDirection: 'row', backgroundColor: '#248EC8', justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity 
                        onPress={handleClean}
                        style={styles.button}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>Limpiar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            toggle.value = !toggle.value
                            Keyboard.dismiss()
                            handleSave(selected)
                        }}
                        style={styles.button}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>Guardar</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 55,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    filter: {
        height: 55,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputContainer: {
        height: 50,
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: '#dadada',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 12,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#383838',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})