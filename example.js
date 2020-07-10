const dotenv = require('dotenv')
dotenv.config()

const Auth1 = require('./index')
const auth1 = new Auth1({
  clientId: process.env.AUTH1_CLIENT_ID,
  clientSecret: process.env.AUTH1_CLIENT_SECRET
})
auth1.getAccessToken().then(data=>{
  console.log('data',data);
  // data.access_token = 'xxx'
  // data.expires_in = 21234
  // data.type = "Bearer"
}).catch(e=>{
  console.log('error',e);
  
})

auth1.getConnectionAccessToken({
  connectionId: 'joeCJ_s9JIfDkT6sWUHHx'
}).then(data=>{
  console.log('data',data);
  // data.access_token
  // data.expires_at
})