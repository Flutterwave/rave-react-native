import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import CardAccountHeader from 'react-native-rave/src/components/payment-headers/CardAccountHeader';
import CardMpesaHeader from 'react-native-rave/src/components/payment-headers/CardMpesaHeader';
import CardMmoneyHeader from 'react-native-rave/src/components/payment-headers/CardMmoneyHeader';
import Card from './src/components/Card';
import Account from './src/components/Account';
import Mpesa from './src/components/Mpesa';
import Mmoney from './src/components/Mmoney';
// import Ussd from './src/components/Ussd';
import RavePayment from './library/RavePayment';
import RaveMpesa from './library/RaveMpesa';
import RaveUssd from './library/RaveUssd';
import RaveMmoney from './library/RaveMmoney';


export default class Rave extends React.Component {
  constructor(props) {
    super(props);
    this.rave = new RavePayment({ publicKey: props.publickey, secretKey: props.secretkey, production: props.production, currency: props.currency, country: props.country, txRef: props.txref, amount: props.amount, email: props.email, firstname: props.firstname, lastname: props.lastname, meta: props.meta });
    this.ravempesa = new RaveMpesa({ publicKey: props.publickey, secretKey: props.secretkey, production: props.production, currency: props.currency, country: props.country, txRef: props.txref, is_mpesa: props.is_mpesa, amount: props.amount, email: props.email, firstname: props.firstname, lastname: props.lastname, redirect_url: props.redirect_url, meta: props.meta });
    this.ravemmoney = new RaveMmoney({ publicKey: props.publickey, secretKey: props.secretkey, production: props.production, currency: props.currency, country: props.country, txRef: props.txref, is_ussd: props.is_ussd, amount: props.amount, email: props.email, firstname: props.firstname, lastname: props.lastname, redirect_url: props.redirect_url, meta: props.meta });
    this.raveussd = new RaveUssd({ publicKey: props.publickey, secretKey: props.secretkey, production: props.production, currency: props.currency, country: props.country, txRef: props.txref, amount: props.amount, phone: props.phone, email: props.email, firstname: props.firstname, lastname: props.lastname, redirect_url: props.redirect_url, meta: props.meta });
    this.state = { page: props.page };
    this.getPage = this.getPage.bind(this);
  }

  // this method gets the page data and sets its state based on the data gotten
  getPage(data) {
    this.setState({
      page: data
    })
  }
  render() {
    let page, header, paymentHeader, singlePageHeader;
    header = <View></View>;
    paymentHeader = this.props.paymenttype.charAt(0).toUpperCase();
    paymentHeader = paymentHeader + this.props.paymenttype.substr(1);
    singlePageHeader = <Text style={{ fontSize: 22, textAlign: 'center', paddingVertical: 25, color: this.props.secondarycolor, fontWeight: "bold", borderBottomColor: this.props.secondarycolor, borderBottomWidth: 2}}>{(paymentHeader) == "Mobilemoneygh" ? 'Mobile Money' : paymentHeader}</Text>;

    if (this.props.paymenttype == 'both' && this.props.currency == 'NGN') {
      header = <CardAccountHeader page={this.getPage} />;
      if (this.state.page == "card") {
        page = <Card rave={this.rave} primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      // }else if (this.state.page == "ussd") {
      //   page = <Ussd rave={this.raveussd} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }else {
        page = <Account rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }
    } else if (this.props.paymenttype == "account") {
      header = singlePageHeader;
      page = <Account rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
    } else if (this.props.paymenttype == 'both' && this.props.currency == 'KES') {
      header = <CardMpesaHeader page={this.getPage} />;
      if (this.state.page == "mpesa") {
        page = <Mpesa rave={this.ravempesa} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }else {
        page = <Card rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }
    } else if (this.props.paymenttype == 'both' && this.props.currency == 'GHS') {
      header = <CardMmoneyHeader page={this.getPage} />;
      if (this.state.page == "mobilemoneygh") {
        page = <Mmoney rave={this.ravemmoney} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }else {
        page = <Card rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }
    } else if (this.props.paymenttype == 'mpesa' && this.props.currency == 'KES') {
      header = singlePageHeader;
      if (this.state.page == "mpesa") {
        page = <Mpesa rave={this.ravempesa} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }
    } else if (this.props.paymenttype == 'mobilemoneygh' && this.props.currency == 'GHS') {
      header = singlePageHeader;
      if (this.state.page == "mobilemoneygh") {
        page = <Mmoney rave={this.ravemmoney} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
      }
    // } else if (this.props.paymenttype == "ussd") {
    //     header = <CardAccountHeader page={this.getPage} />;
    //     if (this.state.page == "ussd"){
    //       page = <Ussd rave={this.raveussd} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
    //     } else if (this.state.page == "card") {
    //       page = <Card rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
    //     }else {
    //       page = <Account rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
    //     }
    } else {
      header = <Text style={{ fontSize: 22, textAlign: 'center', paddingVertical: 15, color: this.props.secondarycolor, fontWeight: "bold", borderBottomColor: this.props.secondarycolor, borderBottomWidth: 2}}>Card</Text>;
      page = <Card rave={this.rave} primarycolor={this.props.primarycolor} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
    }
    
    // This returns the header and body of the payment page to the users based on the selected payment type and page state
    return (
      <View style={styles.container}>
        {header}
        {page}
      </View>
    )
  }
}

// Props to set raves payload

Rave.propTypes = {
  amount: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  country: PropTypes.string,
  currency: PropTypes.string,
  email: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  publickey: PropTypes.string.isRequired,
  secretkey: PropTypes.string.isRequired,
  txref: PropTypes.string,
  redirect_url: PropTypes.string,
  primarycolor: PropTypes.string,
  secondarycolor: PropTypes.string, 
  paymenttype: PropTypes.string.isRequired,
  production: PropTypes.bool,
  meta: PropTypes.array,
  page: PropTypes.string
}

let transactionReference = "txref-"+Date.now();


// Props to set default payload parameters if none is set
Rave.defaultProps = {
  country: "NG",
  currency: "NGN",
  txref: transactionReference,
  primarycolor: '#F5A623',
  secondarycolor: '#12122D',
  paymenttype: 'both',
  production: false,
  meta: [],
  page: "card"
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});