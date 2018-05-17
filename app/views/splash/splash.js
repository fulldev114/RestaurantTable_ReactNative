import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    Image,
    Alert,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import MobileUser from '../../services/mobile-user-service';
import common from '../../services/common-service';

import PercentageCircle from 'react-native-percentage-circle';
import * as Progress from 'react-native-progress';


export default class SplashPage extends Component {

    goToNext(){
        var self = this;
        AsyncStorage.getItem('user_token').then((value)=>{
            if (value !== null){
                MobileUser.checkMobileUser(value).then(function (resJson) {
                    self.setState({ animating: false });
                    if (resJson.status == 200) {
                        resJson.json().then((mobile_data)=>{
                            if(mobile_data.status){
                                self.props.navigator.push({
                                    id: 'CategoryPage',
                                    name: 'Category',
                                });
                            }else{
                                self.props.navigator.push({
                                    id: 'LanguageSelectionPage',
                                    name: 'Language',
                                });
                            }
                        });
                    } else {
                        setTimeout(()=>{
                            Alert.alert(
                                'App',
                                JSON.stringify(resJson),
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                                ]
                            )
                        },100);
                    }
                }).catch(function (error){
                    setTimeout(()=>{
                        Alert.alert(
                            'App',
                            error,
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') }
                            ]
                        )
                    },100);
                });
            }else{
                self.setState({ animating: false });
                self.props.navigator.push({
                    id: 'LanguageSelectionPage',
                    name: 'Language',
                });
            }
        });
    }

    constructor(props) {
        super(props);
        this.state = {"percent":0, animating:false}
        let self = this;
        this.intval = setInterval(
            () => {
                let s = self.state.percent % 100;
                s += 1;
                self.setState({
                    percent: s,
                })
            },300
        );
        this.intval2 = setInterval(
            () => {
                clearInterval(this.intval);
                clearInterval(this.intval2);
                self.setState({ animating: true });
                common.getConfig().then(function (resJson) {
                    if (resJson.status == 200) {
                        resJson.json().then((config)=>{
                            if(config.status){
                                AsyncStorage.setItem('config',JSON.stringify(config));
                            }
                            self.goToNext();
                        });
                    } else {
                        setTimeout(()=>{
                            self.goToNext();
                            self.setState({ animating: false });
                            Alert.alert(
                                'App',
                                JSON.stringify(resJson),
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                                ]
                            )
                        },100);
                    }
                }).catch(function (error){
                    setTimeout(()=>{
                        self.setState({ animating: false });
                        Alert.alert(
                            'App',
                            error,
                            [
                                { text: 'OK', onPress: () => console.log('OK Pressed') }
                            ]
                        )
                    },100);
                });
            },1400
        );
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
            />
        );
    }

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Checking for latest data ...'} textStyle={{ color: '#FFF' }} />
                <Image style={styles.bg} source={{uri: "splash", isStatic: true}} />
                <View style={{flex:1, flexDirection:'column',alignSelf:'stretch'}}>
                    <View style={{flex:0.65,backgroundColor:'transparent',justifyContent:'flex-end',alignItems:'center'}}>
                        <Image style={{width:160,height:160}} resizeMode="contain" source={{ uri: "splash_logo", isStatic: true }} />
                        <Text style={{color:'white',fontSize:32,marginTop:10,fontWeight:'600'}}>Djoli Djolilo</Text>
                        <Text style={{color:'white',fontSize:12,marginTop:5,marginBottom:30}}>DAILY PRICE OF FRESH PRODUCTS</Text>
                    </View>
                    <View style={{flex:0.35,backgroundColor:'transparent',alignItems:'center'}}>
                        <View style={{marginTop:35}}>
                            <Progress.Circle size={65} thickness={5} indeterminate={false} textStyle={{fontSize:14,color:'white',fontWeight:'500'}} showsText={true} progress={this.state.percent} color="#00FF00"/>
                        </View>
                        <Text style={{color:'white',fontSize:14,marginTop:20}}>Djoli Djolilo is loading...please wait</Text>
                    </View>
                </View>
            </View>
        );
    }
}