export default ({ response, onVerify }) => {
  const name = response['Trainer Name']
  return (
    <div>
      <p style={{ fontWeight: 'bold' }}>{name}</p>
      <p>Team: { response.Team }</p>
      <p>XP: { response['Total XP'] }</p>
      <p>Level: { response['Current Level'] }</p>
      <p>Caught: { response['Pokemon Caught'] }</p>
      <p>Walked: { response['KM Walked'] }</p>
      <p>Pokedex: { response['Pokedex Caught'] }</p>
      <input type='button' onClick={onVerify} value={`Verify ${name}`} />
      <hr/>
    </div>
  )
}