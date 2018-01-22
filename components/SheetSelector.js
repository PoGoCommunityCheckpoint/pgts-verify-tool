import React, { Component } from 'react'

export default class SheetSelector extends Component {
  constructor() {
    super()
    this.state =
      { sheetURL: 'https://docs.google.com/spreadsheets/d/191jgLSJlTmVhWY-ar14hAIjfuG_saPM56NObhZ4JBz0'
      }
  }

  onSubmit = e => {
    e.preventDefault()
    const idMatches = (/\/d\/([^/]+)/g).exec(this.state.sheetURL)
    console.log(idMatches)
    if (idMatches[1]) {
      this.props.onSubmit(idMatches[1])
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor='sheet-url'>Form Responses Sheet</label>
        <input
          id='sheet-url'
          type='text'
          value={this.state.sheetURL}
          onChange={e => this.setState({ sheetURL: e.target.value })}
        />
        <input type='submit' value='Load Sheet' />
      </form>
    )
  }
}