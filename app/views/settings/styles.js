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
    backgroundColor:'white'
  },
  viewSettingOption:{
    height:50,
    borderBottomColor:'#eee',
    borderBottomWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  viewSettingInnerOption:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  textStyleTypeOne:{
    color:"#000",
    fontWeight:'500',
    fontSize:13,
    flex:0.70
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
  textLanguageRow:{
    color:'black',
    fontSize:10,
    flex:0.95
  },
  textLanguageRowSelected:{
    color:'black',
    fontSize:12,
    fontWeight:'500',
    flex:0.95
  },
});

export default styles;