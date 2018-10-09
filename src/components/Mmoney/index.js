import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Picker, DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {network: 'Select Network', phonenumber: (this.props.phone == null) ? '' : this.props.phone, status: "", chargeResponseMessage: '', voucher: '', voucherErr: 'none', networkErr: 'none', phonenumberErr: 'none', flwRef: "", loading: false, phone: (this.props.phone == null) ? '' : this.props.phone };

    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.mounted = false;
  }


  // Performs a check on the state of the network, phone, voucher fields, if they are filled as required
  check() {
    this.setState({
      networkErr: 'none', phonenumberErr: 'none', voucherErr: 'none'
    })
    if (this.state.network === "Select Network") {
      this.setState({
        networkErr: 'flex'
      })
    } else if (this.state.phonenumber.length < 3) {
      this.setState({
        phonenumberErr: 'flex'
      })
    }else if(this.state.voucher === "" && this.state.network === "Vodafone") {
        this.setState({
          voucherErr: 'flex'
        })
    } else if (this.state.network === "MTN" || this.state.network === "Tigo" || this.state.network === "Vodafone") {
      if (Number(this.props.amount) < 10 ) {
        Alert.alert(
          'Alert',
          'Amount can\'t be less than 1GHS',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              }) },
          ],
          { cancelable: false }
        )
      } else {
        return true
      }
    } else {
      return true
    }
  }

  // Sends payload to Flutterwave
  charge() {
    //Set button to loading
    this.setState({
      loading: true
    })
    
    // Initiate the charge
    let payload = {
      "network": this.state.network,
      "phonenumber": this.state.phonenumber,
      "voucher": this.state.voucher,
      "payment_type": "mobilemoneygh"
    }

    // Sets the payload to be initiated by rave charge endpoint based on the selected network
    if (this.state.network === "Vodafone") {
      payload = {
        "network": this.state.network,
        "phonenumber": this.state.phonenumber,
        "voucher": this.state.voucher,
        "payment_type": "mobilemoneygh"
      }
    }else {
      payload = {
        "network": this.state.network,
        "phonenumber": this.state.phonenumber,
        "voucher": "",
        "payment_type": "mobilemoneygh"
      }
    }

    // this initiates the charge request
    this.props.rave.initiatecharge(payload).then((res) => {
      // Check for charge status
      if (res.data.status === "success-pending-validation" && res.data.chargeResponseCode === "02") {
        this.setState({
          loading: false
        })
        // A check to return a response with further instructions to the user based on selected network
          if (this.state.network === "MTN") {
              Alert.alert(
              'Follow the instruction below to complete your MTN transaction',
              '1. Dial *170#\n2. Choose Option 7: Wallet\n3. Choose Option 3: My Approvals\n4. Enter your MOMO pin to retrieve your pending approval list\n5. Choose a pending transaction\n6. Choose option 1 to approve\n7. Tap button to continue',
              [{
                  text: 'Ok',
                  onPress: () => this.setState({
                    loading: false,
                    phonenumber: "",
                    network: "Select Network"
                  })
                },
              ], {
                cancelable: false
              }
            )
          }else if (this.state.network === "Tigo") {
              Alert.alert(
              'Follow the instruction below to complete your Tigo transaction',
              '1. Dial 5015#\n2. Select the transaction to approve and click on send.\n3. Select YES to confirm your payment.',
              [{
                  text: 'Ok',
                  onPress: () => this.setState({
                    loading: false,
                    phonenumber: "",
                    network: "Select Network"
                  })
                },
              ], {
                cancelable: false
              }
            )
          }else if (this.state.network === "Vodafone") {
              Alert.alert(
              '',
              'Transaction processing',
              [{
                  text: 'Ok',
                  onPress: () => this.setState({
                    loading: false,
                    phonenumber: "",
                    network: "Select Network"
                  })
                },
              ], {
                cancelable: false
              }
            )
          }else{
            Alert.alert(
              '',
              'Error',
              [{
                text: 'Ok',
                onPress: () => this.setState({
                  loading: false
                })
              }, ], {
                cancelable: false
              }
            )
          }
      }else if(res.data.status === "successful"){
        Alert.alert(
          '',
          'Transaction Successfully Completed',
          [{
              text: 'Ok',
              onPress: () => this.setState({
                loading: false,
                phonenumber: "",
                network: "Select Network"
              })
            },
          ], {
            cancelable: false
          }
        )
      }
    }).catch((e) => {
      this.setState({
        loading: false
      })
      this.props.onFailure(e);
    })

  }


  // The Pay button handler
  pay() {
    if (this.check()) {
      this.setState({
        loading: true
      })

      this.props.rave.getAccountFees({ amount: this.props.amount, currency: this.props.currency }).then((resp) => {
        // Alert to display the charged amount in the GHS
        Alert.alert(
          '',
          'You will be charged a total of ' + this.props.currency + resp.data.charge_amount + ' . Do you want to continue?',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              }) },
            {
              text: 'Yes', onPress: () => this.charge()
            },
          ],
          { cancelable: false }
        )

      }).catch((err) => {
        this.setState({
          loading: false
        })
        this.props.onFailure(err);
      })
    }
  }


// This is the render function to render the payment interface
  render() {

    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 25,
        marginTop: 40,
        paddingBottom: 50,
        height: '100%'
      },
      label: {
        color: "#ACACAC"
      },
      input: {
        borderBottomWidth: 2,
        borderBottomColor: this.props.secondarycolor
      },
      formGroup: {
        marginBottom: 20,
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY</Text>;

    let Vodafone = <View></View>
    let Voucher = <View></View>

    // This checks the network selected and displays an instruction and also the voucher input field if it is Vodafone
    if (this.state.network === "Vodafone") {
      Vodafone = (<View style={styles.formGroup}>
        <Text style={{ color: '#3498DB', fontSize: 15, fontWeight: 'bold', marginTop: 5 }}>
          Please follow the instruction below to get voucher code to complete Vodafone transaction
        </Text>
        <Text style = {{color: '#3498DB', fontSize: 12, fontWeight: 'bold'}}>
          1. Dial * 110# to generate your transaction voucher.
        </Text>
        <Text style = {{color: '#3498DB', fontSize: 12, fontWeight: 'bold'}}>
          2.Select Option 6, to generate the voucher.
        </Text>
        <Text style = {{color: '#3498DB', fontSize: 12, fontWeight: 'bold'}}>
          3.Enter your PIN in next prompt.
        </Text>
        <Text style = {{color: '#3498DB', fontSize: 12, fontWeight: 'bold'}}>
          4.Input the voucher generated in the payment modal.
        </Text>
      </View>)
      
      Voucher = (<View style={styles.formGroup}>
        <Text style={styles.label}>Voucher</Text>
        <View style={styles.input}>
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
              <TextInput
                autoCorrect={false}
                editable={(this.state.loading) ? false : true}
                keyboardType="numeric"
                style={{ fontSize: 20, paddingHorizontal: 10, minWidth: "100%" }}
                underlineColorAndroid='rgba(0,0,0,0)'
                maxLength={10}
                onChangeText={(voucher) => this.setState({ voucher })}
                value={this.state.voucher}
              />
            </View>
        </View>
        <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.voucherErr, fontWeight: 'bold', marginTop: 5 }}>Enter your voucher code</Text>
      </View>)
    }
    
    

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

    }
    // this returns the Mobile Money payment form
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <View style={{ flex: 1 }}>
            {Vodafone}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Network</Text>
              <View style={styles.input}>
                <Picker
                  mode="dropdown"
                  placeholder="Select Network"
                  selectedValue={this.state.network}
                  style={{   width: '100%' }}
                  onValueChange={(itemValue, itemIndex) => this.setState({ network: itemValue })}>
                  <Picker.Item label="Select Network" value="Select Network"/>
                  <Picker.Item label="MTN" value="MTN" />
                  <Picker.Item label="Tigo" value="Tigo" />
                  <Picker.Item label="Vodafone" value="Vodafone" />
                </Picker>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.networkErr, fontWeight: 'bold', marginTop: 5 }}>Choose a network</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.input}>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    editable={(this.state.loading) ? false : true}
                    keyboardType="phone-pad"
                    style={{ fontSize: 20, paddingHorizontal: 10, minWidth: "100%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(phonenumber) => this.setState({phonenumber})}
                    value={this.state.phonenumber}
                  />
                </View>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.phonenumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid phone number</Text>
            </View>
            
              {Voucher}
          </View>

          <TouchableOpacity onPress={this.pay} style={{ width: "100%", marginTop: 25 }} disabled={(this.state.loading == false) ? false : true}>
            <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5, opacity: (this.state.loading == false) ? 1 : 0.6 }}>
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}


