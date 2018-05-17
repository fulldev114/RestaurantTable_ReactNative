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
  viewTop:{
    flexDirection:'row',
    height:40,
    backgroundColor:'rgba(69,69,69,1)',
    justifyContent:'center',
    alignItems:'center'
  },
  viewPrices:{
    marginTop:5,
    marginLeft:20,
    marginRight:20,
    height:80,
    flexDirection:'row'
  },
  viewUnit:{
    flex:0.50,
    borderBottomColor:'#eee',
    borderBottomWidth:1,
    borderTopColor:'#eee',
    borderTopWidth:1,
    borderRightColor:'#eee',
    borderRightWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  viewKilo:{
    flex:0.50,
    borderBottomColor:'#eee',
    borderBottomWidth:1,
    borderTopColor:'#eee',
    borderTopWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  textPrice:{
    color:'rgba(3,202,79,1)',
    fontSize:30,
    fontWeight:'500'
  },
  textUnit:{
    fontSize:18,
    color:'black'
  },
  btnSubscribe: {
    backgroundColor: 'rgba(3,202,79,1)',
    padding:5,
    bottom: 0,
    alignItems: 'center',
    marginBottom:0,
    height:60
  },
  btnUnSubscribe: {
    backgroundColor: '#eee',
    padding:5,
    bottom: 0,
    alignItems: 'center',
    justifyContent:'center',
    marginBottom:0,
    height:50
  },
  bottomSubsBar:{
    justifyContent:'center',
    alignItems: 'center',
    flexDirection:"column"
  },
  bottomUnSubBar:{
    justifyContent:'center',
    alignItems: 'center',
    flexDirection:"row"
  },
  textSubscribe:{
    color:'white',
    fontSize:14,
    fontWeight:'500'
  },
  textUnSubscribe:{
    marginLeft:10,
    color:'red',
    fontSize:14,
    fontWeight:'500'
  },
  textTimeRow:{
    color:'black',
    fontSize:10,
    flex:0.95
  },
  textTimeRowSelected:{
    color:'black',
    fontSize:12,
    fontWeight:'500',
    flex:0.95
  },
  viewTimeRow:{
    flexDirection:'row',
    height:40,
    width:windowSize.width - 50
  },
  modal: {
    alignItems: 'center',
    borderRadius:10,
    flexDirection:'column',
    width:windowSize.width - 50,
    height:windowSize.height - 120
  },
  imgOrangeMoney:{
    width:windowSize.width - 80,
    height:50
  },
  input: {
    position: 'absolute',
    left: 10,
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
  countryModal: {
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
  viewBottomPrices:{
    marginTop:15,
    marginBottom:15,
    marginLeft:10,
    marginRight:10,
    height:60,
    flexDirection:'row'
  },
  viewLowestPrice:{
    flex:0.50,
    flexDirection:'row',
    borderRightColor:'#eee',
    borderRightWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
  viewHighestPrice:{
    flex:0.50,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  textLowestPrice:{
    color: 'rgba(0,165,236,1)',
    fontSize: 10
  },
  textHighestPrice:{
    color: 'red',
    fontSize: 10
  }
});

export default styles;