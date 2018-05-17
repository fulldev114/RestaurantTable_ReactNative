import React, { Component } from 'react';
import {
    Text,
    View,
    Navigator,
    TextInput,
    Alert,
    TouchableHighlight,
    TouchableOpacity,
    ListView,
    ScrollView,
    Image,
    AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modalbox';

import styles from './styles';
import GridView from '../../components/grid-view';
import config from '../../helpers/config';
import Product from '../../services/products-service';
import localize from '../../helpers/localize';
import common from '../../services/common-service';
import Subscribe from '../../services/subscribe-service';

export default class CategoryPage extends Component {

    constructor(props) {
        super(props);
        let categories = [
            {"id":1,"category":"Fruites"},
            {"id":2,"category":"Vegitables"},
            {"id":3,"category":"Meats"},
            {"id":4,"category":"Fishes"}
        ];
        let selectedCategory = categories[0];
        let arrProducts = {
            "1":[],
            "2":[],
            "3":[],
            "4":[]
        };

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let countryData = [];

        this.state = {
            categories:categories,
            selectedCategory:selectedCategory,
            ds:ds,
            language:'',
            country: {},
            user_id: '',
            arrProducts: arrProducts,
            rawProducts: [],
            subrProducts: {},
            is_notification: false,
            dataSource: ds.cloneWithRows(arrProducts["1"]),
            isCountryModalOpen:false,
            selectedCountry : {},
            countryDataSource : ds.cloneWithRows(countryData),
            animating: false,
            localize: {
                "categories": "Categories",
                "fruites": "Fruites",
                "vegitables": "Vegitables",
                "meats": "Meats",
                "fishes": "Fishes",
                "current-location": "Current Location"
            }
        }
    }

    componentDidMount(){
        this.setLocalization();
        this.callProductsAPI();
    }

    callCountryAPI() {
        var self = this;
        common.getCountires().then(function (resJson) {
            if (resJson.status == 200) {
                resJson.json().then((countries)=>{
                    if(countries.status){
                        self.setState({
                            countryDataSource: self.state.ds.cloneWithRows(countries.data),
                            isCountryModalOpen: true
                        });
                    }
                });
            }
        })
    }

    setLocalization(){
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
                self.setState({country: country, selectedCountry:country});
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
        AsyncStorage.getItem('user_id').then((data)=>{
            if(data){
                self.setState({user_id: data});
            }
        });
    }

    callProductsAPI(){
        var self = this;
        self.setState({ animating: true });
        Product.getProducts().then(function (resJson) {
            self.setState({ animating: false });
            if (resJson.status == 200) {
                resJson.json().then((products)=>{
                    if(products.status){
                        self.prepareProducts(products.data);
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

    callProductSubscribeAPI(){
        var self = this;
        Subscribe.getProductSubscribe(this.state.user_id).then(function (resJson) {
            if (resJson.status == 200) {
                resJson.json().then((subscribes)=>{
                    if(subscribes.status){
                        self.prepareProductsForSubscribe(subscribes.data);
                    }
                });
            }
        });
    }

    prepareProductsForSubscribe(products){
        let subProducts = products;
        let rawProducts = this.state.rawProducts;
        let subrProducts = {};
        for (var i = 0; i < rawProducts.length; i++) {
            var product = rawProducts[i];
            let subp = subProducts.filter((data)=>{
                return data.product_id == product._id;
            })
            if(subp.length > 0){
                subrProducts[product._id] = true;
            }else{
                subrProducts[product._id] = false;
            }
        }
        let is_notification = this.state.is_notification;
        if(subProducts.length > 0){
            is_notification = true;
        }else{
            is_notification = false;
        }
        this.setState({subrProducts: subrProducts, is_notification: is_notification});
    }

    prepareProducts(products){
        let arrProducts = {
            "1":[],
            "2":[],
            "3":[],
            "4":[]
        };
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if(product.category == "Fruit"){
                arrProducts["1"].push(product);
            }
            if(product.category == "Vegetable"){
                arrProducts["2"].push(product);
            }
            if(product.category == "Meat"){
                arrProducts["3"].push(product);
            }
            if(product.category == "Fish"){
                arrProducts["4"].push(product);
            }
        }
        this.setState({
            rawProducts: products,
            arrProducts: arrProducts,
            dataSource: this.state.ds.cloneWithRows(arrProducts["1"])
        });
        this.callProductSubscribeAPI();
    }

    onPressCountryRow(data){
        AsyncStorage.setItem('country', JSON.stringify(data));
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
                                        onPress={() => self.onPressSetting()}>
                                        <View style={{justifyContent: 'center', alignItems:'center'}}>
                                            <IconF name="cog" size={18} style={{ color: 'white' }} />
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
                                        <Text style={{color:'white',fontWeight:'600',fontSize:18}}> Categories </Text>
                                    </TouchableOpacity>
                                );
                            }
                    }} />
            } />
        );
    }

    onPressCountryOption(){
        this.callCountryAPI();
    }

    onBackFromSettings(data){
        if(data.change_lang){
            this.setLocalization();
            this.callProductsAPI();
            this.onPressTabBtn(this.state.categories[0]);
        }
    }

    onPressSetting(){
        this.setState({isCountryModalOpen:false});
        this.props.navigator.push({
            id: 'SettingsPage',
            name: 'Settings',
            callback: (bdata) => this.onBackFromSettings(bdata)
        });
    }

    onPressTabBtn(category){
        let arrProducts = this.state.arrProducts[category.id];
        this.setState({
            selectedCategory:category,
            isCountryModalOpen:false,
            dataSource: this.state.ds.cloneWithRows(arrProducts)
        });
    }

    getStyles(categoryId,styleType){
        let textTabBtnStyle = styles.textTabBtn;
        let tabBtnStyle = [styles.tabBtn, styles.tabBtnNormal];

        if(categoryId == this.state.selectedCategory.id){
            textTabBtnStyle = styles.textTabBtnSelected;
            tabBtnStyle = [styles.tabBtn, styles.tabBtnSelected];
        }
        if(styleType == "text"){
            return textTabBtnStyle;
        }
        return tabBtnStyle;
    }

    onBackFromDetail(data){
        if(data.change_subscription){
            this.callProductsAPI();
            this.onPressTabBtn(this.state.categories[0]);
        }
        if(data.change_country){
            this.setLocalization();
        }
    }

    onPressProduct(product){
        data = {
            "product": product,
            "is_subscribe": this.state.subrProducts[[product._id]],
            "is_notification": this.state.is_notification
        };
        this.setState({isCountryModalOpen:false});
        this.props.navigator.push({
            id: 'ProductDetailPage',
            name: 'ProductDetail',
            data: data,
            callback: (bdata) => this.onBackFromDetail(bdata)
        });
    }

    renderProductRow(product) {
        return (
            <View style={styles.viewProduct}>
                <TouchableHighlight underlayColor='transparent' onPress={()=>this.onPressProduct(product)} style={{alignItems: 'center',justifyContent: 'center'}}>
                    <View style={{alignItems: 'center',justifyContent: 'center',alignSelf:'stretch'}}>
                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                            <Image style={{width:45,height:45}} resizeMode='contain' source={{ uri: config.urls.api_url+"/"+product.image_path }} />
                        </View>
                        <Text style={{fontSize:9,color:'black',marginTop:10}}>{product.localize[this.state.language].toUpperCase()}</Text>
                    </View>
                </TouchableHighlight>
                { this.state.subrProducts[product._id] &&
                    <Image style={{width:15,height:15,position:'absolute', right:5,}} resizeMode="contain" source={{ uri: "mobile", isStatic: true }} />
                }
            </View>
        );
    }

    renderScene(route, navigator) {
        var self = this;
        var categories = this.state.categories;
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.animating} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <View style={styles.viewTab}>
                    <TouchableHighlight underlayColor='transparent' onPress={()=>this.onPressTabBtn(categories[0])} style={this.getStyles(categories[0].id,"btn")}>
                        <Text style={this.getStyles(categories[0].id,"text")}>{self.state.localize['fruites']}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight  underlayColor='transparent' onPress={()=>this.onPressTabBtn(categories[1])} style={this.getStyles(categories[1].id,"btn")}>
                        <Text style={this.getStyles(categories[1].id,"text")}>{self.state.localize['vegitables']}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight  underlayColor='transparent' onPress={()=>this.onPressTabBtn(categories[2])} style={this.getStyles(categories[2].id,"btn")}>
                        <Text style={this.getStyles(categories[2].id,"text")}>{self.state.localize['meats']}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight  underlayColor='transparent' onPress={()=>this.onPressTabBtn(categories[3])} style={this.getStyles(categories[3].id,"btn")}>
                        <Text style={this.getStyles(categories[3].id,"text")}>{self.state.localize['fishes']}</Text>
                    </TouchableHighlight>
                </View>
                <View style={{flex:1,alignSelf:'stretch',marginTop:20}}>
                    <GridView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderProductRow.bind(this)}
                        numberOfItemsPerRow={3}
                        removeClippedSubviews={false}
                        initialListSize={1}
                        enableEmptySections
                        pageSize={3}
                    />
                </View>
                {this.renderCountryModal()}
            </View>
        );
    }
}
