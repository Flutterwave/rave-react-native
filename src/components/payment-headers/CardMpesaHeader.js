import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from 'react-native-rave/src/components/Header';

export default class CardMpesaHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 'mpesa' };
    this.switchToCard = this.switchToCard.bind(this);
    this.switchToMpesa = this.switchToMpesa.bind(this);
  }

  switchToCard() {
    this.props.page("card");
    this.setState({
      page: "card"
    })
  }

  switchToMpesa() {
    this.props.page("mpesa");
    this.setState({
      page: "mpesa"
    })
  }


  render() {

    return (
      <View>
        {/* <Header /> */}
        <View style={styles.container}>
          <View style={styles.nav}>
            <TouchableOpacity style={{width: '49.5%'}} onPress={this.switchToCard}>
              <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "card") ? "bold" : "normal", borderBottomColor: this.props.secondarycolor, borderBottomWidth: (this.state.page == "card") ? 2 : 1}}>Card</Text>
            </TouchableOpacity>
            <View style={{ width: '1%', marginVertical: 10, borderRightWidth: 1, borderRightColor: this.props.secondarycolor }}></View>
            <TouchableOpacity style={{width: '49.5%'}}onPress={this.switchToMpesa}>
                <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "mpesa") ? "bold" : "normal", borderBottomColor:this.props.secondarycolor, borderBottomWidth: (this.state.page == "mpesa") ? 2 : 1 }}>Mpesa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 0
  },
  nav: {
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    flexDirection: 'row',
    paddingTop: 30,
    justifyContent: 'space-between',
    width: '100%'
  }
});