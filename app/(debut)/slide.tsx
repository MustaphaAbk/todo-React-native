import { View , Text} from "react-native";

export default function AboutScreen(props:any) {
  return (<View>
    <Text
    style={{fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' , paddingHorizontal: 20 , textTransform: 'uppercase'}}
    >{props.title}</Text>
    <Text style={{marginTop: 30, color: '', textAlign: 'center', paddingHorizontal: 20, marginBottom: 20, fontSize: 16}}>
      {props.description}
    </Text>
  </View>)
}   