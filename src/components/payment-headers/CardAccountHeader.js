import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from 'react-native-rave/src/components/Header';

export default class CardAccountHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 'card' };
    this.switchToCard = this.switchToCard.bind(this);
    this.switchToAccount = this.switchToAccount.bind(this);
    this.switchToUssd = this.switchToUssd.bind(this);
  }

  switchToCard() {
    this.props.page("card");
    this.setState({
      page: "card"
    })
  }

  switchToAccount() {
    this.props.page("account");
    this.setState({
      page: "account"
    })
  }

  switchToUssd() {
    this.props.page("ussd");
    this.setState({
      page: "ussd"
    })
  }

  render() {
    return (
      <View>
        {/* <Header /> */}
        <View style={styles.container}>
          <View style={styles.nav}>
            <TouchableOpacity
              style={{
                width: '48.25%'}}
                onPress={this.switchToCard}>
              <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "card") ? "bold" : "normal", borderBottomColor: this.props.secondarycolor, borderBottomWidth: (this.state.page == "card") ? 2 : 1}}>Card</Text>
            </TouchableOpacity>
            <View style={{ width: '1.5%', marginVertical: 10, borderRightWidth: 1, borderRightColor: this.props.secondarycolor }}></View>
            <TouchableOpacity style={{ width: '48.25%'}} onPress={this.switchToAccount}>
              <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "account") ? "bold" : "normal", borderBottomColor:this.props.secondarycolor, borderBottomWidth: (this.state.page == "account") ? 2 : 1 }}>Account</Text>
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