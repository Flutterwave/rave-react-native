import React, { Component } from 'react';
import { Platform, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

export default class VBVSecure extends Component {
  constructor(props) {
    super(props);
    this.numberOfPageLoads = 0;
    this.maxPageLoads = this.props.maxPageLoads || 3;
  }

  _onNavigationStateChange(webViewState) {
    // check if it's the redirected url
    if (webViewState.url.includes("txRef")) {
      // if (webViewState.url.includes("https://ravenative.herokuapp.com/")) {
      // convert to JSON and pass back for validation.
      this.props.confirm(false, JSON.parse(this.getParameterByName('response', webViewState.url)));
    } else {
      console.log("Does not include the URL");
    }
  }

  //Method used to get the response
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  render() {
    let web = <WebView
      source={{ uri: this.props.url }}
      style={{ marginTop: 30, padding: 20 }}
      onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      javaScriptEnabled={true}
    />

    if (Platform.OS === 'ios') {
      web = <WebView
        source={{ uri: this.props.url }}
        scalesPageToFit={false}
        style={{ marginTop: 30, padding: 20 }}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        javaScriptEnabled={true}
      />
    }
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.vbvModal}
        onRequestClose={() => console.log()}>

        {web}
      </Modal>
    );
  }
}
