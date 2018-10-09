import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from 'react-native-rave/src/components/Header';

export default class CardMmobileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 'mobilemoneygh' };
    this.switchToCard = this.switchToCard.bind(this);
    this.switchToMmoney = this.switchToMmoney.bind(this);
  }

  switchToCard() {
    this.props.page("card");
    this.setState({
      page: "card"
    })
  }

  switchToMmoney() {
    this.props.page("mobilemoneygh");
    this.setState({
      page: "mobilemoneygh"
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
                width: '49.5%'}}
                onPress={this.switchToCard}>
              <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "card") ? "bold" : "normal", borderBottomColor: this.props.secondarycolor, borderBottomWidth: (this.state.page == "card") ? 2 : 1}}>Card</Text>
            </TouchableOpacity>
            <View style={{ width: '1%', marginVertical: 10, borderRightWidth: 1, borderRightColor: this.props.secondarycolor }}></View>
            <TouchableOpacity

              style={{
                width: '49.5%'
              }}
              onPress={this.switchToMmoney}>
              <Text style={{ fontSize: 16, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: (this.state.page == "mobilemoneygh") ? "bold" : "normal", borderBottomColor:this.props.secondarycolor, borderBottomWidth: (this.state.page == "mobilemoneygh") ? 2 : 1 }}>Mobile Money</Text>
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