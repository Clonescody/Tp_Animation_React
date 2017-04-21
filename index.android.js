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
    Image
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import FlipCard from "react-native-flip-card-view"


const Dimensions = require('Dimensions');
const windowSize = Dimensions.get('window');

const swipePages = [];
const NB_PAGES = 2;

class FadeSwipeView extends Component {

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
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        for (let i = 0; i < NB_PAGES; i++) {
            swipePages.push(
                <Animated.View key={i} style={[{opacity}]}>
                    <View>
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
        if (swipePages.length != NB_PAGES)
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

class TestDragView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            dragging: false,
            rotateTop: ''
        };
        this.drag = {
            x: 0,
            y: 0
        };
    }

    setPosition(e) {
        //Update our state with the deltaX/deltaY of the movement

        this.setState({
            x: this.state.x + (e.nativeEvent.pageX - this.drag.x),
            y: this.state.y + (e.nativeEvent.pageY - this.drag.y)
        });
        //Set our drag to be the new position so our delta can be calculated next time correctly
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
    }

    resetPosition(e) {
        //Reset on release
        this.setState({
            x: 0,
            y: 0,
            dragging: false,
        })
    }

    _onStartShouldSetResponder(e) {
        this.setState({dragging: true});
        //Setup initial drag coordinates
        this.setState({rotateTop: e.nativeEvent.locationY <= 150});
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        return true;
    }

    _onMoveShouldSetResponder(e) {
        return true;
    }

    getRotationDegree(rotateTop, x) {
        let rotation = ( (x / windowSize.width) * 100) / 3;
        let rotate = rotateTop ? 1 : -1;
        let rotateString = (rotation * rotate) + 'deg';
        return rotateString;
    }

    getCardStyle() {
        let transform = [{translateX: this.state.x}, {translateY: this.state.y}];
        if (this.state.dragging)
            transform.push({rotate: this.getRotationDegree(this.state.rotateTop, this.state.x)});
        return {transform: transform};
    }

    render() {
        return (
            <View style={dragStyles.container}>
                <View onResponderMove={this.setPosition.bind(this)}
                      onResponderRelease={this.resetPosition.bind(this)}
                      onStartShouldSetResponder={this._onStartShouldSetResponder.bind(this)}
                      onMoveShouldSetResponder={this._onMoveShouldSetResponder.bind(this)}
                      style={[dragStyles.card, this.getCardStyle()]}>
                    <Image source={require('./assets/images/gandalf.png')}/>
                    <View style={dragStyles.text}>
                        <Text style={styles.textLeft}>Rabbit, 10</Text>
                        <Text style={styles.textRight}>1 Connection</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const dragStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        borderWidth: 3,
        borderRadius: 3,
        borderColor: '#000',
        width: 300,
        height: 300,
        padding: 10
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textLeft: {
        position: 'absolute',
        left: 0,
        top: 0
    },
    textRight: {
        position: 'absolute',
        right: 0,
        top: 0
    }
});

class TestFlipView extends Component {

    render() {
        return (
            <FlipCard
                style={flipStyles.flipCard}
                friction={6}
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
                flip={false}
                clickable={true}
                onFlipped={(isFlipped)=>{console.log('isFlipped', isFlipped)}}>
                <View style={flipStyles.face}>
                    <Image source={require('./assets/images/gandalf.png')}/>
                    <Text>The Face</Text>
                    <Image source={require('./assets/images/gandalf.png')}/>
                </View>
                <View style={flipStyles.back}>
                    <Image source={require('./assets/images/gandalf.png')}/>
                    <Text>The Back</Text>
                    <Image source={require('./assets/images/gandalf.png')}/>
                </View>
            </FlipCard>
        );
    }
}

class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    switchToView() {
        this.props.navigator.navigate(this.props.URI);
    }

    _renderFront(){
        return (
                <View style={[button_styles.size, button_styles[this.props.css]]}>
                    <Text style={button_styles.text}>{this.props.title}</Text>
                </View>
        );
    }

    _renderBack(){
        return(<Image source={require('./assets/images/gandalf.png')}/>);
    }

    render() {

        return (
            <FlipCard velocity={2} renderFront={this._renderFront()} renderBack={this._renderBack()}/>
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
        height: 60
    },
    text: {
        fontSize: 15
    }
});

const flipStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 110,
        width: 100
    },
    flipCard: {
        flex: 1,
        backgroundColor: '#F7760F',
        height: 100,
        width: 90
    }
});


class HomeView extends Component {
    render() {
        return (
            <View style={styles.buttonContainer}>
                <CustomButton title="Test fade + swipe animation" URI="TestFade" navigator={this.props.navigation}
                              css='orange'/>
                <CustomButton title="Test flip animation" navigator={this.props.navigation}
                              css='orange'/>
                <CustomButton title="Test drag animation" URI="TestDrag" navigator={this.props.navigation}
                              css='orange'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'row'
    }
});


const App_routes = StackNavigator({
    Home: {screen: HomeView},
    TestFade: {screen: FadeSwipeView},
    TestDrag: {screen: TestDragView},
    TestFlip: {screen: TestFlipView},
});

AppRegistry.registerComponent('TpAnimation4_4_2', () => App_routes);
