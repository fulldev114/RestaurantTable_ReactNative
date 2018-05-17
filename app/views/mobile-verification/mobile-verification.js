import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    Image,
    Alert,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import IconF from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var DismissKeyboard = require('dismissKeyboard');
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import config from '../../helpers/config';
import MobileUser from '../../services/mobile-user-service';

export default class MobileVerificationPage extends Component {

    constructor(props) {
        super(props);
        let country = this.props.data.country;
        this.state = { mobilenumber:"", country: country, animating:false }
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
            />
        );
    }

    onPressbtnSendActivationCode(){
        DismissKeyboard();
        if(this.state.mobilenumber.length < 5){
            setTimeout(()=>{
                Alert.alert(
                    'App',
                    'Please enter valid mobile number',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ]
                )
            },100);
            return;
        }
        var self = this;
        self.setState({ animating: true });
        let mobile = self.state.country.calling_code.toString() + self.state.mobilenumber.toString();

        MobileUser.mobileVerification(mobile).then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((mobile_data)=>{
                    if(mobile_data.status){
                        let data = self.props.data;
                        data['mobile_number'] = mobile;
                        data['activation_code'] = mobile_data.data.pin_number;
                        self.props.navigator.push({
                            id: 'ActivationCodePage',
                            name: 'Activation',
                            data: data
                        });
                    }else{
                        setTimeout(()=>{
                            Alert.alert(
                                'App',
                                mobile_data.message,
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

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Image style={styles.bg} source={{uri: "background", isStatic: true}} />
                <View style={{flex:1, flexDirection:'column',alignSelf:'stretch'}}>
                    <View style={{flex:0.70,backgroundColor:'transparent',justifyContent:'flex-end',alignItems:'center'}}>
                        <Image style={{width:80,height:80,marginBottom:20}} resizeMode="contain" source={{ uri: "mobile", isStatic: true }} />
                        <Text style={styles.textWelcome}>Enter your phone number</Text>
                        <Text style={styles.textPleaseChoose}>Enter your phone number to get prices instantly</Text>
                        <View style={{marginLeft:30,marginRight:30,marginTop:50,height:90,alignSelf:'stretch'}}>
                            <View style={{height:30,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <View style={{justifyContent:'center',alignItems:'center',flex:0.20}}>
                                    <Image style={{width:25,height:15,alignSelf:'flex-end',marginRight:15}} source={{ uri: config.urls.api_url+this.state.country.flag_path}} resizeMode='contain' />
                                </View>
                                <Text style={{flex:0.80,color:'black',fontSize:12}}>{this.state.country.name}</Text>
                            </View>
                            <View style={{height:40,marginLeft:20,marginRight:20,flexDirection:'row',alignItems:'center'}}>
                                <View style={{flex:0.20,borderBottomColor:'gray',borderBottomWidth:1,justifyContent:'center',alignItems:'center',height:40}}>
                                     <TouchableHighlight underlayColor='transparent' style={{alignItems:'center',justifyContent:'center'}}>
                                         <Text style={{fontSize:13,fontWeight:'600',color:'gray',textAlign:'center'}}>{this.state.country.calling_code}</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{flex:0.05}}>
                                </View>
                                <View style={{flex:0.75,borderBottomColor:'green',borderBottomWidth:1,justifyContent:'center',alignItems:'flex-start',height:40}}>
                                    <TextInput
                                        style={[styles.input, styles.blackFont]}
                                        placeholder="Mobile Number"
                                        returnKeyType={"done"}
                                        autoCapitalize="none"
                                        keyboardType={"phone-pad"}
                                        placeholderTextColor="#CCC"
                                        value={this.state.mobilenumber}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({ mobilenumber: text })}
                                        editable={true}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flex:0.30,backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
                        <View style={{alignSelf:'stretch'}}>
                             <TouchableHighlight underlayColor='transparent' onPress={this.onPressbtnSendActivationCode.bind(this)} style={styles.btnSendActivationCode}>
                                <Text style={styles.textSendActivationCode}>Send activation code</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <KeyboardSpacer/>
            </View>
        );
    }
}