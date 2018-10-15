import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Picker, DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dateFormat from 'dateformat';

import Otp from '../General/Otp';
import VBVSecure from '../General/vbvSecure';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = { dob: '', selectedDate: false, banks: [], accountbank: '', accountnumber: '', phonenumber: (this.props.phone == null) ? '' : this.props.phone, status: "", chargeResponseMessage: '', suggested_auth: "", vbvModal: false, vbvurl: '', dobErr: 'none', accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: 'none', otp: "", flwRef: "", otpModal: false, loading: false, otp: "", phone: (this.props.phone == null) ? '' : this.props.phone };

    this.confirmOtp = this.confirmOtp.bind(this);
    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.mounted = false;
    this.confirmVBV = this.confirmVBV.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    let banks;
    this.props.rave.listBanks().then((response) => {
      
      banks = response.map((bank) => {
        return (
          <Picker.Item key={bank.bankcode} label={bank.bankname} value={bank.bankcode} />
        )
      })
      if (this.mounted) {
        this.setState({ banks, accountbank: response[0].bankcode })
      }
    }).catch((e) => {
      console.log(e);

    })
    
  }
  
  componentWillUnmount() {
    this.mounted = false;
  }
  
  //This closes the otp modal and makes the otp validate
  confirmOtp() {
    this.setState({
      otpModal: false
    })

    //validate with otp
    this.props.rave.validateAccount({ transactionreference: this.state.flwRef, otp: this.state.otp }).then((res) => {      
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
        this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
          this.props.onSuccess(resp);
        }).catch((error) => {
          this.props.onFailure(error);
        })
      } else {
        this.setState({
          loading: false
        })
        this.props.onFailure(res);
      }
    }).catch((e) => {
      this.setState({
        loading: false
      })
      this.props.onFailure(e);
    })

  }

  //This closes the vbv modal and makes validation
  confirmVBV(err, data) {
    this.setState({
      vbvModal: false,
      loading: false
    })

    if (data.status == "successful") {
      this.props.rave.verifyTransaction(data.txRef).then((resp) => {
        this.props.onSuccess(resp);
      }).catch((error) => {
        this.props.onFailure(error);
      })
    }
    else {
      this.props.onFailure(data);
    }
  }

  // Performs a check on the card form
  check() {
    this.setState({
      accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: 'none', dobErr: 'none'
    })
    
    if (this.state.accountbank.length < 2 || this.state.accountnumber.length < 10 || this.state.phonenumber.length < 3 ) {

      if (this.state.accountbank < 2) {
        this.setState({
          accountbankErr: 'flex'
        })
      }

      if (this.state.accountnumber.length < 10 ) {
        this.setState({
          accountnumberErr: 'flex'
        })
      }
      if (this.state.phonenumber.length < 3) {
        this.setState({
          phonenumberErr: 'flex'
        })
      }
    } else if (this.state.accountbank == "058" || this.state.accountbank == "011") {
      if (Number(this.props.amount) < 100 ) {
        Alert.alert(
          'Alert',
          'Amount can\'t be less than 100',
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
    } else if (this.state.accountbank == "057"){
      if (!this.state.selectedDate) {
        this.setState({
          dobErr: 'flex'
        })
        return false
      }

      return true

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
      "accountbank": this.state.accountbank,// get the bank code from the bank list endpoint.
      "accountnumber": this.state.accountnumber,
      "phonenumber": this.state.phonenumber,
      "payment_type": "account"
    }

    if (this.state.accountbank == "057") {
      payload = {
        "accountbank": this.state.accountbank,// get the bank code from the bank list endpoint.
        "accountnumber": this.state.accountnumber,
        "phonenumber": this.state.phonenumber,
        "passcode": dateFormat(this.state.dob, "ddmmyyyy"),
        "payment_type": "account"
      }
    }

    this.props.rave.initiatecharge(payload).then((res) => {
      // Check for suggested auth
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
        this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
          this.props.onSuccess(resp);
          if (resp.data.status.toUpperCase() === "SUCCESSFUL" && resp.data.chargecode === "00") {
            Alert.alert(
              '',
              'Transaction Successful',
              [{
                text: 'Ok',
                onPress: () => this.setState({
                  loading: false,
                  "accountbank": "", // get the bank code from the bank list endpoint.
                  "phonenumber": "",
                  "dob": ""
                })
              }, ], {
                cancelable: false
              }
            )
          }
        }).catch((error) => {
          this.props.onFailure(error);
        })
      }
      else if (res.data.chargeResponseCode === "02" && res.data.authurl.toUpperCase() === "NO-URL") {
        this.setState({
          flwRef: res.data.flwRef,
          otpModal: true,
          loading: true,
          chargeResponseMessage: (res.data.validateInstruction) ? res.data.validateInstruction : 'Please validate with the OTP sent to your mobile or email'
        })
        Alert.alert(
          '',
          'Transaction in process\n' + res.data.validateInstruction,
          [{
            text: 'Ok',
            onPress: () => this.setState({
              loading: false,
              "accountbank": "", // get the bank code from the bank list endpoint.
              "accountnumber": "",
              "phonenumber": "",
              "dob": ""
            })
          }, ], {
            cancelable: false
          }
        )
      } else {
        this.setState({ vbvModal: true, vbvurl: res.data.authurl });
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
        // width: '100%'
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY</Text>;

    let zenith = <View></View>

    if (this.state.accountbank == "057") {
      zenith = (<View style={styles.formGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.input}>
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            <DatePicker
              // defaultDate={new Date(2004, 4, 4)}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Select date"
              textStyle={{ color: "#000" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={(date) => this.setState({ dob: date, selectedDate: true })}
            />
          </View>
        </View>
        <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.dobErr, fontWeight: 'bold', marginTop: 5 }}>Enter date of birth</Text>
      </View>)
    }
    

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <Otp primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} otpModal={this.state.otpModal} confirm={this.confirmOtp} otp={this.state.otp} chargeResponseMessage={this.state.chargeResponseMessage} otpEdit={(otp) => this.setState({ otp })} />
          <VBVSecure vbvModal={this.state.vbvModal} url={this.state.vbvurl} confirm={this.confirmVBV} />
          <View style={{ flex: 1 }}>
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Number</Text>
              <View style={styles.input}>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <TextInput
                    autoCorrect={false}
                    editable={(this.state.loading) ? false : true}
                    keyboardType="numeric"
                    style={{ fontSize: 20, paddingHorizontal: 10, minWidth: "100%" }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    maxLength={10}
                    onChangeText={(accountnumber) => this.setState({ accountnumber })}
                    value={this.state.accountnumber}
                  />
                </View>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.accountnumberErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid account number</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Bank</Text>
              <View style={styles.input}>
                <Picker
                  mode="dropdown"
                  placeholder="Select Bank"
                  selectedValue={this.state.accountbank}
                  enabled={(this.state.loading) ? false : true}
                  style={{   width: '100%' }}
                  onValueChange={(itemValue, itemIndex) => this.setState({ accountbank: itemValue })}>
                  {this.state.banks}
                </Picker>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.accountbankErr, fontWeight: 'bold', marginTop: 5 }}>Choose a bank</Text>
            </View>

            
            {zenith}
            

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


