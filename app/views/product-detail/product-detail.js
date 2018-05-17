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
    Alert,
    ScrollView,
    AsyncStorage,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast';
import { SmoothLine, StockLine } from 'react-native-pathjs-charts'

import styles from './styles';
import config from '../../helpers/config';
import Product from '../../services/products-service';
import common from '../../services/common-service';
import Subscribe from '../../services/subscribe-service';
import localize from '../../helpers/localize';

export default class ProductDetailPage extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        let time24Data = [];
        let time12Data = [];

        for (var index = 0; index < 24; index++) {
            let strTime = index.toString();
            if(index.toString().length == 1){
                strTime = "0"+strTime;
            }
            time24Data.push({"time":strTime+":00","id":index});
        }

        for (var index = 0; index < 12; index++) {
            let strTime = index.toString();
            if(index.toString().length == 1){
                strTime = "0"+strTime;
            }
            time12Data.push({"time":strTime+":00 AM","id":index});
        }
        time12Data.push({"time":"12:00 PM","id":12});
        for (var index = 1; index < 12; index++) {
            let strTime = index.toString();
            if(index.toString().length == 1){
                strTime = "0"+strTime;
            }
            time12Data.push({"time":strTime+":00 PM","id":index+12});
        }

        let timeData = time24Data;
        var selectedTime = timeData[2];
        let countryData = [];

        let flexBottom = 0.50;
        if(this.props.data.is_notification){
            flexBottom = 0.20;
        }

        this.state = {
            confirmationCode:"",
            user_id: "",
            product_id: this.props.data.product._id,
            price_unit: 0,
            price_kilo: 0,
            high_price: 0,
            low_price: 0,
            avg_price: 0,
            is_notification : this.props.data.is_notification,
            is_subscribe: !this.props.data.is_subscribe,
            ds:ds,
            view_count: 0,
            contentOffsetY: 0,
            flexBottom: flexBottom,
            country_id : "",
            language: "",
            currentMonth: "",
            isTimeModalOpen: false,
            change_country: false,
            change_subscription: false,
            selectedTime : selectedTime,
            timeDataSource: ds.cloneWithRows(timeData),
            formatType: '24',
            isCountryModalOpen:false,
            selectedCountry : {},
            countryDataSource : ds.cloneWithRows(countryData),
            animating: false,
            chartData: [[]],
            subscription_amount: 1,
            time24Data: time24Data,
            time12Data: time12Data,
            listViewKey : Math.random(),
            localize: {
                "views": "Views",
                "today": "Today",
                "unit": "Unit",
                "kilo": "Kilo",
                "subscribe": "Subscribe",
                "unsubscribe": "Unsubscribe",
                "current-location": "Current Location",
                "no-prices-available-for-today": "No Prices Available For Today",
                "no-prices-available-for-this-product": "No Prices Available For This Product"
            }
        }
    }

    componentDidMount(){
        var self = this;
        AsyncStorage.getItem('language').then((data)=>{
            if(data){
                let language = JSON.parse(data);
                self.setState({language: language.name});
            }
        });
        AsyncStorage.getItem('country').then((data)=>{
            if(data){
                let country = JSON.parse(data);
                let country_id = country._id;
                self.setState({country_id: country_id, selectedCountry:country});
                self.callProductDetailAPI(country_id);
            }
        });
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
        AsyncStorage.getItem('config').then((data)=>{
            if(data){
                let config = JSON.parse(data);
                let sub_amount = config.subscription_amount;
                self.setState({subscription_amount:sub_amount});
            }
        });
        AsyncStorage.getItem('user_id').then((data)=>{
            if(data){
                self.setState({user_id: data});
            }
        });
        self.prepareTimeData();
    }

    prepareTimeData(){
        var self = this;
        AsyncStorage.getItem('timeFormat').then((format) => {
            let timeData = self.state.time24Data;
            let formatType = '24';
            if(format){
                if(format == '24'){
                    timeData = self.state.time24Data;
                }else{
                    timeData = self.state.time12Data;
                }
                formatType = format;
            }
            self.setState({timeDataSource:self.state.ds.cloneWithRows(timeData), formatType:formatType});
        });
    }

    callCountryAPI() {
        var self = this;
        common.getCountires().then(function (resJson) {
            if (resJson.status == 200) {
                console.log(resJson);
                resJson.json().then((countries)=>{
                    if(countries.status){
                        self.setState({
                            countryDataSource: self.state.ds.cloneWithRows(countries.data),
                            isCountryModalOpen: true,
                            isTimeModalOpen:false
                        });
                    }
                });
            }
        })
    }

    callProductDetailAPI(country_id){
        var self = this;
        self.setState({ animating: true });
        let product = self.props.data.product;
        console.log(product);
        Product.getProductDetail(product._id, country_id).then(function (resJson) {
            self.setState({ animating: false });
            console.log(resJson);
            if (resJson.status == 200) {
                resJson.json().then((detail)=>{
                    if(detail.status){
                        self.setState({view_count:detail.view_count});
                        self.prepareDetail(detail.data);
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

    prepareDetail(products){
        var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        this.setState({currentMonth: monthNames[new Date().getMonth()]});

        if(products.length > 0){
            let today_date = new Date();
            let month = today_date.getMonth() + 1;
            let day = today_date.getDate();
            let fMonth = month.toString().length > 1 ? month : "0" + month.toString();
            let fDay = day.toString().length > 1 ? day : "0" + day.toString();
            let formattedDate = today_date.getFullYear() + "-" + fMonth + "-";
            formattedDate = formattedDate + fDay + "T00:00:00.000Z";
            let product = products.filter((data)=>{
                return data.price_date == formattedDate;
            });
            if(product.length > 0){
                let selProduct = product[0];
                this.setState({price_kilo:selProduct.price_usd, price_unit:selProduct.price_usd});
            }else{
                this.toast.show(this.state.localize['no-prices-available-for-today']);
            }
            let data = this.state.chartData;
            let prices = [];
            for (var i = 0; i < products.length; i++) {
                let product = products[i];
                let date = new Date(product.price_date);
                if(date.getMonth()+1 == new Date().getMonth()+1){
                    prices.push(Number(product.price_usd));
                    data[0].push({"x":date.getDate(),"y":product.price_usd});
                }
            }
            let high_price = 0;
            let low_price = 0;
            let avg_price = 0;
            if(prices.length > 0){
                high_price = Math.max.apply(Math, prices);
                low_price = Math.min.apply(Math, prices);
                avg_price = Math.round(prices.reduce((p,c,_,a) => p + c/a.length,0));
            }
            this.setState({chartData:data, high_price: high_price, low_price: low_price, avg_price: avg_price});
        }else{
            this.toast.show(this.state.localize['no-prices-available-for-this-product']);
        }
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
                                return (
                                    <TouchableOpacity style={{ marginRight: 15, flex:1, justifyContent: 'center', alignItems:'center' }}
                                        onPress={() => self.onPressCountryOption()}>
                                        <View style={{justifyContent: 'center', alignItems:'center',flexDirection:'row'}}>
                                            <Image style={{width:23,height:15,marginRight:5}} source={{ uri: config.urls.api_url+self.state.selectedCountry.flag_path}} />
                                            <IconF name="angle-down" size={14} style={{color:'white'}}></IconF>
                                        </View>
                                    </TouchableOpacity>
                                );
                            },
                            Title(route, navigator, index, navState) {
                                return (
                                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{color:'white',fontWeight:'600',fontSize:18}}> {self.props.data.product.localize[self.state.language]} </Text>
                                    </TouchableOpacity>
                                );
                            }
                    }} />
            } />
        );
    }

    onPressBack(){
        this.props.route.callback({
            "change_country": this.state.change_country,
            "change_subscription": this.state.change_subscription
         });
        this.props.navigator.pop();
    }

    onPressSubscribe(){
         this.setState({isTimeModalOpen:true, isCountryModalOpen:false});
    }

    onPressYesFromUnsubscribe(){
        var self = this;

        let send_data = {
            product_id: this.state.product_id,
            user_id: this.state.user_id,
            option: 'unsubscribe'
        }

        this.setState({ animating: true, change_subscription:true });

        Subscribe.subscribeProduct(send_data).then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((detail)=>{
                    if(detail.status){
                        let is_notification = self.props.data.is_notification;
                        if(detail.data.length > 0){
                            is_notification = true;
                        }else{
                            is_notification = false;
                        }
                        let flexBottom = 0.50;
                        if(is_notification){
                            flexBottom = 0.20;
                        }
                        self.setState({is_subscribe: true, is_notification:is_notification, flexBottom:flexBottom});
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

    onPressUnSubscribe(){
        Alert.alert(
            'Unsubscribe Product',
            'Are you sure want to unsubscribe the notification for this product ?',
            [
                { text: 'No', onPress: () => console.log('OK Pressed') },
                { text: 'Yes', onPress: () => this.onPressYesFromUnsubscribe() }
            ]
        )
    }

    onPressCountryOption(){
        this.callCountryAPI();
    }

    renderBottomBar(){
        let stSub = this.state.is_subscribe;
        if(stSub){
            return (
                <TouchableHighlight underlayColor='transparent' onPress={()=>this.onPressSubscribe()} style={styles.btnSubscribe}>
                    <View style={styles.bottomSubsBar}>
                        <Image style={{width:80,height:30}} resizeMode="contain" source={{ uri: "subscribe", isStatic: true }} />
                        <Text style={styles.textSubscribe}>{this.state.localize['subscribe']} </Text>
                    </View>
                </TouchableHighlight>
            );
        }else{
            return (
                <TouchableHighlight underlayColor='transparent' onPress={()=>this.onPressUnSubscribe()} style={styles.btnUnSubscribe}>
                    <View style={styles.bottomUnSubBar}>
                        <Image style={{width:20,height:40}} resizeMode="contain" source={{ uri: "unsubscribe", isStatic: true }} />
                        <Text style={styles.textUnSubscribe}>{this.state.localize['unsubscribe']}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    onPressTimeRow(data,rowId){
        let contentOffsetY = 0;
        if(rowId >= 4){
            contentOffsetY = (rowId * 40) - 40;
        }
        this.setState({selectedTime:data, listViewKey: Math.random(), contentOffsetY:contentOffsetY});
    }

    renderTimeRow(data, rowId){
        var stripColor = "white";
        var iconColor = "white";
        var textTimeStyle = styles.textTimeRow;
        if(this.state.selectedTime.id == data.id){
            stripColor = "green";
            iconColor = "green";
            textTimeStyle =  styles.textTimeRowSelected;
        }
        return (
            <View style={styles.viewTimeRow}>
                <View style={{flex:0.05}}>
                    <View style={{width:3,height:40,backgroundColor:stripColor}}></View>
                </View>
                <View style={{flex:0.90,justifyContent:'center',alignItems:'center', borderBottomColor:'lightgray',borderBottomWidth:1,height:40}}>
                    <TouchableHighlight underlayColor='transparent' onPress={()=> this.onPressTimeRow(data, rowId)} style={{alignItems:'center',justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={textTimeStyle}>{data.time}</Text>
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

    onFocusConfirmationCode(){
        this.setState({flexBottom:0.50});
    }

    onEndEditingConfirmationCode(){
        let flexBottom = 0.50;
        if(this.state.is_notification){
            flexBottom = 0.20;
        }
        this.setState({flexBottom:flexBottom});
    }

    renderSubscribeModal(){

        return (
            <Modal style={styles.modal} swipeToClose={false} isOpen={this.state.isTimeModalOpen} position={"center"}>
                <View style={{flex:0.50}}>
                    <View style={{flexDirection:'row',height:60}}>
                        <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                            <IconF name={'bell'} size={24} style={{color:'rgba(3,202,79,1)'}}></IconF>
                        </View>
                        <View style={{flex:0.80,justifyContent:'center',alignItems:'flex-start'}}>
                            <Text style={{fontSize:12,color:'rgba(3,202,79,1)',fontWeight:'500'}}>When do you want to receive the notification ?</Text>
                            <Text style={{fontSize:10,marginTop:5, color:'gray'}}>{this.state.formatType} hours time format(you can change in settings)</Text>
                        </View>
                    </View>
                    <ListView
                        key={this.state.listViewKey}
                        style={{flex:1}}
                        contentOffset={{x: 0, y: this.state.contentOffsetY}}
                        dataSource={this.state.timeDataSource}
                        removeClippedSubviews={false}
                        renderRow={(data,sectionId, rowId) => this.renderTimeRow(data,rowId)}
                    />
                </View>
                <View style={{flex:this.state.flexBottom, alignSelf:'stretch'}}>
                    <ScrollView  contentContainerStyle={{flex:1,alignItems:'center',justifyContent:'flex-end',alignSelf:'stretch'}}>
                        {!this.state.is_notification &&
                            <Text style={{fontSize:14,color:"rgba(3,202,79,1)",marginBottom:10}}>WANT UNLIMITED NOTIFICATIONS ?</Text>
                        }
                        {!this.state.is_notification &&
                            <Text style={{fontSize:16,color:"black",marginBottom:5}}>
                                {this.state.subscription_amount}$
                                <Text style={{fontSize:12,color:'#ccc'}}> / month</Text>
                            </Text>
                        }
                        {!this.state.is_notification &&
                            <TouchableHighlight underlayColor='transparent' style={{height:50,marginBottom:5,justifyContent:'center',alignItems:'center',borderRadius:5}}>
                                <Image style={styles.imgOrangeMoney} resizeMode="contain" source={{ uri: 'orange_money', isStatic: true }} />
                            </TouchableHighlight>
                        }
                        <View style={{height:40,backgroundColor:'#eee',flexDirection:'row',marginLeft:15,marginRight:15,marginBottom:20,borderRadius:5}}>
                            <View style={{justifyContent:'center',alignItems:'flex-start',height:40,flex:0.90}}>
                                <TextInput
                                    style={[styles.input, styles.blackFont]}
                                    placeholder="Enter Confirmation Code"
                                    returnKeyType={"done"}
                                    autoCapitalize="none"
                                    keyboardType={"phone-pad"}
                                    onFocus={()=>this.onFocusConfirmationCode()}
                                    onEndEditing={()=>this.onEndEditingConfirmationCode()}
                                    placeholderTextColor="#CCC"
                                    value={this.state.confirmationCode}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.setState({ confirmationCode: text })}
                                    editable={true}
                                />
                            </View>
                            <View style={{flex:0.10}}>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center'}}>
                            <TouchableHighlight underlayColor='transparent' style={{height:50,flex:0.50,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(3,202,79,1)',borderBottomLeftRadius:10}}
                            onPress={()=>this.onPressSaveFromSubscribeModal()}>
                                <Text style={{color:'#fff'}}>Save</Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor='transparent' style={{height:50,flex:0.50,justifyContent:'center',alignItems:'center',backgroundColor:'#4B4B4B',borderBottomRightRadius:10}}
                            onPress={()=>this.onPressCancelFromSubscribeModal()}>
                                <Text style={{color:'#fff'}}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </View>
                <KeyboardSpacer/>
            </Modal>
        );
    }

    onPressSaveFromSubscribeModal(){
        var self = this;

        let selectedTime = this.state.selectedTime;
        let time = this.state.time24Data.filter((data) =>{
            return data.id == selectedTime.id;
        });
        let send_data = {
            subscribe_time: time[0].time,
            product_id: this.state.product_id,
            user_id: this.state.user_id,
            amount: this.state.subscription_amount,
            option: 'subscribe'
        }

        this.setState({ animating: true, change_subscription:true });

        Subscribe.subscribeProduct(send_data).then(function (resJson) {
            self.setState({ animating: false });
            self.onPressCancelFromSubscribeModal();
            if (resJson.status == 200) {
                resJson.json().then((detail)=>{
                    if(detail.status){
                        self.setState({is_subscribe: false});
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

    onPressCancelFromSubscribeModal(){
        this.setState({isCountryModalOpen:false, isTimeModalOpen:false});
    }

    onPressCountryRow(data){
        AsyncStorage.setItem('country', JSON.stringify(data));
        this.setState({selectedCountry:data,isCountryModalOpen:false,change_country:true});
        this.callProductDetailAPI(data._id);
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
            <Modal style={styles.countryModal} swipeToClose={false} isOpen={this.state.isCountryModalOpen} position={"center"}>
                <View style={{flexDirection:'row',height:60}}>
                    <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                        <IconF name={'check'} size={22} style={{color:'rgba(3,202,79,1)'}}></IconF>
                    </View>
                    <View style={{flex:0.60,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={{fontSize:10,color:'gray'}}>{this.state.localize['current-location']}</Text>
                        <Text style={{fontSize:12,marginTop:5, color:'rgba(3,202,79,1)',fontWeight:'600'}}>{this.state.selectedCountry.name}</Text>
                    </View>
                    <View style={{flex:0.20,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:25,height:15}} source={{ uri: config.urls.api_url+this.state.selectedCountry.flag_path}} />
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

    getTodayDate(){
        let today_date = new Date();
        let month = today_date.getMonth()+1;
        let date = today_date.getDate();
        let fMonth = month.toString().length > 1 ? month : "0"+month.toString()
        let fDate = date.toString().length > 1 ? date : "0"+date.toString()
        let formattedDate = fDate+"/"+fMonth+ "/"+today_date.getFullYear();
        return formattedDate;
    }

    getCurrentMonthDays(){
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        var names = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
        var date = new Date(year, month-1, 1);
        var result = [];
        while (date.getMonth() == month-1) {
            let day = date.getDate();
            let fday = day.toString().length > 1 ? day : '0'+day.toString();
            result.push({day:fday,name:names[date.getDay()]});
            date.setDate(date.getDate()+1);
        }
        return result;
    }

    renderDates(){
        let days = this.getCurrentMonthDays();
        var returnVals = [];
        for (var i = 0; i < days.length; i++) {
            var day = days[i];
            returnVals.push(
                <TouchableHighlight key={i} underlayColor='transparent' style={{width:43, justifyContent: 'center', alignItems:'center'}}>
                    <View style={{justifyContent: 'center', alignItems:'center'}}>
                        <Text style={{color:'#000'}}>{day.day}</Text>
                        <Text style={{color:'#BBB', fontSize:10}}>{day.name}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
        return returnVals;
    }

    renderChart(){
        let data = this.state.chartData;
        let chartWidth = 0;
        if(this.state.chartData[0].length > 7 && this.state.chartData[0].length < 20){
            chartWidth = 500;
        } else if(this.state.chartData[0].length > 20){
            chartWidth = 800;
        } else{
            chartWidth = Dimensions.get('window').width - 40;
        }
        let options = {
            width: chartWidth,
            height: 120,
            color: '#1ccf60',
            margin: {
                left: 20,
                top: 10,
                bottom: 20,
                right: 15
            },
            animate: {
                type: 'delayed',
                duration: 200
            },
            axisX: {
                showAxis: false,
                showLines: false,
                showLabels: true,
                showTicks: false,
                zeroAxis: false,
                orient: 'bottom',
                tickCount: data[0].length,
                label: {
                    fontFamily: 'Arial',
                    fontSize: 12,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            axisY: {
                showAxis: false,
                showLines: false,
                showLabels: false,
                showTicks: false,
                zeroAxis: false,
                orient: 'left',
                tickCount: 2,
                min: 0,
                label: {
                    fontFamily: 'Arial',
                    fontSize: 10,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        }
        if(this.state.chartData[0].length > 2){
            return (
                <View style={{ marginTop: 30, height:160 }}>
                    <Text style={{
                        position:'absolute',
                        top:0,
                        bottom:0,
                        fontSize:10,
                        marginLeft:10
                    }}>
                        {Math.ceil(this.state.high_price/100)*100}
                    </Text>
                    <Text style={{
                        position:'absolute',
                        bottom:40,
                        fontSize:10,
                        marginLeft:10
                    }}>
                        {Math.floor(this.state.low_price/100)*100}
                    </Text>
                    <ScrollView horizontal={true} contentContainerStyle={{height:120, flexDirection:'column'}}>
                        <View>
                            <StockLine data={data} options={options} xKey='x' yKey='y' />
                        </View>
                        {/*<View style={{flexDirection:'row' ,backgroundColor:'#f2f2f2', height:50}}>
                            {this.renderDates()}
                        </View>*/}
                    </ScrollView>
                </View>
            )
        }else{
            return(
                <View style={{ marginTop: 0, height:150, justifyContent:'center', alignItems:'center' }}>
                    <Text style={{color:'#1ccf60'}}> No prices available to display chart </Text>
                </View>
            );
        }
    }

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <View style={styles.viewTop}>
                    <View style={{flex:0.15,justifyContent:'center',alignItems:'center'}}>
                        <IconF name={"eye"} size={16} style={{color:'white'}}></IconF>
                    </View>
                    <View style={{flex:0.50,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={{color:'white',fontSize:10}}>{this.state.view_count} {this.state.localize['views']}</Text>
                    </View>
                    <View style={{flex:0.35,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:10}}>{this.state.localize['today']} : {this.getTodayDate()}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{}}>
                    <View style={{flexDirection:'row',height:80}}>
                        <View style={{flex:0.25,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:50,height:50}} resizeMode='contain' source={{ uri: config.urls.api_url+"/"+self.props.data.product.image_path}} />
                        </View>
                        <View style={{flex:0.60,justifyContent:'center',alignItems:'flex-start'}}>
                            <Text style={{color:'black',fontSize:16}}>{self.props.data.product.localize[self.state.language]}</Text>
                        </View>
                        <View style={{flex:0.15,justifyContent:'center',alignItems:'center'}}>
                            {!self.state.is_subscribe &&
                                <Image style={{width:15,height:15}} resizeMode="contain" source={{ uri: "mobile", isStatic: true }} />
                            }
                        </View>
                    </View>
                    <View style={styles.viewPrices}>
                        <View style={styles.viewUnit}>
                            <Text style={styles.textPrice}>{this.state.price_unit} $</Text>
                            <Text style={styles.textUnit}>{this.state.localize['unit']}</Text>
                        </View>
                        <View style={styles.viewKilo}>
                            <Text style={styles.textPrice}>{this.state.price_kilo} $</Text>
                            <Text style={styles.textUnit}>{this.state.localize['kilo']}</Text>
                        </View>
                    </View>
                    <View style={{marginTop:20, flexDirection:'row'}}>
                        <Text style={{flex:0.60, fontSize:12, marginLeft:10}}>Monthly Statistics</Text>
                        <View style={{flex:0.40, alignItems:'flex-end', marginRight:10}}>
                            <Text style={{fontSize:8}}>Average Price : {this.state.currentMonth}</Text>
                            <Text>
                                <Text style={{fontSize:8, color:'#1ccf60'}}>{this.state.avg_price}$ </Text>
                                <Text style={{fontSize:8, marginLeft:10, color:'#CCC'}}>Kilo</Text>
                            </Text>
                        </View>
                    </View>
                    {this.renderChart()}
                    <View style={styles.viewBottomPrices}>
                        <View style={styles.viewLowestPrice}>
                            <View style={{alignItems:'center', justifyContent:'center', flex:0.20}}>
                                <Image style={{width:15, height:20}} resizeMode="contain" source={{ uri: 'down_arrow_blue', isStatic: true }} />
                            </View>
                            <View style={{alignItems:'flex-start', justifyContent:'center', flex:0.80}}>
                                <Text style={styles.textLowestPrice}>Lowest Price : {this.state.currentMonth}</Text>
                                <Text style={{marginTop:5}}>
                                    <Text style={{fontSize:10, color:'#000'}}>{this.state.low_price}$ </Text>
                                    <Text style={{fontSize:8, marginLeft:10, color:'#CCC'}}>Kilo</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.viewHighestPrice}>
                            <View style={{alignItems:'center', justifyContent:'center', flex:0.20}}>
                                <Image style={{width:15, height:20}} resizeMode="contain" source={{ uri: 'up_arrow_red', isStatic: true }} />
                            </View>
                            <View style={{alignItems:'flex-start', justifyContent:'center', flex:0.80}}>
                                <Text style={styles.textHighestPrice}>Highest Price : {this.state.currentMonth}</Text>
                                <Text style={{marginTop:5}}>
                                    <Text style={{fontSize:10, color:'#000'}}>{this.state.high_price}$ </Text>
                                    <Text style={{fontSize:8, marginLeft:10, color:'#CCC'}}>Kilo</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {this.renderBottomBar()}
                {this.renderSubscribeModal()}
                {this.renderCountryModal()}
                <KeyboardSpacer/>
                <Toast ref={(ref)=> this.toast = ref} position='center'/>
            </View>
        );
    }
}