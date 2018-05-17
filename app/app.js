import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StatusBar,
  Platform
} from 'react-native';

import SplashPage from './views/splash/splash';
import LanguageSelectionPage from './views/language-selection/language-selection';
import MobileVerificationPage from './views/mobile-verification/mobile-verification';
import ActivationCodePage from './views/mobile-verification/activation-code';
import CategoryPage from './views/category/category';
import ProductDetailPage from './views/product-detail/product-detail';
import SettingsPage from './views/settings/settings';
import PresentationPage from './views/presentation/presentation';

export default class eatables extends Component {

  constructor(props){
      super(props);
      if(Platform.OS == "android"){
        StatusBar.setBackgroundColor("rgba(3,202,79,1)");
      }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ id: 'SplashPage', name: 'Splash' }}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return {
            ...Navigator.SceneConfigs.PushFromRight,
            gestures:false
          };
        } } />
    );
  }

  renderScene(route, navigator) {
    var routeId = route.id;

    if (routeId === 'SplashPage') {
      return (
        <SplashPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'LanguageSelectionPage') {
      return (
        <LanguageSelectionPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'MobileVerificationPage') {
      return (
        <MobileVerificationPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'ActivationCodePage') {
      return (
        <ActivationCodePage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'CategoryPage') {
      return (
        <CategoryPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'ProductDetailPage') {
      return (
        <ProductDetailPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'SettingsPage') {
      return (
        <SettingsPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }

    if (routeId === 'PresentationPage') {
      return (
        <PresentationPage
          navigator={navigator} route={route} data={route.data} {...route.passProps} />
      );
    }
  }
}