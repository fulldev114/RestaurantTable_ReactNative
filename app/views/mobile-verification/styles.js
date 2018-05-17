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
    marginTop:5
  },
  textWelcome:{
    color:'black',
    fontSize:24,
    marginTop:10,
    fontWeight:'600'
  },
  textLanguage:{
    color:'black',
    fontSize:12,
    fontWeight:'600',
    flex:0.95
  },
  textLabel:{
    color:'gray',
    fontSize:10
  },
  viewLanguageImg:{
    flex:15,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  btnSendActivationCode:{
    backgroundColor: 'rgba(2,202,79,1)',
    padding: 15,
    alignItems: 'center',
    height: 50,
    marginRight:60,
    marginLeft:60,
    justifyContent: 'center',
    borderRadius:10
  },
  textSendActivationCode:{
    color:'white',
    fontSize:16,
    fontWeight:'600'
  },
  input: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 40,
    fontSize: 14,
    paddingBottom: 0,
    paddingTop: 0
  },
  blackFont: {
    color: '#000',
    fontSize: 15
  },
});

export default styles;