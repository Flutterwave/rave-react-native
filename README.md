# Rave By Flutterwave React Native Component
This is the react native SDK for [Rave By Flutterwave.](https://rave.flutterwave.com)

<img src="https://raw.githubusercontent.com/kingflamez/Rave-React-Native-Component/master/img/rnapp.png" style="text-align: center; max-height: 400;" alt="Rave React Native App">

<img src="https://github.com/MaestroJolly/rave-react-native/blob/master/img/GhMoney-Mpesa.png" style="text-align: center; max-height: 400;" alt="Mobile Money and Mpesa">

## Table Of Content

- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Deployment](#deployment)
- [Payment Options](#payment-options)
- [Usage](#usage)
- [Parameters Table](#parameters-table)

## Getting Started

### Prerequisites

- [Rave Test Public And Private Keys](https://ravesandbox.flutterwave.com/dashboard/settings/apis)
- [Rave Live Public And Private Keys](https://rave.flutterwave.com/dashboard/settings/apis)
- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/get-npm)
- [React Native](https://facebook.github.io/react-native/docs/getting-started.html)


## Installations

> To use rave react native SDK in your application, you need to have `Node` and `npm` downloaded and installed on your machine.

- [Click Here](https://nodejs.org/en/) to download and install `Node` to your machine, `npm` is always automatically installed when you install `Node`.

- To ensure you have `Node` and `npm` installed, enter the following command into your terminal/command prompt `node -v` and `npm -v` respectively.

- To install `react native` on your machine you can use `npm install -g expo-cli` to install the [Expo CLI](https://expo.io/) command line utility to get you started quickly or use this command `npm install -g react-native-cli` to install the [react native CLI](https://facebook.github.io/react-native/docs/getting-started.html).

## How It Works

This is a simple demonstration of how to set up rave react native SDK for your app.

To set up rave react native SDK into your application, follow the process below;

- Using the [Expo CLI](https://expo.io/) command line utility, enter the following:
  - `expo init AwesomeProject`
  - `cd AwesomeProject`
  - `npm start`

- You should get this from your terminal:

  <img src="https://github.com/MaestroJolly/rave-react-native/blob/master/img/expo-barcode.PNG" style="text-align: center; max-height: 250;" alt="Expo Terminal Image">

- Install the Expo client or mobile application from [Apple Store](https://itunes.apple.com/app/apple-store/id982107779) or [Playstore](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)



[Yarn](https://yarnpkg.com/en/docs/install) or [Node](https://nodejs.org/en/)

You can pull in react-native-rave via npm:

> npm install react-native-rave --save

### OR

> yarn add react-native-rave

`Note:` To use yarn on your machine [click here](https://yarnpkg.com/en/docs/install)

## Deployment

> To Implement Rave By Flutterwave easily with React Native

- Go to [Flutterwave Rave Live](https://rave.flutterwave.com/dashboard/settings/apis) to get your **`LIVE`** public and private key
- Go to [Flutterwave Rave Test](https://ravesandbox.flutterwave.com/dashboard/settings/apis) to get your **`TEST`** public and private key


## Payment Options

### The payment option includes:
- Card Payments
- Account Payments
- Mpesa 
- Ghana Mobile Money Payments
- USSD Payments


## Usage

### 1.  import Rave Component

```javascript
import Rave from 'react-native-rave';
```

### 2. Set your success and failure methods

```javascript
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
```

### 3. Use the rave component with any of the payment props options displayed below

#### Card Payments

To process card transactions, use this payment props

```javascript
render() {
  return (
    <Rave 
        amount="500" 
        country="NG" 
        currency="NGN" 
        email="test@mail.com" 
        firstname="Oluwole" 
        lastname="Adebiyi" 
        publickey="FLWPUBK-**************************-X" 
        secretkey="FLWSECK-**************************-X"
        paymenttype="card" // or set to both for card and account transactions
        page="card"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```

#### Account Payments

To process account payments, use this payment props option.

```javascript
render() {
  return (
    <Rave 
        amount="500" 
        country="NG" 
        currency="NGN" 
        email="test@mail.com" 
        firstname="Oluwole" 
        lastname="Adebiyi" 
        publickey="FLWPUBK-**************************-X" 
        secretkey="FLWSECK-**************************-X"
        paymenttype="account" // or set to both for card and account transactions
        page="card"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```
#### Mpesa

To process mpesa transactions, use this payment props option.

`Note:` Rave currently allows merchants use two (2) payment methods in Kenya (card and Mpesa).

```javascript
render() {
  return (
    <Rave 
        amount="10" 
        country="KE" 
        currency="KES" 
        email="test@mail.com" 
        firstname="Oluwole" 
        lastname="Adebiyi" 
        publickey="FLWPUBK-**************************-X" 
        secretkey="FLWSECK-**************************-X"
        paymenttype="mpesa" // or set to both for card and mpesa transactions
        page="mpesa"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```
#### Ghana Mobile Money

To process ghana mobile money transactions, use this payment props option.

`Note:` Rave currently allows merchants use two (2) payment methods in Ghana (card and mobilemoney)

```javascript
render() {
  return (
    <Rave 
        amount="10" 
        country="GH" 
        currency="GHS" 
        email="test@mail.com" 
        firstname="Oluwole" 
        lastname="Adebiyi" 
        publickey="FLWPUBK-**************************-X" 
        secretkey="FLWSECK-**************************-X"
        redirect_url = "https://rave-webhook.herokuapp.com/receivepayment"
        paymenttype="mobilemoneygh" // or set to both for card and mobile money transactions
        page="mobilemoneygh"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```

#### USSD Payments

`Note:` This is still in development.

## Parameters Table

| props        | parameter           | type | required  |
| ------------- |:-------------:| -----:| -----:|
| publickey      |  This is the publickey gotten from your [Live](https://rave.flutterwave.com/dashboard/settings/apis) or [Test](https://ravesandbox.flutterwave.com/dashboard/settings/apis) dashboard | `String` | Required
| secretkey      |  This is the secretkey gotten from your [Live](https://rave.flutterwave.com/dashboard/settings/apis) or [Test]
| amount      |  This is the amount to be charged from card/account | `String` | Required
| email      |  This is the email of the customer | `String` | Required
| phone      |  This is the phone number of the customer | `String` | Not Required
| firstname      |  This is the firstname of the customer | `String` | Required
| lastname      |  This is the lastname of the customer | `String` | Required
| onSuccess      |  This is the function that receives data for a successful transaction | `Function` | Required
| onFailure      |  This is the function that receives data for a failed transaction | `Function` | Required
| country      |  This is the country you are transacting from eg. NG, GH, KE, ZA | `String` | Not Required (defaults to NG)
| currency      |  This is the currency you want to charge the customer eg. NGN, GHS, KES, ZAR | `String` | Not Required (defaults to NGN)
| txref      |  This is a unique reference for the transaction | `String` | Not Required (will be generated automatically)
| primarycolor      |  This is to override the primary colour of the component | `String` | Not Required
| secondarycolor      |  This is to override the secondary colour of the component | `String` | Not Required
| paymenttype      |  This is the payment type ['both','card', 'account', 'mpesa', 'mobilemoneygh'] | `String` | Required ('if non set, it sets a default payment type to both')
| page      |  This sets the current state of payment page based on the payment type currently implemented ['both','card', 'account', 'mpesa', 'mobilemoneygh']  | `String` | Required ('If no value is set, card page is set by default')
| production      |   Set to `true` if you want your transactions to run in the production environment otherwise set to `false`. Defaults to false  | `Boolean` | Not Required ('defaults to false')
| redirect_url      |   Set your webhook url here if you want rave to send you webhook request to the provided webhook url to check the transaction status when a customer completes a transaction  | `String` | Required for Mpesa and Ghana Mobile Money ('defaults to false')
| meta      |  This is additional information that can be sent to the server eg [{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]  | `Array of Objects` | Not Required

