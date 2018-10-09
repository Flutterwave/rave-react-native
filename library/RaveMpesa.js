import React from 'react'
import encryption from './encryption';
import Axios from 'axios';

export default class RaveMpesa {
  constructor({ publicKey, secretKey, production = false, currency = "KES", country = "KE", txRef = "txref-" + Date.now(), amount, email, firstname, lastname, redirect_url, is_mpesa = true }) {
    var baseUrlMap = ["https://ravesandboxapi.flutterwave.com/", "https://api.ravepay.co/"]
    this.baseUrl = (production) ? baseUrlMap[1] : baseUrlMap[0];

    this.getPublicKey = function () {
      return publicKey;
    }
    this.getSecretKey = function () {
      return secretKey;
    }
    this.getCountry = function () {
      return country;
    }
    this.getCurrency = function () {
      return currency;
    }
    this.getTransactionReference = function () {
      return txRef;
    }
    this.getAmount = function () {
      return amount;
    }
    this.getEmail = function () {
      return email;
    }
    this.getFirstname = function () {
      return firstname;
    }
    this.getLastname = function () {
      return lastname;
    }
    this.getRedirecturl = function () {
      return redirect_url;
    }
    this.getMpesa = function () {
      return is_mpesa;
    }


    this.charge = function (payload) {
      //insert constant data
      payload.PBFPubKey = this.getPublicKey();
      payload.currency = this.getCurrency();
      payload.country = this.getCountry();
      payload.txRef = this.getTransactionReference();
      payload.amount = this.getAmount();
      payload.email = this.getEmail();
      payload.firstname = this.getFirstname();
      payload.lastname = this.getLastname();
      payload.redirect_url = this.getRedirecturl();
      payload.is_mpesa = this.getMpesa();
      

      return new Promise((resolve, reject) => {
        var client = encryption({ payload, secretkey: this.getSecretKey() });

        Axios({
          url: this.baseUrl + 'flwv3-pug/getpaidx/api/charge',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: {
            PBFPubKey: this.getPublicKey(),
            client,
            alg: "3DES-24"
          },
        })
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error.response.data);
          });
      })
    }
  }

  initiatecharge(payload) {
    return new Promise((resolve, reject) => {
      this.charge(payload).then((response) => {
        resolve(response);
      }).catch((e) => {
        reject(e);
      })
    })
  }

  getAccountFees({ amount, currency }) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/fee',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          PBFPubKey: this.getPublicKey(),
          amount,
          currency,
          ptype: 2
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

  verifyTransaction(txref) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/v2/verify',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          txref,
          SECKEY: this.getSecretKey()
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

}