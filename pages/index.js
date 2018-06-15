import GapiWrapper from '../components/GapiWrapper'
import Demo from '../components/Demo'
import Head from 'next/head'

export default () =>
  <div>
    <Head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
    </Head>
    <GapiWrapper>
      <Demo />
    </GapiWrapper>
  </div>