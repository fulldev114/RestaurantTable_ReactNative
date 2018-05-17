import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

var windowSize = Dimensions.get('window');
var headerMargin = Platform.OS == 'ios' ? 60 : 55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:headerMargin,
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  viewTab:{
    flexDirection:'row',
    height:45,
    backgroundColor:'rgba(3,189,75,1)',
    justifyContent:'center',
  },
  textTabBtn:{
    color:'white',
    fontSize:12
  },
  textTabBtnSelected:{
    color:'black',
    fontSize:12
  },
  tabBtn:{
    flex:0.25,
    justifyContent:'center',
    alignItems:'center'
  },
  tabBtnNormal:{
    backgroundColor:'rgba(3,189,75,1)'
  },
  tabBtnSelected:{
    backgroundColor:'white'
  },
  viewProduct: {
    backgroundColor: 'white',
    width:windowSize.width/3,
    height:windowSize.width/3 - 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20
  },
  textCountryRow:{
    color:'black',
    fontSize:10,
    flex:0.80
  },
  textCountryRowSelected:{
    color:'black',
    fontSize:12,
    fontWeight:'500',
    flex:0.80
  },
  modal: {
    alignItems: 'center',
    borderRadius:10,
    width:windowSize.width - 50,
    height:windowSize.height - 100
  },
  viewLangRow:{
    flexDirection:'row',
    height:40,
    width:windowSize.width - 50
  },
  textLabel:{
    color:'gray',
    fontSize:10
  },
  viewLanguageImg:{
    flex:15,
    justifyContent:'center',
    alignItems:'center'
  },
  textLanguage:{
    marginLeft:10,
    color:'black',
    fontSize:12,
    fontWeight:'600',
    flex:0.95
  },
});

export default styles;