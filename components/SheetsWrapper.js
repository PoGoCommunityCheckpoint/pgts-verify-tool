import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'

class SheetsWrapper extends Component {
  constructor() {
    super()
    this.state =
      { signedIn: false
      , apiReady: false
      , currentUser: null
      }
  }
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        window.gapi.load('client:auth2', this.initSheetsClient)
      }
      else this.props.onError()
    }
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initSheetsClient()
    }
  }

  initSheetsClient = () => {
    const CLIENT_ID = '722909521465-25qaq3a1v3fr1djl72nk1uobidu4llu7.apps.googleusercontent.com'
    const API_KEY = 'AIzaSyC2RYEj649zqatLnc6Zm7JLlouttQz96so'
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets"

    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      this.setState({ apiReady: true })
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.setSignedIn);

      // Handle the initial sign-in state.
      this.setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get())
    })
  }

  setSignedIn = signedIn => {
    this.setState({ signedIn })
    if (signedIn) {
      const currentUser =
        window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
      this.setState({ currentUser })
    } else {
      this.setState({ currentUser: null })
    }
  }
  signIn = () => window.gapi.auth2.getAuthInstance().signIn()
  signOut = () => window.gapi.auth2.getAuthInstance().signOut()

  render() {
    return (
      <div>
        { !this.state.apiReady ?
          'Loading Application...' :
          this.state.signedIn ?
            <div>
              Logged in as {this.state.currentUser}&nbsp;
              <button onClick={this.signOut}>Sign Out</button>
              <div>
              { React.cloneElement(this.props.children, { username: this.state.currentUser }) }
              </div>
            </div> :
            <button onClick={this.signIn}>Sign In</button>
        }
      </div>
    )
  }
}

export default scriptLoader(
  'https://apis.google.com/js/api.js'
)(SheetsWrapper)