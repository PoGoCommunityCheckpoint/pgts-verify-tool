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
    this.setState({ id }, this.fetchSheet)
  }

  fetchSheet = () => {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.state.id,
      range: 'Form Data'
    }).then(response => {
      var range = response.result
      var mapping = response.result.values[0]
        .reduce((mapping, heading, index) => {
          mapping[index] = heading
          return mapping
        }, {})
      var headings = response.result.values[0]
      var responses = response.result.values.slice(1).map((response, rowIndex) => {
        const responseObject = response.reduce((result, value, index) => {
          result[mapping[index]] = value
          return result
        }, {})
        responseObject.rowNumber = rowIndex + 2 // One for heading, one for index
        return responseObject
      }).filter(row => !row['Verified By']) // Return only unverified entries.
      .filter(row => row.Timestamp)
      this.setState({ error: '', responses, headings })
    }, function(response) {
      this.setState({ error: response.result.error.message})
    })
  }

  verifySubmission = response => {
    const { headings } = this.state
    console.log(response, headings)
    const lastColumnLetter = toColumnName(headings.length)
    response['Verified By'] = 'me'
    response['Verified At'] = (new Date).toLocaleString()
    const responseArray =
      headings.map(fieldName => response[fieldName])
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: this.state.id,
      range: `Form Data!A${response.rowNumber}:${lastColumnLetter}${response.rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values: [ responseArray ]}
   }).then((response) => {
     this.fetchSheet()
   });
  }

  render() {
    const { responses, headings, error} = this.state
    return (
      !responses ?
        <SheetsSelector onSubmit={this.setID} /> :
        <div>
          <h2>Unverified Responses</h2>
          <input type='button' value='Refresh List' onClick={this.fetchSheet}/>
          { responses.map((row, i) =>
            <ResponseDisplay response={row} headings={headings} key={i} onVerify={editedRow => this.verifySubmission(editedRow)}/>
            )
          }
        </div>
    )
  }
}