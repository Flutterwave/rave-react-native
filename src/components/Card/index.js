import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  WebView
} from "react-native";

//Scrollable view Library
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

var valid = require("card-validator");

export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chargedAmount: 0,
      cardno: "",
      cvv: "",
      status: "",
      chargeResponseMessage: "",
      suggested_auth: "",
      vbvModal: false,
      vbvurl: "",
      cardnoErr: "none",
      cardErr: "#fff",
      dateErr: "none",
      cvvErr: "none",
      expirymonth: "",
      expiryyear: "",
      firstname: "Oluwole",
      lastname: "Adebiyi",
      email: "flamekeed@gmail.com",
      pin: "",
      pinModal: false,
      otp: "",
      flwRef: "",
      otpModal: false,
      intlModal: false,
      loading: false,
      otp: "",
      intl: {},
      checked: false,
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      addressErr: "none",
      cityErr: "none",
      stateErr: "none",
      zipcodeErr: "none",
      countryErr: "none",
      inputErr: "#fff"
    };

    this.numberOfPageLoads = 0;
    this.maxPageLoads = this.props.maxPageLoads || 3;

    this.cc_format = this.cc_format.bind(this);
    this.confirmPin = this.confirmPin.bind(this);
    this.confirmOtp = this.confirmOtp.bind(this);
    this.pay = this.pay.bind(this);
    this.check = this.check.bind(this);
    this.checkIntl = this.checkIntl.bind(this);
    this.confirmVBV = this.confirmVBV.bind(this);
    this.confirmIntl = this.confirmIntl.bind(this);
    this.submit = this.submit.bind(this);
  }

  // Makes the card input appear in 4-digit interval apart from VERVE cards eg 4242 4242 4242 4242 instead of 4242424242424242
  cc_format(value) {
    var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    var matches = v.match(/\d{4,16}/g);
    var match = (matches && matches[0]) || "";
    var parts = [];
    if (value.replace(/\s/g, "").replace(/[^0-9]/gi, "").length > 16) {
      this.setState({
        cardno: value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
      });
    } else {
      for (i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        let newValue = parts.join(" ");

        this.setState({
          cardno: newValue
        });
      } else {
        this.setState({
          cardno: value
        });
      }
    }
  }

  //This closes the pin modal and adds the pin to the payload
  confirmPin() {
    this.setState({
      loading: true
    });

    this.props.rave
      .pinCharge({
        cardno: this.state.cardno.replace(/\s/g, ""),
        cvv: this.state.cvv,
        expirymonth: this.state.expirymonth,
        expiryyear: this.state.expiryyear,
        pin: this.state.pin
      })
      .then(response => {
        if (response.data.chargeResponseCode === "02") {
          //validate with otp

          this.setState({
            chargeResponseMessage: response.data.chargeResponseMessage,
            otpModal: true,
            loading: false,
            flwRef: response.data.flwRef
          });
        } else if (response.data.status.toUpperCase() === "SUCCESSFUL") {
          this.setState({
            loading: false
          });
          this.setState({
            cardno: "",
            cvv: "",
            expirymonth: "",
            expiryyear: ""
          });
          this.props.onSuccess(response);
        } else {
          this.setState({
            loading: false
          });
          this.props.onFailure(response);
        }
      })
      .catch(e => {
        this.setState({
          loading: false
        });
        this.props.onFailure(e);
      });
  }

  //This closes the otp modal and makes the otp validate
  confirmOtp() {
    this.setState({
      loading: true
    });

    //validate with otp
    this.props.rave
      .validate({
        transaction_reference: this.state.flwRef,
        otp: this.state.otp
      })
      .then(res => {
        if (res.data.tx.status.toUpperCase() === "SUCCESSFUL") {
          this.setState({
            loading: false,
            cardno: "",
            cvv: "",
            expirymonth: "",
            expiryyear: ""
          });
          this.props.onSuccess(res);
          Alert.alert(
            "",
            "Transaction Successful",
            [
              {
                text: "Ok",
                onPress: () =>
                  this.setState({
                    loading: false,
                    flwRef: res.data.flwRef,
                    cardno: "",
                    cvv: "",
                    expirymonth: "",
                    expiryyear: "",
                    pin: "",
                    otp: "",
                    otpModal: false,
                    pinModal: false,
                    intlModal: false,
                    vbvModal: false
                  })
              }
            ],
            {
              cancelable: false
            }
          );
        } else {
          this.setState({
            loading: false
          });
          Alert.alert(
            "",
            "Transaction is " + res.data.chargeResponseMessage,
            [
              {
                text: "Ok",
                onPress: () =>
                  this.setState({
                    loading: false,
                    flwRef: res.data.flwRef,
                    cardno: "",
                    cvv: "",
                    expirymonth: "",
                    expiryyear: ""
                  })
              }
            ],
            {
              cancelable: false
            }
          );
          this.props.onFailure(res);
        }
      })
      .catch(e => {
        this.setState({
          loading: false
        });
        this.props.onFailure(e);
      });
  }

  //This closes the vbv modal and makes validation
  confirmVBV(err, data) {
    this.setState({
      // vbvModal: false,
      loading: false
    });

    if (data.status == "successful") {
      this.setState({
        cardno: "",
        cvv: "",
        expirymonth: "",
        expiryyear: "",
        billingzip: "",
        billingcity: "",
        billingaddress: "",
        billingstate: "",
        billingcountry: "",
        vbvModal: false,
        intlModal: false
      });
      this.props.onSuccess(data);
    } else {
      this.props.onFailure(data);
    }
  }

  confirmIntl(data) {
    this.setState({
      // intlModal: false
      loading: true
    })

    this.props.rave
      .avsCharge(
        {
          cardno: this.state.cardno.replace(/\s/g, ""),
          cvv: this.state.cvv,
          expirymonth: this.state.expirymonth,
          expiryyear: this.state.expiryyear,
          billingzip: data.zipcode,
          billingcity: data.city,
          billingaddress: data.address,
          billingstate: data.state,
          billingcountry: data.country
        },
        this.state.suggested_auth
      )
      .then(response => {
        if (response.data.chargeResponseCode === "02") {
          if (response.data.authModelUsed.toUpperCase() === "VBVSECURECODE") {
            this.setState({ vbvModal: true, vbvurl: response.data.authurl });
          }
        } else {
          this.props.onSuccess(response);
        }
      })
      .catch(e => {
        this.setState({
          loading: false
        });
        this.props.onFailure(e);
      });
  }

  // Performs a check on the card form
  check() {
    this.setState({
      cardnoErr: "none",
      dateErr: "none",
      cvvErr: "none",
      inputErr: "#fff"
    });

    if (
      this.state.cardno.replace(/\s/g, "").length < 13 ||
      this.state.cvv.length < 3 ||
      this.state.expirymonth.length < 2 ||
      this.state.expiryyear.length < 2
    ) {
      if (this.state.cardno.replace(/\s/g, "").length < 13) {
        this.setState({
          inputErr: this.props.primarycolor,
          cardnoErr: "flex"
        });
      }

      if (
        this.state.expirymonth.length < 2 ||
        this.state.expiryyear.length < 2
      ) {
        this.setState({
          dateErr: "flex",
          inputErr: this.props.primarycolor
        });
      }
      if (this.state.cvv.length < 3) {
        this.setState({
          cvvErr: "flex",
          inputErr: this.props.primarycolor
        });
      }
      return false;
    } else {
      return true;
    }
  }

  // Sends payload to Flutterwave
  charge() {
    //Set button to loading
    this.setState({
      loading: true
    });
    // Initiate the charge
    this.props.rave
      .initiatecharge({
        cardno: this.state.cardno.replace(/\s/g, ""),
        cvv: this.state.cvv,
        expirymonth: this.state.expirymonth,
        expiryyear: this.state.expiryyear
      })
      .then(res => {
        // Check for suggested auth
        if (res.data.suggested_auth) {
          if (res.data.suggested_auth.toUpperCase() === "PIN") {
            this.setState({
              pinModal: true,
              loading: false,
              suggested_auth: res.data.authSuggested
            });
          } else if (
            res.data.suggested_auth.toUpperCase() === "NOAUTH_INTERNATIONAL" ||
            res.data.suggested_auth.toUpperCase() === "AVS_VBVSECURECODE"
          ) {
            this.setState({
              intlModal: true,
              loading: false,
              suggested_auth: res.data.authSuggested
            });
          }
        } else {
          if (res.data.status.toUpperCase() === "SUCCESSFUL") {
            this.setState({
              loading: false,
              flwRef: res.data.flwRef,
              cardno: "",
              cvv: "",
              expirymonth: "",
              expiryyear: ""
            });
            this.props.onSuccess(res);
          } else if (res.data.chargeResponseCode === "02") {
            if (
              res.data.authModelUsed.toUpperCase() === "ACCESS_OTP" ||
              res.data.authModelUsed.toUpperCase() === "GTB_OTP"
            ) {
              this.setState({
                otpModal: true,
                loading: true,
                flwRef: res.data.flwRef,
                chargeResponseMessage: res.data.chargeResponseMessage
              });
            } else if (res.data.authModelUsed.toUpperCase() === "PIN") {
              this.setState({
                pinModal: true,
                suggested_auth: res.data.authSuggested
              });
            } else if (
              res.data.authModelUsed.toUpperCase() === "VBVSECURECODE"
            ) {
              this.setState({ vbvModal: true, vbvurl: res.data.authurl });
            }
          } else {
            this.setState({
              loading: false
            });
            this.props.onFailure(res);
          }
        }
      })
      .catch(e => {
        this.setState({
          loading: false
        });
        this.props.onFailure(e);
      });
  }

  // The Pay button handler
  pay() {
    if (this.check()) {
      this.setState({
        loading: true
      });

      this.props.rave
        .getCardFees({
          amount: this.props.amount,
          currency: this.props.currency,
          card6: this.state.cardno.replace(/\s/g, "").substr(0, 6)
        })
        .then(resp => {
          Alert.alert(
            "",
            "You will be charged a total of " +
              this.props.currency +
              resp.data.charge_amount +
              ". Do you want to continue?",
            [
              {
                text: "Cancel",
                onPress: () =>
                  this.setState({
                    loading: false
                  })
              },
              {
                text: "Yes",
                onPress: () => this.charge()
              }
            ],
            { cancelable: false }
          );
        })
        .catch(err => {
          this.setState({
            loading: false
          });
          this.props.onFailure(err);
        });
    }
  }

  _onNavigationStateChange(webViewState) {
    // check if it's the redirected url
    if (webViewState.url.includes("txRef")) {
      // if (webViewState.url.includes("https://ravenative.herokuapp.com/")) {
      // convert to JSON and pass back for validation.
      this.confirmVBV(
        false,
        JSON.parse(this.getParameterByName("response", webViewState.url))
      );
    }
  }

  //Method used to get the response
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  submit() {
    if (this.checkIntl()) {
      this.confirmIntl({
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
        country: this.state.country
      });
    }
  }

  checkIntl() {
    this.setState({
      addressErr: "none",
      cityErr: "none",
      stateErr: "none",
      zipcodeErr: "none",
      countryErr: "none",
      inputErr: "#fff"
    });
    if (
      this.state.address.length < 1 ||
      this.state.city.length < 1 ||
      this.state.state.length < 1 ||
      this.state.zipcode.length < 1 ||
      this.state.country.length < 1
    ) {
      if (this.state.address.length < 1) {
        this.setState({
          addressErr: "flex",
          inputErr: this.props.primarycolor
        });
      }

      if (this.state.city.length < 1) {
        this.setState({
          cityErr: "flex",
          inputErr: this.props.primarycolor
        });
      }

      if (this.state.state.length < 1) {
        this.setState({
          stateErr: "flex",
          inputErr: this.props.primarycolor
        });
      }

      if (this.state.zipcode.length < 1) {
        this.setState({
          zipcodeErr: "flex",
          inputErr: this.props.primarycolor
        });
      }

      if (this.state.country.length < 1) {
        this.setState({
          countryErr: "flex",
          inputErr: this.props.primarycolor
        });
      }
      return false;
    } else {
      return true;
    }
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 25,
        paddingVertical: 110,
        height: "100%",
        backgroundColor: "#f2f2f2"
      },
      label: {
        color: "#12122c",
        fontWeight: "400",
        textAlign: "center",
        paddingBottom: 10
      },
      input: {
        borderColor: this.state.inputErr,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
        shadowColor: "#ccc",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 2
      },
      formGroup: {
        marginBottom: 1
      }
    });

    let card = <Image source={require("../../assets/icons/cardnull.png")} />;

    var numberValidation = valid.number(this.state.cardno);

    let btnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }} >PAY {this.props.currency} {this.props.amount}</Text>;

    let pinBtnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>Confirm PIN</Text>;

    let otpBtnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>Confirm OTP</Text>;

    let avsBtnText = <Text style={{ fontSize: 13, textAlign: "center", fontWeight: "bold", color: this.props.secondarycolor }}>ENTER</Text>;

    if (!numberValidation.isPotentiallyValid) {
      card = <Image source={require("../../assets/icons/cardnull.png")} />;
    }

    if (numberValidation.card) {
      if (numberValidation.card.type == "visa") {
        card = <Image source={require("../../assets/icons/cardvisa.png")} />;
      } else if (numberValidation.card.type == "mastercard") {
        card = <Image source={require("../../assets/icons/cardmaster.png")} />;
      } else if (
        numberValidation.card.type == "maestro" ||
        numberValidation.card.type == "discover"
      ) {
        card = <Image source={require("../../assets/icons/cardverve.png")} />;
      }
    } else {
      card = <Image source={require("../../assets/icons/cardnull.png")} />;
    }

    if (this.state.loading) {
      btnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />;
      pinBtnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />;
      otpBtnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />;
      avsBtnText = <ActivityIndicator size="small" color={this.props.secondarycolor} />;
    }

    let web = (
      <WebView
        source={{ uri: this.state.vbvurl }}
        style={{ padding: "50%" }}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        javaScriptEnabled={true}
      />
    );

    if (Platform.OS === "ios") {
      web = (
        <WebView
          source={{ uri: this.state.vbvurl }}
          scalesPageToFit={false}
          style={{ padding: "50%" }}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          javaScriptEnabled={true}
        />
      );
    }
    let page;
    if (this.state.pinModal) {
      page = (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { fontSize: 20, marginVertical: 10 }]}>
              Please enter card pin to continue transaction
            </Text>
            <View style={styles.formGroup}>
              <View style={styles.input}>
                <Text style={{ color: "#999999", fontSize: 14 }}>
                  Enter PIN
                </Text>
                <View style={{ paddingVertical: 10, flexDirection: "row" }}>
                  <View>
                    <TextInput
                      autoCorrect={false}
                      keyboardType="numeric"
                      secureTextEntry={true}
                      style={{
                        fontSize: 20,
                        paddingHorizontal: 10,
                        minWidth: "98%"
                      }}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      onChangeText={pin => this.setState({ pin })}
                      value={this.state.pin}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={this.confirmPin} style={{ width: "100%", marginTop: 20 }} disabled={this.state.loading == false ? false : true}>
                <View style={{ backgroundColor: this.props.primarycolor,paddingVertical: 15, borderRadius: 5, marginTop: 20, opacity: this.state.loading == false ? 1 : 0.6 }}>
                  {pinBtnText}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      );

      if (this.state.otpModal) {
        page = (
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
            <View style={{ flex: 1 }}>
              <View style={styles.formGroup}>
                <Text
                  style={[styles.label, { fontSize: 20, marginVertical: 10 }]}
                >
                  {this.state.chargeResponseMessage}
                </Text>
                <View style={styles.input}>
                  <Text style={{ color: "#999999", fontSize: 14 }}>
                    Enter OTP
                  </Text>
                  <View style={{ paddingVertical: 10, flexDirection: "row" }}>
                    <TextInput
                      autoCorrect={false}
                      keyboardType="numeric"
                      style={{
                        fontSize: 20,
                        paddingHorizontal: 10,
                        minWidth: "98%"
                      }}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      onChangeText={otp => this.setState({ otp })}
                      value={this.state.otp}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={this.confirmOtp} style={{ width: "100%", marginTop: 20 }}>
                <View style={{ backgroundColor: this.props.primarycolor,paddingVertical: 15, borderRadius: 5, opacity: this.state.loading == false ? 1 : 0.6 }}>
                  {otpBtnText}
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        );
      }
    } else if (this.state.vbvModal) {
      page = <View style={{ flex: 1, width: "100%" }}>{web}</View>;
    } else if (this.state.intlModal) {
      page = (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={{ flex: 1, marginBottom: 50 }}>
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.label, { fontSize: 18, marginVertical: 5 }]}>
                Please enter billing address details to continue transaction
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: "#999999",
                    fontSize: 16,
                    paddingHorizontal: 10
                  }}
                >
                  ADDRESS
                </Text>
                <View style={{ paddingVertical: 3, flexDirection: "row" }}>
                  <TextInput
                    placeholder="20 Saltlake Eldorado"
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 10,
                      width: "100%"
                    }}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={address => this.setState({ address })}
                    value={this.state.address}
                  />
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.addressErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid address</Text> */}
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ flexGrow: 1, width: "50%" }}>
                  <View style={[styles.input, { borderBottomLeftRadius: 3 }]}>
                    <Text style={{ color: "#999999", fontSize: 16 }}>CITY</Text>
                    <View style={{ paddingVertical: 3, flexDirection: "row" }}>
                      <TextInput
                        placeholder="Livingstone"
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 10,
                          width: "100%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={city => this.setState({ city })}
                        value={this.state.city}
                      />
                    </View>
                  </View>
                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cityErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid city</Text> */}
                </View>
                <View style={{ flexGrow: 1, paddingLeft: 1, maxWidth: "50%" }}>
                  <View style={[styles.input, { borderBottomRightRadius: 3 }]}>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: 16,
                        paddingHorizontal: 10
                      }}
                    >
                      STATE
                    </Text>
                    <View style={{ paddingVertical: 3, flexDirection: "row" }}>
                      <TextInput
                        placeholder="CA"
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 10,
                          width: "100%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={state => this.setState({ state })}
                        value={this.state.state}
                      />
                    </View>
                  </View>
                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.stateErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid state</Text> */}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ flexGrow: 1, maxWidth: "50%" }}>
                  <View style={[styles.input, { borderBottomLeftRadius: 3 }]}>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: 16,
                        paddingHorizontal: 10
                      }}
                    >
                      ZIP CODE
                    </Text>
                    <View style={{ paddingVertical: 3, flexDirection: "row" }}>
                      <TextInput
                        placeholder="928302"
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 10,
                          width: "100%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={zipcode => this.setState({ zipcode })}
                        value={this.state.zipcode}
                      />
                    </View>
                  </View>
                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.zipcodeErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid zip code</Text> */}
                </View>
                <View style={{ flexGrow: 1, paddingLeft: 1, maxWidth: "50%" }}>
                  <View style={[styles.input, { borderBottomRightRadius: 3 }]}>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: 16,
                        paddingHorizontal: 10
                      }}
                    >
                      COUNTRY
                    </Text>
                    <View style={{ paddingVertical: 3, flexDirection: "row" }}>
                      <TextInput
                        placeholder="US"
                        style={{
                          fontSize: 14,
                          paddingHorizontal: 10,
                          width: "100%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={country => this.setState({ country })}
                        value={this.state.country}
                      />
                    </View>
                  </View>
                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.countryErr, fontWeight: 'bold', marginTop: 5 }}>Enter a valid country</Text> */}
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={this.submit} style={{ width: "100%", marginTop: 30 }} disabled={this.state.loading == false ? false : true}>
              <View style={{ backgroundColor: this.props.primarycolor,paddingVertical: 15, borderRadius: 5, opacity: this.state.loading == false ? 1 : 0.6 }}>
              {avsBtnText}  
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      );
    } else {
      page = (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={{ flex: 1, height: 204 }}>
            <View style={styles.formGroup}>
              <Text
                style={[styles.label, { fontSize: 20, marginVertical: 10 }]}
              >
                Enter your card information to make payment
              </Text>
              <View
                style={[
                  styles.input,
                  { borderTopRightRadius: 3, borderTopStartRadius: 3 }
                ]}
              >
                <Text style={{ color: "#999999", fontSize: 16 }}>
                  CARD NUMBER
                </Text>
                <View
                  style={{ paddingVertical: 10, flexDirection: "row-reverse" }}
                >
                  <View style={{ paddingTop: 6 }}>{card}</View>
                  <View>
                    <TextInput
                      autoCorrect={false}
                      editable={this.state.loading ? false : true}
                      keyboardType="numeric"
                      style={{
                        fontSize: 16,
                        minWidth: "95%",
                        paddingHorizontal: 10
                      }}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      onChangeText={cardno => this.cc_format(cardno)}
                      value={this.state.cardno}
                      placeholder="5594 3240 8223 9398"
                    />
                  </View>
                </View>
              </View>
              {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cardnoErr, fontWeight: 'bold', marginTop: 1 }}>Enter a valid credit card number</Text> */}
            </View>
            <View style={styles.formGroup}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ flexGrow: 1, width: "50%" }}>
                  <View style={[styles.input, { borderBottomLeftRadius: 3 }]}>
                    <Text style={{ color: "#999999", fontSize: 16 }}>
                      VALID TILL
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        autoCorrect={false}
                        editable={this.state.loading ? false : true}
                        ref="1"
                        keyboardType="numeric"
                        style={{
                          fontSize: 16,
                          flexGrow: 2,
                          height: 45,
                          textAlign: "right",
                          alignSelf: "flex-start",
                          width: "10%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="MM"
                        maxLength={2}
                        onChangeText={expirymonth => {
                          let status = 1;
                          if (expirymonth == 2) {
                            this.setState({ expirymonth: "02" });
                            status = 2;
                          } else if (expirymonth == 3) {
                            this.setState({ expirymonth: "03" });
                            status = 2;
                          } else if (expirymonth == 4) {
                            this.setState({ expirymonth: "04" });
                            status = 2;
                          } else if (expirymonth == 5) {
                            this.setState({ expirymonth: "05" });
                            status = 2;
                          } else if (expirymonth == 6) {
                            this.setState({ expirymonth: "06" });
                            status = 2;
                          } else if (expirymonth == 7) {
                            this.setState({ expirymonth: "07" });
                            status = 2;
                          } else if (expirymonth == 8) {
                            this.setState({ expirymonth: "08" });
                            status = 2;
                          } else if (expirymonth == 9) {
                            this.setState({ expirymonth: "09" });
                            status = 2;
                          } else if (expirymonth > 12) {
                            this.setState({ expirymonth: "12" });
                            status = 2;
                          } else {
                            if (expirymonth.length >= 2) {
                              status = 2;
                            }
                            this.setState({ expirymonth });
                          }

                          if (status >= 2) {
                            this.refs[2].focus();
                          }
                        }}
                        value={this.state.expirymonth}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          paddingTop: 10,
                          textAlign: "center",
                          alignSelf: "stretch",
                          width: "10%",
                          color: "#999999"
                        }}
                      >
                        /
                      </Text>
                      <TextInput
                        autoCorrect={false}
                        editable={this.state.loading ? false : true}
                        ref="2"
                        keyboardType="numeric"
                        style={{
                          fontSize: 16,
                          flexGrow: 2,
                          height: 45,
                          textAlign: "left",
                          alignSelf: "flex-start",
                          width: "50%"
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="YY"
                        maxLength={2}
                        onChangeText={expiryyear => {
                          this.setState({ expiryyear });

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

                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.dateErr, fontWeight: 'bold', marginTop: 1 }}>Enter a valid expiry date</Text> */}
                </View>
                <View style={{ flexGrow: 1, paddingLeft: 1, width: "50%" }}>
                  <View style={[styles.input, { borderBottomRightRadius: 3 }]}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={{ color: "#999999" }}>CVV/CVV2 </Text>
                      <Text
                        style={{
                          color: "#999999",
                          fontSize: 10,
                          paddingVertical: 4.5
                        }}
                      >
                        What is this?
                      </Text>
                    </View>

                    <TextInput
                      ref="3"
                      autoCorrect={false}
                      editable={this.state.loading ? false : true}
                      keyboardType="numeric"
                      maxLength={4}
                      // secureTextEntry={true}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      style={{ height: 45, width: "100%", fontSize: 16 }}
                      onChangeText={cvv => this.setState({ cvv })}
                      value={this.state.cvv}
                      placeholder="123"
                    />
                  </View>
                  {/* <Text style={{ color: '#EE312A', fontSize: 10, display: this.state.cvvErr, fontWeight: 'bold', marginTop: 1 }}>Enter a valid CVV</Text> */}
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 55,
              marginLeft: 0
            }}
          />

          <TouchableOpacity
            onPress={this.pay}
            style={{ width: "100%", marginTop: 30 }}
            disabled={this.state.loading == false ? false : true}
          >
            <View
              style={{
                backgroundColor: this.props.primarycolor,
                paddingVertical: 15,
                borderRadius: 5,
                opacity: this.state.loading == false ? 1 : 0.6
              }}
            >
              {btnText}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      );
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {page}
      </KeyboardAvoidingView>
    );
  }
}
