# Auth1 Nodejs SDK

## USAGE

```javascript
const Auth1 = require('auth1')
const auth1 = new Auth1({
  clientId: "xxx",
  clientSecret: "yyy"
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
```