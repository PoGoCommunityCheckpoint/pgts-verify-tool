import React, { Component } from 'react'

export default class SheetSelector extends Component {
  constructor() {
    super()
    this.state =
      { fileID: 'https://docs.google.com/spreadsheets/d/191jgLSJlTmVhWY-ar14hAIjfuG_saPM56NObhZ4JBz0'
      , files: []
      , error: ''
      }
  }

  componentDidMount() {
    this.listSheets()
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.state.fileID)
  }

  listSheets = () => {
    gapi.client.drive.files.list({
      'q': 'name contains "TSGo:" and mimeType contains "application/vnd.google-apps.spreadsheet"'
    }).then(response => {
      var files = response.result.files;
      if (files && files.length > 0) {
        this.setState({ files, error: '' })
      } else {
        this.setState({ error: 'There are no PGTS events for your Google account.', files: [] })
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <button onClick={
          e => {
            e.preventDefault()
            this.listSheets()
          }
        }>Refresh Pokémon GO Events</button>
        { !!this.state.files.length && <h3>Select the event to edit</h3> }
        { this.state.error && <p>{this.state.error}</p>}
        <ul>
          { this.state.files.map((file, i) =>
              <li key={i}>
                <button onClick={() => this.setState({ fileID: file.id })}>{file.name}</button>
              </li>
            )
          }
        </ul>
      </form>
    )
  }
}