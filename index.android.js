/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ViewPagerAndroid,
    TouchableHighlight,
    Animated,
    Easing,
    ScrollView,
} from 'react-native';
import {StackNavigator} from 'react-navigation';

const swipePages = [];
const NB_PAGES = 2;

class NavigatorView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            opacityInterpolate: '',
        };
        console.log("construct");
    }

    setUpPages() {
        let opacity = this.state.opacity.interpolate({
            inputRange: [0.5, 1],
            outputRange: [0.5, 1]
        });

        for (let i = 0; i < NB_PAGES; i++) {
            swipePages.push(
                <Animated.View style={[{opacity}]}>
                    <View key={i}>
                        <Text>TESTETSTTESTETSTTESTETST</Text>
                    </View>
                </Animated.View>
            );
        }
        console.log("pages added");
    }

    componentDidMount() {
        this.state.opacity.setValue(0);
        Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 2500,
                easing: Easing.linear
            }
        ).start();
        console.log("comp mounted");
    }

    render() {
        console.log("inside render");
        this.setUpPages();

        console.log("tableau : " + swipePages);
        return (
            <ViewPagerAndroid
                style={styles.container}
                initialPage={0}>
                {swipePages}
            </ViewPagerAndroid>
        );
    }
}

class CustomButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pressed: false
        };
    }

    onPressChange = () => {
        const {navigate} = this.props.navigator;
        navigate(this.props.URI);
    };

    render() {
        return (
            <TouchableHighlight onPress={this.onPressChange}>
                <View
                    style={[button_styles.size, ( this.state.pressed ? button_styles.yellow : button_styles[this.props.style] ) ]}>
                    <Text style={button_styles.text}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const button_styles = StyleSheet.create({
    orange: {
        backgroundColor: '#F7760F'
    },
    size: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000000',
        height: 100,
    },
    text: {
        fontSize: 15
    }
});

class HomeView extends Component {

    render() {
        return (
            <CustomButton title="Nav view" URI="Navigator" navigator={this.props.navigation} style='orange'/>
        );
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        alignItems: 'center',
        padding: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


const App_routes = StackNavigator({
    Home: {screen: HomeView},
    Navigator: {screen: NavigatorView}
});

AppRegistry.registerComponent('TpAnimation4_4_2', () => App_routes);
