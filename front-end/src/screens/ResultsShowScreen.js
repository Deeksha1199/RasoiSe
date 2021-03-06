import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Image, TextInput, TouchableOpacity, StatusBar, ImageBackground, SafeAreaView } from 'react-native';
import trackerApi from '../api/tracker';
import ResultShowDetail from '../components/ResultShowDetails';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import { NavigationEvents } from 'react-navigation';
// import Geocoder from 'react-native-geocoding';
// import { Permissions, Location } from 'expo';
// Geocoder.init("AIzaSyA4R47lkG-0zcnpIYdX4pWeJocfmTI8Ujs"); 
// Geocoder.init("AIzaSyA4R47lkG-0zcnpIYdX4pWeJocfmTI8Ujs", {language : "en"});

// displaying all the dishes made by a particular chef

const ResultsShowScreen = ({ navigation }) => {
    const [result, setResult] = useState(null);
    const [err, setErr] = useState('');
    const [veg, setVeg] = useState([]);
    const id = navigation.getParam('id');
    const searchTerm = navigation.getParam('searchTerm');
    const [isEnabled, setIsEnabled] = useState(false);
    const [isRel, setIsRel] = useState(false);
    const [relevant, setRelevant] = useState([]);


    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const toggleSwitch = async () => {
        try {
            if (isRel) {
                let k;
                if (isEnabled) {
                    k = "off";
                }
                else {
                    k = "on";
                }
                const response = await trackerApi.post('/home/yourdishes', { chefid: id, query: searchTerm, toggle: k });
                // console.log('relevance', response.data);
                setIsEnabled(previousState => !previousState);
                setRelevant(response.data.dishes);
            }
            else {
                setIsEnabled(previousState => !previousState);
            }
        }
        catch (err) {
            console.log(err);
            setErr('Something went wrong');
        }
    }


    const toggleRelevant = async () => {
        try {
            if (!isRel) {
                let k;
                if (isEnabled) {
                    k = "on";
                }
                else {
                    k = "off";
                }
                const response = await trackerApi.post('/home/yourdishes', { chefid: id, query: searchTerm, toggle: k });
                // console.log('relevance', response.data);
                setIsRel(true);
                setRelevant(response.data.dishes);
            }
            else {
                setIsRel(previousState => !previousState);
            }
        }
        catch (err) {
            console.log(err);
            setErr('Something went wrong');
        }
    }


    const getResult = async (id) => {
        // console.log('inside get result');
        // console.log(id);
        const response = await trackerApi.get(`/home/chef/${id}`);
        // console.log('chef', response.data);
        setResult(response.data);
    };

    const getVegOnly = async (id) => {
        const response = await trackerApi.post('/home/filterdish/', { chefid: id });
        // console.log('veg only', response.data);
        setVeg(response.data.dishes);

    }

    useEffect(() => {
        // console.log('inside use effect', id);
        getResult(id);
        getVegOnly(id);
    }, []);


    if (!result) {
        return null;
    }

    // // console.log('location',location);
    // _attemptGeocodeAsync = async () => {
    //     this.setState({ inProgress: true, error: null });
    //     try {
    //       let result = await Location.geocodeAsync(this.state.selectedExample);
    //       this.setState({ result });
    //     } catch (e) {
    //       this.setState({ error: e.message });
    //     } finally {
    //       this.setState({ inProgress: false });
    //     }
    //   };




    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <NavigationEvents onDidFocus={() => getResult(id)} />
            <StatusBar backgroundColor='#EA3C53' />
            <ImageBackground source={require('../../assets/bg3.jpeg')} style={{ width: '100%' }}>
                <SafeAreaView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <NavigationEvents onDidFocus={() => getResult(id)} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginTop: 5 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Search')}>
                            <AntDesign name='arrowleft' color='white' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: 'auto', marginRight: 20 }} onPress={() => navigation.navigate('RateReview', { chefId: result.chef_details._id, chefName: result.chef_details.name, chef_profile: result.chef_details })} >
                            <Feather name='edit' color='white' size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10 }} onPress={() => navigation.navigate('Cart')}>
                            <AntDesign name='shoppingcart' color='white' size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 30, marginLeft: 20, marginBottom: 50 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>{result.chef_details.name}'s Kitchen</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5 }}>
                            <Entypo name="location-pin" size={24} color="white" />
                            <Text style={{ color: 'white', fontSize: 15 }}> {result.chef_details.location}</Text>
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <FlatList
                                data={result.slots}
                                keyExtractor={(result) => result._id}
                                renderItem={({ item }) => {
                                    return <View>
                                        <Text style={{ color: 'white', fontSize: 12, marginBottom: 2 }}>{item}</Text>
                                    </View>
                                }}
                            />
                        </View>
                        {/* <View >

                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={result.chef_details.rating}
                                fullStarColor={'#ffcc00'}
                                emptyStarColor={'#ffcc00'}
                                starSize={22}
                                containerStyle={{ width: 30, marginBottom: 10 }}
                            />

                        </View> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            <View>
                                {/* <Text style={{ color: 'white', fontSize: 14, alignSelf: 'center' }}>{result.chef_details.rating}</Text> */}
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={result.chef_details.rating}
                                    fullStarColor={'#fff'}
                                    emptyStarColor={'#fff'}
                                    starSize={16}
                                    containerStyle={{ width: 18, marginBottom: 3 }}
                                />
                                <Text style={{ color: '#cccccc', fontSize: 14 }}>351 Ratings</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'white', fontSize: 14, alignSelf: 'center' }}>137k</Text>
                                <Text style={{ color: '#cccccc', fontSize: 14 }}>Bookmarks</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'white', fontSize: 14, alignSelf: 'center' }}>347</Text>
                                <Text style={{ color: '#cccccc', fontSize: 14 }}>Photos</Text>

                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
            <ScrollView showsVerticalScrollIndicator={false} style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'rgb(250,250,250)', elevation: 25 }}>
                <View style={{ marginTop: 30, backgroundColor: 'rgb(250,250,250)', flexDirection: 'row', marginLeft: 20 }}>
                    <Text style={{ alignSelf: 'flex-end', fontSize: 15, marginBottom: 13, color: '#737373' }} >Veg Only</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#77b300" }}
                        thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ alignSelf: 'flex-end', marginBottom: 10, marginLeft: 8 }}
                    />
                    <Text style={{ alignSelf: 'flex-end', fontSize: 15, marginBottom: 13, color: '#737373' }} >Search Relevant</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#66b3ff" }}
                        thumbColor={isRel ? "#f4f3f4" : "#f4f3f4"}
                        onValueChange={toggleRelevant}
                        value={isRel}
                        style={{ alignSelf: 'flex-end', marginBottom: 10, marginLeft: 8 }}
                    />

                </View>



                {
                    !isEnabled && !isRel ?

                        <FlatList
                            data={result.menu}
                            keyExtractor={(result) => result._id}
                            renderItem={({ item }) => {
                                return <View>
                                    <ResultShowDetail result={item} availability={result.availability} />
                                </View>
                            }}
                        />

                        :

                        (
                            isRel ?

                                <FlatList
                                    data={relevant}
                                    keyExtractor={(result) => relevant._id}
                                    renderItem={({ item }) => {
                                        return <View>
                                            <ResultShowDetail result={item} availability={result.availability} />
                                        </View>
                                    }}
                                />


                                :
                                <FlatList
                                    data={veg}
                                    keyExtractor={(result) => veg._id}
                                    renderItem={({ item }) => {
                                        return <View>
                                            <ResultShowDetail result={item} availability={result.availability} />
                                        </View>
                                    }}
                                />

                        )
                }


            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    kitchenName: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10,
        marginHorizontal: 10,
        textTransform: "capitalize"
    },
    backgroundStyle: {
        backgroundColor: 'rgb(230,230,230)',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    inputStyle: {
        flex: 1,
        fontSize: 18
    },
    iconStyle: {
        fontSize: 35,
        alignSelf: 'center',
        marginHorizontal: 15
    },
    cart: {
        fontSize: 25,
        marginTop: 20,
        marginLeft: 40
    }
});

export default ResultsShowScreen;