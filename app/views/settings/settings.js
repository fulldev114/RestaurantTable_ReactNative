import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ListView,
    Image,
    ScrollView,
    Alert,
    Switch,
    AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import config from '../../helpers/config';
import localize from '../../helpers/localize';
import common from '../../services/common-service';

export default class SettingsPage extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let languageData = [];
        var self = this;
        this.state = {
            isLangModalOpen: false,
            selectedLang : {},
            ds: ds,
            hourFormat:true,
            language:{},
            mobile_number:"",
            animating: false,
            change_lang: false,
            langDataSource: ds.cloneWithRows(languageData),
            localize: {
                "about-eatables": "About Eatables",
                "share-eatables": "Share Eatables",
                "contact-us": "Contact US",
                "settings": "Settings",
                "notification-mute-times": "Notification Mute Times",
                "change-mobile-number": "Change Mobile Number",
                "language": "Language",
                "24-hours-format": "24 Hours Format",
                "current-language": "Current Language"
            }
        };
    }

    componentDidMount(){
        var self = this;
        AsyncStorage.getItem('language').then((data)=>{
            if(data){
                let language = JSON.parse(data);
                self.setState({language: language,selectedLang:language});
            }
        });
        AsyncStorage.getItem('mobile_number').then((data)=>{
            if(data){
                self.setState({mobile_number: data});
            }
        });
        AsyncStorage.getItem('timeFormat').then((format) => {
            let hourFormat = true;
            if(format){
                if(format == '24'){
                    hourFormat = true;
                }else{
                    hourFormat = false;
                }
            }else{
                hourFormat = true;
            }
            self.setState({hourFormat:hourFormat});
        });
        self.setLocalization();
    }

    setLocalization(){
        var self = this;
        localize.getLocalization().then((ddata)=>{
            let defaultLocalize = self.state.localize;
            if(ddata){
                let data = JSON.parse(ddata);
                let newLocalize = localize.formatLocalization(defaultLocalize, data);
                self.setState({localize:newLocalize});
            }else{
                self.setState({localize:defaultLocalize});
            }
        });
    }

    render() {
        var self = this;
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                navigationBar={
                    <Navigator.NavigationBar style={{ backgroundColor: 'rgba(3,202,79,1)' }}
                        routeMapper={{
                            LeftButton(route, navigator, index, navState) {
                                return (
                                    <TouchableOpacity style={{ marginLeft: 15, flex:1, justifyContent: 'center', alignItems:'center' }}
                                        onPress={() => self.onPressBack()}>
                                        <View style={{justifyContent: 'center', alignItems:'center'}}>
                                            <IconF name="angle-left" size={22} style={{ color: 'white' }} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            },
                            RightButton(route, navigator, index, navState) {
                                return null;
                            },
                            Title(route, navigator, index, navState) {
                                return (
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{color:'white',fontWeight:'600',fontSize:18}}> {self.state.localize['settings']} </Text>
                                    </TouchableOpacity>
                                );
                            }
                    }} />
            } />
        );
    }

    onPressBack(){
        this.props.route.callback({ "change_lang": this.state.change_lang });
        this.props.navigator.pop();
    }

    onPressChangeLanguage(){
        this.callLanguageAPI();
    }

    callLanguageAPI() {
        var self = this;
        self.setState({ animating: true });
        common.getLanguages().then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((langs)=>{
                    if(langs.status){
                        self.setState({
                            langDataSource: self.state.ds.cloneWithRows(langs.data),
                            isLangModalOpen:true
                        });
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

    onPressLangRow(data){
        var self = this;
        this.setState({isLangModalOpen:false});
        localize.callLocalizeAPI(data._id, function(ldata){
            if(ldata.st){
                self.setLocalization();
                self.setState({selectedLang:data, change_lang: true});
                AsyncStorage.setItem('language', JSON.stringify(data));
            }else{
                setTimeout(()=>{
                    Alert.alert(
                        'App',
                        ldata.message,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ]
                    )
                },100);
            }
        });
    }

    renderLangRow(data){
        var stripColor = "white";
        var iconColor = "white";
        var textLanguageStyle = styles.textLanguageRow;
        if(this.state.selectedLang._id == data._id){
            stripColor = "rgba(3,202,79,1)";
            iconColor = "rgba(3,202,79,1)";
            textLanguageStyle =  styles.textLanguageRowSelected;
        }
        return (
            <View style={styles.viewLangRow}>
                <View style={{flex:0.05}}>
                    <View style={{width:3,height:40,backgroundColor:stripColor}}></View>
                </View>
                <View style={{flex:0.90,justifyContent:'center',alignItems:'center', borderBottomColor:'lightgray',borderBottomWidth:1,height:40}}>
                    <TouchableHighlight underlayColor='transparent' onPress={()=> this.onPressLangRow(data)} style={{alignItems:'center',justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={textLanguageStyle}>{data.name}</Text>
                            <IconF name="check" size={12} style={{flex:0.05,color:iconColor}}></IconF>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{flex:0.05}}>
                    <Text></Text>
                </View>
            </View>
        );
    }

    renderLanguageModal(){
        return (
            <Modal style={styles.modal} swipeToClose={false} isOpen={this.state.isLangModalOpen} position={"center"}>
                <View style={{flexDirection:'row',height:60}}>
                    <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                        <IconF name={'check'} size={22} style={{color:'rgba(3,202,79,1)'}}></IconF>
                    </View>
                    <View style={{flex:0.80,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={{fontSize:10,color:'gray'}}>{this.state.localize['current-language']}</Text>
                        <Text style={{fontSize:12,marginTop:5, color:'rgba(3,202,79,1)',fontWeight:'600'}}>{this.state.selectedLang.name}</Text>
                    </View>
                </View>
                <ListView
                    style={{flex:1}}
                    dataSource={this.state.langDataSource}
                    removeClippedSubviews={false}
                    renderRow={(data) => this.renderLangRow(data)}
                />
            </Modal>
        );
    }

    onChangeTimeFormat(value){
        this.setState({hourFormat:value});
        if(value){
            AsyncStorage.setItem('timeFormat','24');
        }else{
            AsyncStorage.setItem('timeFormat','12');
        }
    }

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <ScrollView contentContainerStyle={{}}>
                    <View style={{marginTop:20,marginLeft:30,marginRight:30}}>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={{color:"#aaa",fontSize:13,flex:0.95}}>{this.state.localize['notification-mute-times']}</Text>
                                 <IconF name="caret-right" size={14} style={{flex:0.05,color:'gray'}}></IconF>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={{color:"#aaa",fontSize:13,flex:0.50}}>{this.state.localize['change-mobile-number']}</Text>
                                 <Text style={{color:"#000",fontWeight:'500',fontSize:13,flex:0.45}}>{this.state.mobile_number}</Text>
                                 <IconF name="pencil" size={14} style={{flex:0.05,color:'gray'}}></IconF>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption} onPress={()=> this.onPressChangeLanguage()}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={{color:"#aaa",fontSize:13,flex:0.50}}>{this.state.localize['language']}</Text>
                                 <Text style={{color:"#000",fontWeight:'500',fontSize:13,flex:0.45}}>{this.state.selectedLang.name}</Text>
                                 <IconF name="caret-right" size={14} style={{flex:0.05,color:'gray'}}></IconF>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={styles.textStyleTypeOne}>{this.state.localize['about-eatables']}</Text>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={styles.textStyleTypeOne}>{this.state.localize['share-eatables']}</Text>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={styles.textStyleTypeOne}>{this.state.localize['contact-us']}</Text>
                             </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='transparent' style={styles.viewSettingOption}>
                             <View style={styles.viewSettingInnerOption}>
                                 <Text style={styles.textStyleTypeOne}>{this.state.localize['24-hours-format']}</Text>
                                 <View style={{flex:0.25}}>
                                     <Switch
                                        onValueChange={(value) => this.onChangeTimeFormat(value)}
                                        onTintColor={"rgba(3,202,79,1)"}
                                        tintColor={'#ccc'}
                                        thumbTintColor={"#ffffff"}
                                        value={this.state.hourFormat} />
                                 </View>
                             </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                {this.renderLanguageModal()}
            </View>
        );
    }
}