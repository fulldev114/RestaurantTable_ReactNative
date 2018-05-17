import {
  StyleSheet,
  Dimensions
} from 'react-native';

var windowSize = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent'
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: windowSize.width,
    height: windowSize.height
  },
  textPleaseChoose:{
    color:'gray',
    fontSize:12,
    marginTop:5,
    marginBottom:60
  },
  textWelcome:{
    color:'black',
    fontSize:24,
    marginTop:10,
    fontWeight:'600'
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
  textLabel:{
    color:'gray',
    fontSize:10
  },
  viewLanguageImg:{
    flex:15,
    justifyContent:'center',
    alignItems:'center'
  },
  btnContinue:{
    backgroundColor: 'rgba(2,202,79,1)',
    padding: 15,
    alignItems: 'center',
    height: 50,
    marginRight:60,
    marginLeft:60,
    justifyContent: 'center',
    borderRadius:10
  },
  textContinue:{
    color:'white',
    fontSize:16,
    fontWeight:'600'
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
  }
});

export default styles;