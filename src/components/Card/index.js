import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TextInput, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
//Scrollable view Library
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Import the Pin Modal
import Pin from './Pin';

//Import the OTP modal
import Otp from '../General/Otp';
import VBVSecure from '../General/vbvSecure';
import IntlModal from './Intl';

var valid = require('card-validator');



export default class index extends Component {
  constructor(props) {
    super(props);
    
    this.state = { chargedAmount:0, cardno: '', cvv: '', status: "", chargeResponseMessage: '', suggested_auth: "", vbvModal: false, vbvurl: '', cardnoErr: 'none', dateErr: 'none', cvvErr: 'none', expirymonth: '', expiryyear: '', firstname: 'Oluwole', lastname: 'Adebiyi', email: 'flamekeed@gmail.com', pin: "", pinModal: false, otp: "", flwRef: "", otpModal: false, intlModal: false, loading: false, otp: "", intl: {}};

    this.cc_format = this.cc_format.bind(this);
    this.confirmPin = this.confirmPin.bind(this);
    this.confirmOtp = this.confirmOtp.bind(this);
    this.pay = this.pay.bind(this); 
    this.check = this.check.bind(this);
    this.confirmVBV = this.confirmVBV.bind(this);
    this.confirmIntl = this.confirmIntl.bind(this);
  }

  // Makes the card input appear in 4-digit interval apart from VERVE cards eg 4242 4242 4242 4242 instead of 4242424242424242
  cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    if (value.replace(/\s/g, "").replace(/[^0-9]/gi, '').length > 16) {
      this.setState({
        cardno: value.replace(/\s/g, "").replace(/[^0-9]/gi, '')
      })
    } else {
      for (i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
      }
      if (parts.length) {
        let newValue = parts.join(' ');
        
        this.setState({
          cardno: newValue
        })
      } else {
        this.setState({
          cardno: value
        })
      }
    }
    
  }

  //This closes the pin modal and adds the pin to the payload
  confirmPin() {
    this.setState({
      pinModal: false,
    })

    this.props.rave.pinCharge({
      "cardno": this.state.cardno.replace(/\s/g, ""),
      "cvv": this.state.cvv,
      "expirymonth": this.state.expirymonth,
      "expiryyear": this.state.expiryyear,
      "pin": this.state.pin
    }).then((response) => {
        if (response.data.chargeResponseCode === "02") {
          //validate with otp
          
          this.setState({
            chargeResponseMessage: response.data.chargeResponseMessage,
            otpModal: true,
            loading: true,
            flwRef: response.data.flwRef
          })
        } else if (response.data.status.toUpperCase() === "SUCCESSFUL") {
          this.setState({
            loading: false
          })
          this.props.rave.verifyTransaction(response.data.txRef).then((resp) => {
            this.setState({ cardno: '', cvv: '', expirymonth: '', expiryyear: ''})
            this.props.onSuccess(resp);
          }).catch((error) => {
            this.props.onFailure(error);
          })
          
        } else {
          this.setState({
            loading: false
          })
          this.props.onFailure(response);
        }
      }).catch((e) => {
        this.setState({
          loading: false
        })
      this.props.onFailure(e);
    })
  }

  //This closes the otp modal and makes the otp validate
  confirmOtp() {
    this.setState({
      otpModal: false
    })

    //validate with otp
    this.props.rave.validate({ transaction_reference: this.state.flwRef, otp: this.state.otp }).then((res) => {
      if (res.data.tx.status.toUpperCase() === "SUCCESSFUL") {
        this.setState({
          loading: false
        })
        
        this.props.rave.verifyTransaction(res.data.tx.txRef).then((resp) => {
          this.setState({ cardno: '', cvv: '', expirymonth: '', expiryyear: '' })
          this.props.onSuccess(resp);
           if (resp.data.status.toUpperCase() === "SUCCESSFUL" && resp.data.chargecode === "00") {
             Alert.alert(
               '',
               'Transaction Successful',
               [{
                 text: 'Ok',
                 onPress: () => this.setState({
                   loading: false,
                   flwRef: res.data.flwRef,
                   cardno: '',
                   cvv: '',
                   expirymonth: '',
                   expiryyear: ''
                 })
               }, ], {
                 cancelable: false
               }
             )
           } else {
             Alert.alert(
               '',
               'Transaction Not Successful\n' + resp.data.chargemessage,
               [{
                 text: 'Ok',
                 onPress: () => this.setState({
                   loading: false,
                   flwRef: res.data.flwRef,
                   cardno: '',
                   cvv: '',
                   expirymonth: '',
                   expiryyear: ''
                 })
               }, ], {
                 cancelable: false
               }
             )
           }
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
        this.setState({ cardno: '', cvv: '', expirymonth: '', expiryyear: '' })
        this.props.onSuccess(resp);
      }).catch((error) => {
        this.props.onFailure(error);
      })
    }
    else {
      this.props.onFailure(data);
    }
  }

  confirmIntl(data) {
    this.setState({
      intlModal: false
    })

    this.props.rave.avsCharge({
      "cardno": this.state.cardno.replace(/\s/g, ""),
      "cvv": this.state.cvv,
      "expirymonth": this.state.expirymonth,
      "expiryyear": this.state.expiryyear,
      "billingzip": data.zipcode,
      "billingcity": data.city,
      "billingaddress": data.address,
      "billingstate": data.state,
      "billingcountry": data.country,
      
    }, this.state.suggested_auth).then((response) => {

      if (response.data.chargeResponseCode === "02") {
        if (response.data.authModelUsed.toUpperCase() === "VBVSECURECODE") {
          this.setState({ vbvModal: true, vbvurl: response.data.authurl });
        }
      } else {
        this.props.rave.verifyTransaction(response.data.txRef).then((resp) => {
          this.setState({ cardno: '', cvv: '', expirymonth: '', expiryyear: '' })
          this.props.onSuccess(resp);
        }).catch((error) => {
          this.props.onFailure(error);
        })
      }

      }).catch((e) => {
        this.setState({
          loading: false
        })
        this.props.onFailure(e);
    })   


  }

  // Performs a check on the card form
  check() {
    this.setState({
      cardnoErr: 'none', dateErr: 'none', cvvErr: 'none'
    })
    if (this.state.cardno.replace(/\s/g, "").length < 13 || this.state.cvv.length < 3 || this.state.expirymonth.length < 2 || this.state.expiryyear.length < 2) {

      if (this.state.cardno.replace(/\s/g, "").length < 13) {
        this.setState({
          cardnoErr: 'flex'
        })
      }

      if (this.state.expirymonth.length < 2 || this.state.expiryyear.length < 2) {
        this.setState({
          dateErr: 'flex'
        })
      }
      if (this.state.cvv.length < 3) {
        this.setState({
          cvvErr: 'flex'
        })
      }
      return false
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
    this.props.rave.initiatecharge({
      "cardno": this.state.cardno.replace(/\s/g, ""),
      "cvv": this.state.cvv,
      "expirymonth": this.state.expirymonth,
      "expiryyear": this.state.expiryyear
    }).then((res) => {      
      // Check for suggested auth
      if (res.data.suggested_auth) {
        if (res.data.suggested_auth.toUpperCase() === "PIN") {
          this.setState({
            pinModal: true,
            suggested_auth: res.data.authSuggested
          })
        } else if (res.data.suggested_auth.toUpperCase() === "NOAUTH_INTERNATIONAL" || res.data.suggested_auth.toUpperCase() === "AVS_VBVSECURECODE") {
          this.setState({
            intlModal: true,
            suggested_auth: res.data.authSuggested
          })
        }
      } else {
        if (res.data.status.toUpperCase() === "SUCCESSFUL") {
          this.setState({
            loading: false,
            flwRef: res.data.flwRef
          })
          this.props.rave.verifyTransaction(res.data.txRef).then((resp) => {
            this.setState({
              loading: false,
              flwRef: res.data.flwRef,
              cardno: '', cvv: '', expirymonth: '', expiryyear: ''
            })
            this.props.onSuccess(resp);
          }).catch((error) => {
            this.props.onFailure(error);
          })
          
        } else if (res.data.chargeResponseCode === "02") {
          if (res.data.authModelUsed.toUpperCase() === "ACCESS_OTP" || res.data.authModelUsed.toUpperCase() === "GTB_OTP") {
            this.setState({
              otpModal: true,
              loading: true,
              flwRef: res.data.flwRef,
              chargeResponseMessage: res.data.chargeResponseMessage
            })
          } else if (res.data.authModelUsed.toUpperCase() === "PIN") {
            this.setState({
              pinModal: true,
              suggested_auth: res.data.authSuggested
            })
          } else if (res.data.authModelUsed.toUpperCase() === "VBVSECURECODE") {
            this.setState({ vbvModal: true, vbvurl: res.data.authurl });
          }
        } else {
          this.setState({
            loading: false
          })
          this.props.onFailure(res);
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
    if(this.check()) {

      this.setState({
        loading: true
      })
      
      this.props.rave.getCardFees({ amount: this.props.amount, currency: this.props.currency, card6: this.state.cardno.replace(/\s/g, "").substr(0, 6) }).then((resp) => {

        Alert.alert(
          '',
          'You will be charged a total of ' + this.props.currency + resp.data.charge_amount + '. Do you want to continue?',
          [
            {
              text: 'Cancel', onPress: () => this.setState({
                loading: false
              })
            },
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
        paddingBottom: 20,
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
        marginBottom: 20
      }
    });
    
    let card = <Image source={require('../../assets/icons/cardnull.png')} />;

    var numberValidation = valid.number(this.state.cardno);

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color:this.props.secondarycolor }}>PAY</Text>;

    if (!numberValidation.isPotentiallyValid) {
      card = <Image source={require('../../assets/icons/cardnull.png')} />;
    }

    if (numberValidation.card) {
      
      if (numberValidation.card.type == "visa") {
        card = <Image source={require('../../assets/icons/cardvisa.png')} />;
      } else if (numberValidation.card.type == "mastercard") {
        card = <Image source={require('../../assets/icons/cardmaster.png')} />;
      } else if (numberValidation.card.type == "maestro" || numberValidation.card.type == "discover") {
        card = <Image source={require('../../assets/icons/cardverve.png')} />;
      }
    } else {
      card = <Image source={require('../../assets/icons/cardnull.png')} />;
    }

    if (this.state.loading) {

      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />
        
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <KeyboardAwareScrollView  keyboardShouldPersistTaps='always'>
          <Pin primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} pinModal={this.state.pinModal} confirm={this.confirmPin} pin={this.state.pin} pinEdit={(pin) => this.setState({ pin })} />
          <Otp primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} otpModal={this.state.otpModal} confirm={this.confirmOtp} otp={this.state.otp} chargeResponseMessage={this.state.chargeResponseMessage} otpEdit={(otp) => this.setState({ otp })} />
          <IntlModal primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} intlModal={this.state.intlModal} confirm={this.confirmIntl} />
          <VBVSecure vbvModal={this.state.vbvModal} url={this.state.vbvurl} confirm={this.confirmVBV} />
          <View style={{flex:1}}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <View style={styles.input}>
                <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                  <View style={{ paddingTop: 6 }}>
                    {card}
                  </View>
                  <View>
                    <TextInput
                      autoCorrect={false}
                      editable={(this.state.loading)?false:true}
                      keyboardType="numeric"
                      style={{ fontSize: 20, paddingHorizontal: 10, minWidth:"95%"}}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      onChangeText={(cardno) => this.cc_format( cardno )}
                      value={this.state.cardno}
                    />
                  </View>
                </View>
              </View>
              <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cardnoErr, fontWeight: 'bold', marginTop: 5}}>Enter a valid credit card number</Text>
            </View>
            <View style={styles.formGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexGrow: 1, paddingRight: 10, maxWidth:150 }}>
                  <Text style={styles.label}>Exp. Date</Text>
                  <View style={styles.input}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TextInput
                        autoCorrect={false}
                        editable={(this.state.loading) ? false : true}
                        ref="1"
                        keyboardType="numeric"
                        style={{ fontSize: 20, flexGrow: 2, height: 45, alignSelf: 'flex-start', width: '45%' }}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="MM"
                        maxLength={2}
                        onChangeText={(expirymonth) => {
                          let status = 1;
                          if (expirymonth == 2) {
                            this.setState({ expirymonth: "02" });
                            status = 2;
                          }
                          else if (expirymonth == 3) {
                            this.setState({ expirymonth: "03" })
                            status = 2;
                          }
                          else if (expirymonth == 4) {
                            this.setState({ expirymonth: "04" })
                            status = 2;
                          }
                          else if (expirymonth == 5) {
                            this.setState({ expirymonth: "05" })
                            status = 2;
                          }
                          else if (expirymonth == 6) {
                            this.setState({ expirymonth: "06" })
                            status = 2;
                          }
                          else if (expirymonth == 7) {
                            this.setState({ expirymonth: "07" })
                            status = 2;
                          }
                          else if (expirymonth == 8) {
                            this.setState({ expirymonth: "08" })
                            status = 2;
                          }
                          else if (expirymonth == 9) {
                            this.setState({ expirymonth: "09" })
                            status = 2;
                          }
                          else if (expirymonth > 12) {
                            this.setState({ expirymonth: "12" })
                            status = 2;
                          } else {
                            if (expirymonth.length >= 2) {
                              status = 2;
                            }
                            this.setState({ expirymonth })
                          }

                          if (status >= 2) {
                            this.refs[2].focus();
                          }
                        }}
                        value={this.state.expirymonth}
                      />
                      <Text style={{ fontSize: 20, paddingTop: 7, alignSelf: 'stretch', width: '10%' }}>/</Text>
                      <TextInput
                        autoCorrect={false}
                        editable={(this.state.loading) ? false : true}
                        ref="2"
                        keyboardType="numeric"
                        style={{ fontSize: 20, flexGrow: 2, height: 45, alignSelf: 'flex-end', width: '45%', textAlign: 'right' }}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      placeholder="YY"
                        maxLength={2}
                        onChangeText={(expiryyear) => {
                          this.setState({ expiryyear })

                          if (this.state.expirymonth.length < 2) {
                            this.refs[1].focus();
                          } else {
                            if (expiryyear.length >= 2) {
                              this.refs[3].focus();
                            }
                          }

                          
                        }}
                        value={this.state.expiryyear}
                      />
                    </View>
                  </View>

                  <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.dateErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid expiry date</Text>
                </View>
                <View style={{ flexGrow: 1, paddingLeft: 10, maxWidth: 150  }}>
                  <Text style={styles.label}>CVV/CVV2</Text>
                  <View style={styles.input}>
                    <TextInput
                      ref="3"
                      autoCorrect={false}
                      editable={(this.state.loading) ? false : true}
                      keyboardType="numeric"
                      maxLength={4}
                      // secureTextEntry={true}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      style={{ height: 45, width: '100%', fontSize: 20 }}
                      onChangeText={(cvv) => this.setState({ cvv })}
                      value={this.state.cvv}
                    />
                  </View>
                  <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cvvErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid CVV</Text>
                </View>
              </View>
                
            </View>       
          </View>

          <TouchableOpacity onPress={this.pay} style={{ width: "100%", marginTop: 25 }} disabled={(this.state.loading == false)? false : true}>
            <View style={{ backgroundColor: this.props.primarycolor, paddingVertical: 15, borderRadius: 5, opacity:(this.state.loading == false) ? 1 : 0.6 }}>
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}