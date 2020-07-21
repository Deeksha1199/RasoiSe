import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native';


const ResolveAuthScreen = ({ navigation }) => {

    const tryLocalSignin = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            console.log(token); 
            navigation.navigate('AppStack')
        } else {
            navigation.navigate('Signin');
        }
    };

    useEffect(() => {
        tryLocalSignin();
    }, []);

    return null;
};

export default ResolveAuthScreen;