import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    Navigator,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';

import styles from './styles';
import config from '../../helpers/config';
import common from '../../services/common-service';

export default class PresentationPage extends Component {

    constructor(props) {
        super(props);
        let tutImagesPresentation = [];

        this.state = {
            tutImages:tutImagesPresentation,
            selectedImgs:'presentation'
        };
    }

    componentDidMount(){
        this.callSlideImagesAPI();
    }

    callSlideImagesAPI() {
        var self = this;
        common.getSlideImages().then(function (resJson) {
            if (resJson.status == 200) {
                resJson.json().then((slides)=>{
                    console.log(slides);
                    if(slides.status){
                        self.setState({
                            tutImages:slides.data,
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

    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
            />
        );
    }

    onPressSkip(){
        this.props.navigator.push({
            id: 'MobileVerificationPage',
            name: 'MobileVerification',
            data: this.props.data
        });
    }

    renderBottomBtns(index){
        if(this.state.selectedImgs == "presentation" && index == this.state.tutImages.length - 1){
            return(
                <TouchableHighlight underlayColor='transparent' onPress={this.onPressSkip.bind(this)}
                    style={{bottom: 45,backgroundColor:'rgba(3,202,79,1)',height:30,minWidth:150,maxWidth:200,
                    justifyContent:'center',alignItems:'center',borderRadius:5}}>
                    <Text style={{color:'white',fontSize:12,fontWeight:'500'}}>Get Started</Text>
                </TouchableHighlight>
            );
        }else{
            return(
                <TouchableHighlight underlayColor='transparent' onPress={this.onPressSkip.bind(this)}
                        style={{bottom: 50}}>
                    <Text style={{color:'gray',fontSize:12}}>Skip</Text>
                </TouchableHighlight>
            );
        }
    }

    renderTutImages(){
        var returnVals = [];
        for (var i = 0; i < this.state.tutImages.length; i++) {
            var tutImg = this.state.tutImages[i];
            returnVals.push(
                <View style={styles.slide} key={i}>
                    <Image
                        style={styles.bg}
                        resizeMode='stretch'
                        source={{uri: config.urls.api_url+"/"+tutImg.image_path}}
                        indicator={ProgressBar}
                    />
                    {this.renderBottomBtns(i)}
                </View>
            );
        }
        return returnVals;
    }

    renderScene(route, navigator) {
        var self = this;
        return (
            <View style={styles.container}>
                <Swiper style={styles.wrapper} loop={false} renderPagination={renderPagination} >
                    {this.renderTutImages()}
                </Swiper>
            </View>
        );
    }
}

const renderPagination = (index, total, context) => {
    let dots = []
    const ActiveDot = <View style={[{
      backgroundColor:'rgba(3,202,79,1)',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3
    }]} />
    const Dot = <View style={[{
      backgroundColor:'rgba(0,0,0,.2)',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3
    }]} />
    let dot_total = total;
    if(total > 4)
        dot_total = total/2;
    for (let i = 0; i < dot_total; i++) {
      dots.push(i === index % dot_total
        ? React.cloneElement(ActiveDot, {key: i})
        : React.cloneElement(Dot, {key: i})
      )
    }
    return (
      <View pointerEvents='none' style={{ position: 'absolute',bottom: 90,left: 0,right: 0,flexDirection: 'row',flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'transparent'}}>
        {dots}
      </View>
    )
}