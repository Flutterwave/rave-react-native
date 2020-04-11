import React, { Component } from 'react';
import { StyleSheet, Modal, Text, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class PinModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.pinModal}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.7)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderTopWidth: 5,
              borderTopColor: this.props.secondarycolor,
              width: '90%',
              maxWidth: 400,
              paddingVertical: 40,
              paddingHorizontal: 50,
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              Please enter card pin to continue transaction
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Pin</Text>
              <Text style={{ color: '#999999', fontSize: 16 }}>CARD NUMBER</Text>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: this.props.secondarycolor,
                }}
              >
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <View style={{ paddingTop: 6 }}>
                    <Image source={require('../../assets/icons/locked.png')} />
                  </View>
                  <View>
                    <TextInput
                      autoCorrect={false}
                      keyboardType="numeric"
                      secureTextEntry={true}
                      style={{ fontSize: 20, paddingHorizontal: 10, minWidth: '98%' }}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      onChangeText={pin => this.props.pinEdit(pin)}
                      value={this.props.pin}
                    />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={this.props.confirm} style={{ width: '100%' }}>
              <View
                style={{
                  backgroundColor: this.props.primarycolor,
                  paddingVertical: 15,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>ENTER</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  formGroup: {
    marginVertical: 20,
  },
  label: {
    color: '#ACACAC',
  },
  // input: {
  //   borderBottomWidth: 2,
  //   borderBottomColor: this.props.secondarycolor
  // }
});
