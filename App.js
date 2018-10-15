import React from 'react';
import Rave from 'react-native-rave';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onSuccess(data) {
    console.log("success", data);

  }

  onFailure(data) {
    console.log("error", data);
  }

  // render() {
  //   return ( <Rave amount = "10"
  //     country = "NG"
  //     currency = "NGN"
  //     email = "dodez@xgmailoo.com"
  //     firstname = "Oluwole"
  //     lastname = "Adebiyi"
  //     publickey = "FLWPUBK-92e93a5c487ad64939327052e113c813-X"
  //     secretkey = "FLWSECK-61037cfe3cfc53b03e339ee201fa98f5-X"
  //     paymenttype = "ussd" //set this payment type to ussd for ussd transaction to be performed, if not, account transaction would performed by default
  //     redirect_url = "https://loggly-webhook.herokuapp.com/ghmobile" // set your webhook url here to receive the transaction response for handling
  //     page = "ussd" //set this to display ussd as the payment page of the transaction you want to perform, if not card payment page will display by default
  //     meta = {
  //       [{
  //         metaname: "color",
  //         metavalue: "red"
  //       }, {
  //         metaname: "storelocation",
  //         metavalue: "ikeja"
  //       }]
  //     }
  //     production = {
  //       false // Set production value to false if you are using ravesandbox public and private keys or test enviroment, Set to true if you are ready to go live
  //     }
  //     onSuccess = {
  //       res => this.onSuccess(res)
  //     }
  //     onFailure = {
  //       e => this.onFailure(e)
  //     }
  //     />
  //   );
  // }
  // render() {
  //   return ( <Rave amount = "100"
  //     country = "NG"
  //     currency = "NGN"
  //     email = "dodez@xgmailoo.com"
  //     firstname = "Oluwole"
  //     lastname = "Adebiyi"
  //     publickey = "FLWPUBK-92e93a5c487ad64939327052e113c813-X"
  //     secretkey = "FLWSECK-61037cfe3cfc53b03e339ee201fa98f5-X"
  //     paymenttype = "both"
  //     meta = {
  //       [{
  //         metaname: "color",
  //         metavalue: "red"
  //       }, {
  //         metaname: "storelocation",
  //         metavalue: "ikeja"
  //       }]
  //     }
  //     production = {
  //       false  // Set production value to false if you are using ravesandbox public and private keys or test enviroment, Set to true if you are ready to go live
  //     }
  //     onSuccess = {
  //       res => this.onSuccess(res)
  //     }
  //     onFailure = {
  //       e => this.onFailure(e)
  //     }
  //     />
  //   );
  // }


    render() {
      return ( <Rave amount = "10"
        country = "KE"
        currency = "KES"
        email = "dodez@xgmailoo.com"
        firstname = "Oluwole"
        lastname = "Adebiyi"
        publickey = "FLWPUBK-92e93a5c487ad64939327052e113c813-X"
        secretkey = "FLWSECK-61037cfe3cfc53b03e339ee201fa98f5-X"
        // publickey = "FLWPUBK-82a53dd5ec31365f36c0d9c3aaf5a8d1-X"
        // secretkey = "FLWSECK-0fec7b2bfee024bd44edb8ab67fd08f8-X"
        redirect_url = "https://loggly-webhook.herokuapp.com/ghmobile" // set your webhook url here to receive the transaction response for handling
        paymenttype = "both" //set this payment type to mpesa for mpesa transaction to be performed, if not, account transaction would performed by default
        page = "mpesa" //set this to display mpesa as the payment page of the transaction you want to perform, if not card payment page will display by default
        meta = {
          [{
            metaname: "color",
            metavalue: "red"
          }, {
            metaname: "storelocation",
            metavalue: "ikeja"
          }]
        }
        production = {
          false  // Set production value to false if you are using ravesandbox public and private keys or test enviroment, Set to true if you are ready to go live
        }
        onSuccess = {
          res => this.onSuccess(res)
        }
        onFailure = {
          e => this.onFailure(e)
        }
        />
      );
    }

    // render() {
    //   return ( <Rave amount = "10"
    //     country = "GH"
    //     currency = "GHS"
    //     email = "dodez@xgmailoo.com"
    //     firstname = "Oluwole"
    //     lastname = "Adebiyi"
    //     publickey = "FLWPUBK-92e93a5c487ad64939327052e113c813-X"
    //     secretkey = "FLWSECK-61037cfe3cfc53b03e339ee201fa98f5-X"
    //     redirect_url = "https://loggly-webhook.herokuapp.com/ghmobile" // set your webhook url here to received the transaction response
    //     paymenttype = "mobilemoneygh" //set this payment type to mobilemoneygh for Ghmobile transaction to be performed, if not, account transaction would performed
    //     page = "mobilemoneygh" //set this to display Mobile Money as the payment page of the transaction you want to perform, if not card payment page will display by default
    //     meta = {
    //       [{
    //         metaname: "color",
    //         metavalue: "red"
    //       }, {
    //         metaname: "storelocation",
    //         metavalue: "ikeja"
    //       }]
    //     }
    //     production = {
    //       false // Set production value to false if you are using ravesandbox public and private keys or test enviroment, Set to true if you are ready to go live
    //     }
    //     onSuccess = {
    //       res => this.onSuccess(res)
    //     }
    //     onFailure = {
    //       e => this.onFailure(e)
    //     }
    //     />
    //   );
    // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});