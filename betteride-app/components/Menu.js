import React, { useState, useRef, useEffect } from 'react'
import { Keyboard, Animated, StyleSheet, Text, Touchable, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import tw from 'tailwind-react-native-classnames'
import MenuBar from './MenuBar'

const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setShowMenu(!showMenu);
        });
    };

    const openCloseMenuBar = () => {
        Keyboard.dismiss()
        if (showMenu) fadeOut();
        else {
            fadeIn();
            setShowMenu(!showMenu);
        }
    }

    return (
        <View style={tw`absolute ${showMenu ? 'h-full w-full' : (Platform.OS === 'ios' ? 'h-1 w-1' : 'w-20 h-28')} z-40 `}>
            <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim }]}>
                <MenuBar openCloseMenuBar={openCloseMenuBar} />
            </Animated.View>
            <View style={tw`absolute z-20 top-14 left-6`}>
                <TouchableOpacity style={tw``} activeOpacity={.7} onPress={openCloseMenuBar}>
                    <Icon style={[tw`p-2 rounded-full w-10 shadow`, styles.menuIcon]}
                        name="menu" color="white" type="material" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Menu

const styles = StyleSheet.create({
    menuIcon: {
        backgroundColor: "#79aee2"
    },
    fadingContainer: {
        height: '100%',
        width: '100%'
    }
})

