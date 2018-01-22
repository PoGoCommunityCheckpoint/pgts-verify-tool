import React, { Component } from 'react'
import SheetsSelector from './SheetSelector'
import ResponseDisplay from './ResponseDisplay'

// http://cwestblog.com/2013/09/05/javascript-snippet-convert-number-to-column-name/
function toColumnName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

export default class Demo extends Component {
  constructor() {
    super()
    this.state =
      { info: null
      , error: ''
      , id: ''
      , organizerColumn: ''
      }
  }

  setID = id => {
    console.log(this)
    this.setState({ id }, this.fetchSheet)
  }

  fetchSheet = () => {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.state.id,
      range: 'raw-responses!A:Q'
    }).then(response => {
      var range = response.result
      var mapping = response.result.values[0]
        .reduce((mapping, heading, index) => {
          mapping[index] = heading
          if (heading === 'Organizer Name') {
            this.setState({ organizerColumn: toColumnName(index + 1)})
          }
          return mapping
      }, {})
      var responses = response.result.values.slice(1).map((response, rowIndex) => {
        const responseObject = response.reduce((result, value, index) => {
          result[mapping[index]] = value
          return result
        }, {})
        responseObject.rowNumber = rowIndex + 2 // One for heading, one for index
        return responseObject
      }).filter(row => !row['Organizer Name']) // Return only unverified entries.
      this.setState({ info: responses, error: '' })
    }, function(response) {
      this.setState({ error: response.result.error.message})
    })
  }

  verifySubmission = response => {
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: this.state.id,
      range: `raw-responses!${this.state.organizerColumn}${response.rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values: [ [ this.props.username ] ]}
   }).then((response) => {
     this.fetchSheet()
   });
  }

  render() {
    return (
      !this.state.info ?
        <SheetsSelector onSubmit={this.setID} /> :
        <div>
          <input type='button' value='Refresh List' onClick={this.fetchSheet}/>
          { this.state.info.map((row, i) =>
            <ResponseDisplay response={row} key={i} onVerify={() => this.verifySubmission(row)}/>
            )
          }
        </div>
    )
  }
}