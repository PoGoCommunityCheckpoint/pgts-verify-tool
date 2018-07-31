import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'

class GapiWrapper extends Component {
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
    const CLIENT_ID = '190245585824-sol8t549oi1tpr89fb6cek2igjou52mc.apps.googleusercontent.com'
    const API_KEY = 'AIzaSyDGQt7BUYWYgfHkaxpDT_udMCK6h3bVovU'
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4","https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata"

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
)(GapiWrapper)
