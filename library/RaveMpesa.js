import React from 'react'
import encryption from './encryption';
import Axios from 'axios';

export default class RaveMpesa {
    constructor({publicKey, encryptionKey, currency = "KES", country = "KE", txRef = "txref-" + Date.now(), amount, email, firstname, lastname, is_mpesa = true, is_mpesa_lipa = true}) {
        var baseUrlMap = "https://api.ravepay.co/"
        this.baseUrl = baseUrlMap;

        this.getPublicKey = function () {
            return publicKey;
        }
        this.getEncryptionKey = function () {
            return encryptionKey;
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
        this.getMpesa = function () {
            return is_mpesa;
        }
        this.getMpesaLipa = function () {
            return is_mpesa_lipa;
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
            payload.is_mpesa = this.getMpesa();
            payload.is_mpesa_lipa = this.getMpesaLipa();


            return new Promise((resolve, reject) => {
                var client = encryption({payload, encryptionkey: this.getEncryptionKey()});

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

    getAccountFees({amount, currency}) {
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

    // verifyTransaction(txref) {
    //   return new Promise((resolve, reject) => {
    //     Axios({
    //       url: this.baseUrl + 'flwv3-pug/getpaidx/api/v2/verify',
    //       method: 'post',
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //       data: {
    //         txref,
    //         SECKEY: this.getSecretKey()
    //       },
    //     })
    //       .then(function (response) {
    //         resolve(response.data);
    //       })
    //       .catch(function (error) {
    //         reject(error.response.data);
    //       });
    //   })
    // }

}