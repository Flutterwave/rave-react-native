import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Picker, DatePicker } from "native-base";
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {banks: [], bankNotSupportedErr: 'none', accountbank: '', accountnumber: '', phonenumber: (this.props.phone == null) ? '' : this.props.phone, status: "", chargeResponseMessage: '', accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: 'none', otp: "", flwRef: "", loading: false};

    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.mounted = false;
  }

  // This method ensures a list of banks is returned on the component from the list of banks API endpoint

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

  // this method ensures the component of list of banks doesn't mount
  
  componentWillUnmount() {
    this.mounted = false;
  }
  

   // Performs a check on the state of the accountbank, accountnumber and phone number fields are filled as required and at not lesser than the required length
  check() {
    this.setState({
      accountbankErr: 'none', accountnumberErr: 'none', phonenumberErr: 'none', bankNotSupportedErr: 'none'
    })

    // if (this.state.accountbank.length < 2 || this.state.accountnumber.length < 5 || this.state.phonenumber.length < 3) {
    if (this.state.phonenumber.length < 3) {
      this.setState({
        phonenumberErr: 'flex'
      })
    }else if (this.state.accountbank < 2) {
      this.setState({
        accountbankErr: 'flex'
      })
    }else if (this.state.accountnumber.length < 5 && this.state.accountbank === "057") {
      this.setState({
        accountnumberErr: 'flex'
      })
    }else if (this.state.accountbank === "058" || this.state.accountbank === "057") {
      if (Number(this.props.amount) < 10 ) {
        Alert.alert(
          'Alert',
          'Amount can\'t be less than 10',
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
    } else if (this.state.accountbank !== "058" && this.state.accountbank !== "057") {
      this.setState({
        bankNotSupportedErr: 'flex'
      })
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
      "payment_type": "ussd"
    }

    if (this.state.accountbank == "057") {
      payload = {
        "accountbank": this.state.accountbank,// get the bank code from the bank list endpoint.
        "accountnumber": this.state.accountnumber,
        "phonenumber": this.state.phonenumber,
        "payment_type": "ussd"
      }
    } else if (this.state.accountbank == "058") {
      payload = {
        "accountbank": this.state.accountbank, // get the bank code from the bank list endpoint.
        "accountnumber": "00000",
        "phonenumber": this.state.phonenumber,
        "payment_type": "ussd"
      }
    }

    this.props.rave.initiatecharge(payload).then((res) => {
      // Check if the charge is successful
          console.log(payload);
          console.log(res);
      if (res.data.status.toUpperCase() === "SUCCESSFUL") {
        this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
          this.props.onSuccess(resp);
          Alert.alert(
            '',
            'Transaction Successful',
            [{
              text: 'Ok',
              onPress: () => this.setState({
                loading: false,
                phonenumber: "",
                accountnumber: "",
                accountbank: "",
              })
            }, ], {
              cancelable: false
            }
          )
        }).catch((error) => {
          this.props.onFailure(error);
        })
      }else if (res.data.chargeResponseCode === "02" && res.data.status === "success-pending-validation") {
        if (this.state.accountbank === "058") {
          Alert.alert(
            'Follow the instruction below to complete your transaction',
            '*737*50*' + res.data.charged_amount + '*159#\nYour Transaction Reference ' + res.data.flwRef,
            [{
              text: 'Ok',
              onPress: () => this.setState({
                loading: false,
                phonenumber: "",
                accountnumber: "",
                accountbank: "",
              })
            }, ], {
              cancelable: false
            }
          )
        } else if (this.state.accountbank === "057") {
          Alert.alert(
            res.data.validateInstructions,
            'Your Transaction Reference ' + res.data.flwRef,
            [{
              text: 'Ok',
              onPress: () => this.setState({
                loading: false,
                phonenumber: "",
                accountnumber: "",
                accountbank: "",
              })
            }, ], {
              cancelable: false
            }
          )
      }else {
         Alert.alert(
           res.data.validateInstructions,
           [{
             text: 'Ok',
             onPress: () => this.setState({
               loading: false,
               phonenumber: "",
               accountnumber: "",
               accountbank: ""
             })
           }, ], {
             cancelable: false
           }
         )
      }
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
          'You will be charged a total of ' + this.props.currency + resp.data.charge_amount + '. Do you want to continue?',
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
      }
    });

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>PAY</Text>;

    let zenith = <View></View>

    if (this.state.accountbank == "057") {
      zenith = (<View style={styles.formGroup}>
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
      </View>)
    }
    

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />

    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
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
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.bankNotSupportedErr, fontWeight: 'bold', marginTop: 5 }}>Bank Currently Not Supported</Text>
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


