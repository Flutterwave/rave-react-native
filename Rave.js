import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import PropTypes from 'prop-types';
import MpesaHeader from './src/components/payment-headers/MpesaHeader';
import MmoneyHeader from './src/components/payment-headers/MmoneyHeader';
import AccountHeader from './src/components/payment-headers/AccountHeader';
import CardHeader from './src/components/payment-headers/CardHeader';
import UgMmoneyHeader from './src/components/payment-headers/UgMmoneyHeader';
import RwMmoneyHeader from './src/components/payment-headers/RwMmoneyHeader';
import ZMmoneyHeader from './src/components/payment-headers/ZMmobileMoneyHeader';
import Card from './src/components/Card';
import Account from './src/components/Account';
import Mpesa from './src/components/Mpesa';
import Mmoney from './src/components/Mmoney';
import UgMmoney from './src/components/UgandaMobileMoney';
import RwMmoney from './src/components/RwandaMobileMoney';
import ZMmoney from './src/components/ZambiaMobileMoney';
// import Ussd from './src/components/Ussd';
import RavePayment from './library/RavePayment';
import RaveMpesa from './library/RaveMpesa';
import RaveUssd from './library/RaveUssd';
import RaveMmoney from './library/RaveMmoney';
import RaveUgandaMobileMoney from './library/RaveUgandaMobileMoney';
import RaveRwandaMobileMoney from './library/RaveRwandaMobileMoney';
import RaveZambiaMobileMoney from './library/RaveZambiaMobileMoney';
import Home from './src/components/Home';


export default class Rave extends React.Component {
    constructor(props) {
        super(props);
        this.rave = new RavePayment({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            subaccounts: props.subaccounts,
            meta: props.meta,
            threeDsOverride: props.threeDsOverride,
            redirectUrl: props.redirecturl,
            paymentPlan: props.paymentplan
        });
        this.ravempesa = new RaveMpesa({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            is_mpesa: props.is_mpesa,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.ravemmoney = new RaveMmoney({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            is_ussd: props.is_ussd,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.raveugandamobilemoney = new RaveUgandaMobileMoney({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.raverwandamobilemoney = new RaveRwandaMobileMoney({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.ravezambiamobilemoney = new RaveZambiaMobileMoney({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            amount: props.amount,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.raveussd = new RaveUssd({
            publicKey: props.publickey,
            encryptionKey: props.encryptionkey,
            currency: props.currency,
            country: props.country,
            txRef: props.txref,
            amount: props.amount,
            phone: props.phone,
            email: props.email,
            firstname: props.firstname,
            lastname: props.lastname,
            meta: props.meta
        });
        this.state = {page: props.page, bottomOne: 1, bottomTwo: 90, colorOne: '#000', colorTwo: '#000'};
        this.getPage = this.getPage.bind(this);
    }

    // this method gets the page data and sets its state based on the data gotten
    getPage(data) {
        this.setState({
            page: data
        })
    }

    render() {
        let page, header1, header2;
        var {height} = Dimensions.get('window');
        header1 = <View></View>;
        header2 = <View></View>


        if (this.props.country == 'KE' && this.props.currency == 'KES' && this.props.paymentOption == 'card,mpesa') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mpesa') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "mpesa") {
                header1 = <MpesaHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                       colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Mpesa rave={this.ravempesa} primarycolor={this.props.primarycolor} phone={this.props.phone}
                              secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                              currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                              onFailure={e => this.props.onFailure(e)}/>;
            } else if (this.state.page == "card") {
                header1 = <MpesaHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                       colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <MpesaHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                       colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>
                page = <Home onClose={this.props.onClose}/>;
            }
        }

        if (this.props.country == 'KE' && this.props.currency == 'KES' && this.props.paymentOption == 'mpesa') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mpesa') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            }
            if (this.state.page == "mpesa") {
                header2 = <MpesaHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                       colorOne={this.state.colorOne}/>;
                page = <Mpesa rave={this.ravempesa} primarycolor={this.props.primarycolor} phone={this.props.phone}
                              secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                              currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                              onFailure={e => this.props.onFailure(e)}/>;

            } else {
                header2 = <MpesaHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                       colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />
                page = <Home/>;
            }
        }

        if (this.props.country == 'KE' && this.props.currency == 'KES') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "card") {
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>
                page = <Home/>;
            }
        } else if (this.props.country == 'GH' && this.props.currency == 'GHS' && this.props.paymentOption == 'card,mobilemoneygh') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "mobilemoneygh") {
                header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                        colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Mmoney rave={this.ravemmoney} primarycolor={this.props.primarycolor} phone={this.props.phone}
                               secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                               currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                               onFailure={e => this.props.onFailure(e)}/>;
            } else if (this.state.page == "card") {
                header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                        colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                        colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.country == 'GH' && this.props.currency == 'GHS' && this.props.paymentOption == 'mobilemoneygh') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            }
            if (this.state.page == "mobilemoneygh") {
                header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                        colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Mmoney rave={this.ravemmoney} primarycolor={this.props.primarycolor} phone={this.props.phone}
                               secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                               currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                               onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                        colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.country == 'GH') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "card") {
                // header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                // header1 = <MmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.currency == 'UGX' && this.props.paymentOption == 'card,mobilemoneyuganda') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneyuganda') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "mobilemoneyuganda") {
                header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <UgMmoney rave={this.raveugandamobilemoney} primarycolor={this.props.primarycolor}
                                 phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                 amount={this.props.amount} currency={this.props.currency}
                                 onSuccess={res => this.props.onSuccess(res)}
                                 onFailure={e => this.props.onFailure(e)}/>;
            } else if (this.state.page == "card") {
                header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }


        } else if (this.props.currency == 'UGX' && this.props.paymentOption == 'mobilemoneyuganda') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneyuganda') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            }
            if (this.state.page == "mobilemoneyuganda") {
                header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <UgMmoney rave={this.raveugandamobilemoney} primarycolor={this.props.primarycolor}
                                 phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                 amount={this.props.amount} currency={this.props.currency}
                                 onSuccess={res => this.props.onSuccess(res)}
                                 onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Home/>;
            }
        } else if (this.props.currency == 'UGX') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "card") {
                // header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                // header1 = <UgMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home/>;
            }
        } else if (this.props.currency == 'ZMW' && this.props.paymentOption == 'card,mobilemoneyzambia') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneyzambia') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "mobilemoneyzambia") {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <ZMmoney rave={this.ravezambiamobilemoney} primarycolor={this.props.primarycolor}
                                phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                amount={this.props.amount} currency={this.props.currency}
                                onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)}/>;
            } else if (this.state.page == "card") {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.currency == 'ZMW' && this.props.paymentOption == 'mobilemoneyzambia') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneyzambia') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            }
            if (this.state.page == "mobilemoneyzambia") {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <ZMmoney rave={this.ravezambiamobilemoney} primarycolor={this.props.primarycolor}
                                phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                amount={this.props.amount} currency={this.props.currency}
                                onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Home/>;
            }
        } else if (this.props.currency == 'ZMW') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "card") {
                header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                // header1 = <ZMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home/>;
            }
        } else if (this.props.currency == 'RWF' && this.props.paymentOption == 'card,mobilemoneygh') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }
            if (this.state.page == "mobilemoneygh") {
                header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <RwMmoney rave={this.raveugandamobilemoney} primarycolor={this.props.primarycolor}
                                 phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                 amount={this.props.amount} currency={this.props.currency}
                                 onSuccess={res => this.props.onSuccess(res)}
                                 onFailure={e => this.props.onFailure(e)}/>;
            } else if (this.state.page == "card") {
                header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.currency == 'RWF' && this.props.paymentOption == 'mobilemoneygh') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            }
            if (this.state.page == "mobilemoneygh") {
                header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <RwMmoney rave={this.raveugandamobilemoney} primarycolor={this.props.primarycolor}
                                 phone={this.props.phone} secondarycolor={this.props.secondarycolor}
                                 amount={this.props.amount} currency={this.props.currency}
                                 onSuccess={res => this.props.onSuccess(res)}
                                 onFailure={e => this.props.onFailure(e)}/>;
            } else {
                header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                          colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.currency == 'RWF') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'mobilemoneygh') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';
            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            } else if (this.state.page == "card") {
                // header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Card rave={this.rave} phone={this.props.phone} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
            } else {
                // header1 = <RwMmoneyHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;
                page = <Home onClose={this.props.onClose}/>;
            }
        } else if (this.props.paymentOption == 'account') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';

            } else if (this.state.page == 'account') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';

            }

            if (this.state.page == "account") {
                page = <Card rave={this.rave} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;

                // }else if (this.state.page == "ussd") {
                //   page = <Ussd rave={this.raveussd} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
            } else if (this.state.page == "account") {
                page = <Account rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone}
                                secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                                currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                                onFailure={e => this.props.onFailure(e)}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;

            } else {
                page = <Home onClose={this.props.onClose}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                // header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo} colorTwo={this.state.colorTwo} />;

            }
        } else if (this.props.paymentOption == 'card,account') {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';

            } else if (this.state.page == 'account') {
                this.state.bottomOne = height - 110;
                this.state.bottomTwo = 1;
                this.state.colorOne = '#F5A623';
                this.state.colorTwo = '#000';

            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }

            if (this.state.page == "card") {
                page = <Card rave={this.rave} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;

                // }else if (this.state.page == "ussd") {
                //   page = <Ussd rave={this.raveussd} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
            } else if (this.state.page == "account") {
                page = <Account rave={this.rave} primarycolor={this.props.primarycolor} phone={this.props.phone}
                                secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                                currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                                onFailure={e => this.props.onFailure(e)}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;

            } else {
                page = <Home onClose={this.props.onClose}/>;
                header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne}
                                         colorOne={this.state.colorOne}/>;
                header2 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;

            }
        } else {
            if (this.state.page == 'home') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = 90;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#000';

            } else if (this.state.page == 'card') {
                this.state.bottomOne = 1;
                this.state.bottomTwo = height - 110;
                this.state.colorOne = '#000';
                this.state.colorTwo = '#F5A623';
            }

            if (this.state.page == "card") {
                page = <Card rave={this.rave} primarycolor={this.props.primarycolor}
                             secondarycolor={this.props.secondarycolor} amount={this.props.amount}
                             currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)}
                             onFailure={e => this.props.onFailure(e)}/>;
                // header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomTwo}
                                      colorTwo={this.state.colorTwo}/>;

                // }else if (this.state.page == "ussd") {
                //   page = <Ussd rave={this.raveussd} primarycolor={this.props.primarycolor} phone={this.props.phone} secondarycolor={this.props.secondarycolor} amount={this.props.amount} currency={this.props.currency} onSuccess={res => this.props.onSuccess(res)} onFailure={e => this.props.onFailure(e)} />;
            } else {
                page = <Home onClose={this.props.onClose}/>;
                // header1 = <AccountHeader page={this.getPage} showOne={this.show} bottomOne={this.state.bottomOne} colorOne={this.state.colorOne} />;
                header1 = <CardHeader page={this.getPage} showTwo={this.show} bottomTwo={this.state.bottomOne}
                                      colorTwo={this.state.colorTwo}/>;

            }
        }


        // This returns the header and body of the payment page to the users based on the selected payment type and page state
        return (
            <View style={styles.container}>
                {page}
                {header1}
                {header2}
            </View>
        )
    }
}

// Props to set raves payload

Rave.propTypes = {
    amount: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    country: PropTypes.string,
    currency: PropTypes.string,
    paymentOption: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    publickey: PropTypes.string.isRequired,
    encryptionkey: PropTypes.string.isRequired,
    txref: PropTypes.string,
    primarycolor: PropTypes.string,
    secondarycolor: PropTypes.string,
    subaccounts: PropTypes.array,
    threeDsOverride: PropTypes.number,
    meta: PropTypes.array,
    redirecturl: PropTypes.string,
    paymentplan: PropTypes.number
}

let transactionReference = "txref-" + Date.now();


// Props to set default payload parameters if none is set
Rave.defaultProps = {
    country: "NG",
    currency: "NGN",
    paymentOption: '',
    txref: transactionReference,
    primarycolor: '#F5A623',
    secondarycolor: '#12122D',
    meta: [],
    redirecturl: "https://rave-loader.herokuapp.com/index.html"
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff',
        justifyContent: 'center',
        width: '100%'
    }
});