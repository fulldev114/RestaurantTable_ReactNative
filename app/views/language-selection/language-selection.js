import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    Image,
    ScrollView,
    ListView,
    Alert,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import IconF from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles';
import config from '../../helpers/config';
import localize from '../../helpers/localize';
import common from '../../services/common-service';

export default class LanguageSelectionPage extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let countryData = [];
        let languageData = [];
        this.state = {
            isLangModalOpen: false,
            isCountryModalOpen:false,
            selectedLang : {},
            ds: ds,
            selectedCountry : {},
            langDataSource: ds.cloneWithRows(languageData),
            countryDataSource : ds.cloneWithRows(countryData),
            animating: false
        }
    }

    componentDidMount(){
        this.callCountryAPI();
        this.callLanguageAPI();
    }

    callCountryAPI() {
        var self = this;
        self.setState({ animating: true });
        common.getCountires().then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((countries)=>{
                    if(countries.status){
                        self.setState({
                            selectedCountry:countries.data[0],
                            countryDataSource: self.state.ds.cloneWithRows(countries.data),
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
                            selectedLang:langs.data[0],
                            langDataSource: self.state.ds.cloneWithRows(langs.data),
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
    }

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
            />
        );
    }

    onPressContinue(){
        var self = this;
        let data = {language: this.state.selectedLang, country: this.state.selectedCountry};
        localize.callLocalizeAPI(this.state.selectedLang._id, function(data){            
        });
        self.props.navigator.push({
            id: 'PresentationPage',
            name: 'Presentation',
            data: data
        });
    }

    onPressLanguage(){
        this.setState({isLangModalOpen:true,isCountryModalOpen:false});
    }

    onPressCountry(){
        this.setState({isCountryModalOpen:true,isLangModalOpen:false});
    }

    onPressCountryRow(data){
        this.setState({selectedCountry:data,isCountryModalOpen:false});
    }

    renderCountryRow(data){
        var stripColor = "white";
        var iconColor = "white";
        var textCountryStyle = styles.textCountryRow;
        if(this.state.selectedCountry._id == data._id){
            stripColor = "rgba(3,202,79,1)";
            iconColor = "rgba(3,202,79,1)";
            textCountryStyle =  styles.textCountryRowSelected;
        }
        return (
            <View style={styles.viewLangRow}>
                <View style={{flex:0.05}}>
                    <View style={{width:3,height:40,backgroundColor:stripColor}}></View>
                </View>
                <View style={{flex:0.90,justifyContent:'center',alignItems:'center', borderBottomColor:'lightgray',borderBottomWidth:1,height:40}}>
                    <TouchableHighlight underlayColor='transparent' onPress={()=> this.onPressCountryRow(data)} style={{alignItems:'center',justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:0.15,justifyContent:'center',alignItems:'flex-start'}}>
                                <Image style={{width:25,height:15}} source={{ uri: config.urls.api_url+data.flag_path, isStatic: true }} />
                            </View>
                            <Text style={textCountryStyle}>{data.name}</Text>
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

    renderCountryModal(){
        return (
            <Modal style={styles.modal} swipeToClose={false} isOpen={this.state.isCountryModalOpen} position={"center"}>
                <View style={{flexDirection:'row',height:60}}>
                    <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                        <IconF name={'check'} size={22} style={{color:'rgba(3,202,79,1)'}}></IconF>
                    </View>
                    <View style={{flex:0.60,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={{fontSize:10,color:'gray'}}>Current Location</Text>
                        <Text style={{fontSize:12,marginTop:5, color:'rgba(3,202,79,1)',fontWeight:'600'}}>{this.state.selectedCountry.name}</Text>
                    </View>
                    <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:25,height:15}} source={{ uri: config.urls.api_url+this.state.selectedCountry.flag_path, isStatic: true }} />
                    </View>
                </View>
                <ListView
                    style={{flex:1}}
                    dataSource={this.state.countryDataSource}
                    removeClippedSubviews={false}
                    renderRow={(data) => this.renderCountryRow(data)}
                />
            </Modal>
        );
    }

    onPressLangRow(data){
        this.setState({selectedLang:data,isLangModalOpen:false});
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
                        <Text style={{fontSize:10,color:'gray'}}>Current Language</Text>
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

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Image style={styles.bg} source={{uri: "background", isStatic: true}} />
                <View style={{flex:1, flexDirection:'column',alignSelf:'stretch',backgroundColor:'transparent'}}>
                    <View style={{flex:0.50,backgroundColor:'transparent',justifyContent:'flex-end',alignItems:'center'}}>
                        <Image style={{width:100,height:100}} resizeMode='contain' source={{ uri: "lang_country", isStatic: true }} />
                        <Text style={styles.textWelcome}>WELCOME !</Text>
                        <Text style={styles.textPleaseChoose}>Please choose country and language to continue</Text>
                    </View>
                    <View style={{flex:0.50,backgroundColor:'transparent',alignItems:'center'}}>
                        <View style={{flexDirection:'row',marginLeft:30,marginRight:30,height:50,marginTop:10}}>
                            <View style={styles.viewLanguageImg}>
                                <Image style={{width:25,height:25,marginRight:10}} source={{ uri: "country_icon", isStatic: true }} />
                            </View>
                            <View style={{flex:85,borderBottomColor:'lightgreen',borderBottomWidth:1}}>
                                <Text style={styles.textLabel}>Country</Text>
                                <TouchableHighlight underlayColor='transparent' onPress={this.onPressCountry.bind(this)} style={{alignItems:'center',marginTop:10}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <View style={{flex:0.15,justifyContent:'center',alignItems:'center'}}>
                                            <Image style={{width:25,height:15}} source={{ uri: config.urls.api_url+this.state.selectedCountry.flag_path}} resizeMode='contain' />
                                        </View>
                                        <Text style={styles.textLanguage}>{this.state.selectedCountry.name}</Text>
                                        <IconF name="angle-down" size={12} style={{flex:0.05}}></IconF>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',marginLeft:30,marginRight:30,height:50,marginTop:40}}>
                            <View style={styles.viewLanguageImg}>
                                <Image style={{width:30,height:25,marginRight:10}} source={{ uri: "lang_icon", isStatic: true }} />
                            </View>
                            <View style={{flex:85,borderBottomColor:'lightgreen',borderBottomWidth:1}}>
                                <Text style={styles.textLabel}>Language</Text>
                                <TouchableHighlight underlayColor='transparent' onPress={this.onPressLanguage.bind(this)} style={{alignItems:'center',marginTop:10}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={styles.textLanguage}>{this.state.selectedLang.name}</Text>
                                        <IconF name="angle-down" size={12} style={{flex:0.05}}></IconF>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={{marginTop:50,alignSelf:'stretch'}}>
                             <TouchableHighlight underlayColor='transparent' onPress={this.onPressContinue.bind(this)} style={styles.btnContinue}>
                                <Text style={styles.textContinue}>Continue</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                {this.renderLanguageModal()}
                {this.renderCountryModal()}
            </View>
        );
    }
}