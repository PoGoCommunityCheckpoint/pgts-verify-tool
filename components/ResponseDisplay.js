import { Component } from 'react'

export default class ResponseDisplay extends Component {
  constructor(props) {
    super()
    this.state = props.response
  }
  onChange = field => e => {
    this.setState(
      { [field]: e.target.value }
    )
  }
  render() {
    const response = this.state
    const { headings } = this.props
    return (
      <form className='card'>
        <style jsx>{`
          table {
            width: 100%;
          }
        `}</style>
        <div className='card-body'>
        <table><tbody>
          { headings.map((value, index) => {
            if (value.indexOf('Verified') === 0) return null
            if (value.indexOf('Rules') === 0) return null
            const readonly = value.indexOf('Time') === 0
            const id = value.replace(/ /g, '')
            return <tr key={id}>
              <td>
                <label htmlFor={id}>{value}</label>
              </td>
              <td>
                { readonly ?
                  <span> {response[value]}</span> :
                  <input type="text" id={id} value={response[value]} onChange={this.onChange(value)} />
                }
              </td>
            </tr>
          })}
          <tr>
            <td colSpan='2'>
              <input
                className="btn btn-primary"
                style={{ width: '100%' }}
                type='button'
                onClick={() => this.props.onVerify(response)}
                value={`Verify ${response['Trainer Name']}`} />
            </td>
          </tr>
        </tbody></table>
        </div>
      </form>
    )
  }
}