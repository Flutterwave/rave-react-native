# Rave By Flutterwave React Native Component

<img src="https://raw.githubusercontent.com/kingflamez/Rave-React-Native-Component/master/img/rnapp.png" style="text-align: center;max-height: 400;" alt="Rave React Native App">

<img src="https://github.com/MaestroJolly/rave-react-native/blob/master/img/GhMoney-Mpesa.png" style="text-align: center;max-height: 400;" alt="Mobile Money and Mpesa">


> Implement Rave By Flutterwave easily with React Native

- Go to [Flutterwave Rave Live](https://rave.flutterwave.com/dashboard/settings/apis) to get your **`LIVE`** public and private key
- Go to [Flutterwave Rave Test](https://ravesandbox.flutterwave.com/dashboard/settings/apis) to get your **`TEST`** public and private key

## Installation

[Yarn](https://yarnpkg.com/lang/en/docs/install/) or [Node](https://nodejs.org/en/)

You can pull in react-native-rave via npm:

> npm install react-native-rave --save

### OR

> yarn add react-native-rave

## Payment Types

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

#### `Card Payments`

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
        paymenttype="card"
        page="card"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```

#### `Account Payments`

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
        paymenttype="account"
        page="card"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```
#### `Mpesa`

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
        paymenttype="mpesa"
        page="mpesa"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```
#### `Ghana Mobile Money`

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
        paymenttype="mobilemoneygh"
        page="mobilemoneygh"
        meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
        production={false} 
        onSuccess={res => this.onSuccess(res)} 
        onFailure={e => this.onFailure(e)}
        />
  );
}
```

#### `USSD Payments`

`Note:` This is still in development.

## Parameters Table

| props        | parameter           | type | required  |
| ------------- |:-------------:| -----:| -----:|
| publickey      |  This is the publickey gotten from your [Live](https://rave.flutterwave.com/dashboard/settings/apis) or [Test](https://ravesandbox.flutterwave.com/dashboard/settings/apis) dashboard | `String` | Required
| secretkey      |  This is the secretkey gotten from your [Live](https://rave.flutterwave.com/dashboard/settings/apis) or [Test](https://ravesandbox.flutterwave.com/dashboard/settings/apis) dashboard
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

