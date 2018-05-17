import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    Image,
    Alert,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import IconF from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var DismissKeyboard = require('dismissKeyboard');
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import MobileUser from '../../services/mobile-user-service';

export default class ActivationCodePage extends Component {

    constructor(props) {
        super(props);
        let mobile_number = this.props.data.mobile_number;
        let activation_code = this.props.data.activation_code;
        let country = this.props.data.country;
        this.state = { code:"" ,
        activation_code:activation_code,
        mobile_number: mobile_number,
        country:country,
        animating:false
        }
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
            />
        );
    }

    onPressActivate(){
        DismissKeyboard();
        var self = this;

        if(this.state.code != this.state.activation_code){
            Alert.alert(
                'App',
                "Activation code is wrong",
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]
            )
            return;
        }
        self.setState({ animating: true });
        MobileUser.registerMobileUser(this.state.mobile_number, this.state.activation_code).then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((user_data)=>{
                    if(user_data.status){
                        let data = self.props.data;
                        data['user_token'] = user_data.data.user_token;
                        AsyncStorage.setItem('user_id', user_data.data._id);
                        AsyncStorage.setItem('user_token', user_data.data.user_token);
                        AsyncStorage.setItem('mobile_number', self.state.mobile_number);
                        AsyncStorage.setItem('language', JSON.stringify(data.language));
                        AsyncStorage.setItem('country', JSON.stringify(data.country));
                        self.props.navigator.push({
                            id: 'CategoryPage',
                            name: 'Category',
                            data: data
                        });
                    }else{
                        setTimeout(()=>{
                            Alert.alert(
                                'App',
                                user_data.message,
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                                ]
                            )
                        },100);
                    }
                });
            } else {
                setTimeout(()=>{
                    Alert.alert(
                        'App',
                        resJson['_bodyText'],
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
    }

    onPressWrongNumber(){
        DismissKeyboard();
        this.props.navigator.pop();
    }

    renderScene(route, navigator) {
        var self = this;
        return (
           <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Image style={styles.bg} source={{uri: "background", isStatic: true}} />
                <View style={{flex:1, flexDirection:'column',alignSelf:'stretch'}}>
                    <View style={{flex:0.70,backgroundColor:'transparent',justifyContent:'flex-end',alignItems:'center'}}>
                        <Image style={{width:80,height:80,marginBottom:20}} resizeMode="contain" source={{ uri: "activation", isStatic: true }} />
                        <Text style={styles.textWelcome}>Enter activation code</Text>
                        <Text style={styles.textPleaseChoose}>We have sent an SMS with an activation code to</Text>
                        <Text style={styles.textPleaseChoose}>your phone {this.state.mobile_number}</Text>
                        <View style={{marginLeft:30,marginRight:30,marginTop:50,height:60,alignSelf:'stretch'}}>
                            <Text style={{fontSize:12}}>Enter code</Text>
                            <View style={{borderBottomColor:'green',borderBottomWidth:1,justifyContent:'center',alignItems:'flex-start',height:40}}>
                                <TextInput
                                    style={[styles.input, styles.blackFont]}
                                    placeholder="Code"
                                    returnKeyType={"done"}
                                    autoCapitalize="none"
                                    keyboardType={"phone-pad"}
                                    placeholderTextColor="#CCC"
                                    value={this.state.code}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.setState({ code: text })}
                                    editable={true}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flex:0.30,backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
                        <View style={{alignSelf:'stretch'}}>
                            <TouchableHighlight underlayColor='transparent' onPress={this.onPressActivate.bind(this)} style={styles.btnSendActivationCode}>
                                <Text style={styles.textSendActivationCode}>Activate</Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor='transparent' onPress={this.onPressWrongNumber.bind(this)} style={{justifyContent:'center',alignItems:'center',marginTop:30}}>
                                <Text style={{color:'red',fontSize:12}}>Wrong Number ?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <KeyboardSpacer/>
            </View>
        );
    }
}