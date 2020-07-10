const {fetch} = require('./fetch')
const API = `https://api.auth1.owenyoung.com/api/v1`
const OAUTH_API = `https://auth.owenyoung.com/api/v1`

class Auth1 {
  constructor({clientId,clientSecret,endpoint=API,oauthEndpoint=OAUTH_API}={}){
    this.connectionMap = {}
    this.endpoint = endpoint
    this.oauthEndpoint = oauthEndpoint;
    if(clientId && clientSecret){
      this.clientId = clientId;
      this.clientSecret = clientSecret;
    }else{
      throw new Error('Miss param clientId or clientSecret')
    }
  }
  getAccessToken(){
    return new Promise((resolve,reject)=>{
      if(this.accessToken && !isExpired(this.accessToken.expiresAt)){
          return resolve(this.accessToken)
      }else{
        //expires fetch new token
        return fetch(`${this.oauthEndpoint}/oauth/token`,{
          body:JSON.stringify({
            "client_id": this.clientId,
            "client_secret": this.clientSecret,
            "grant_type": "client_credentials"
        })}).then(data=>{          
          if(data.data && data.data.access_token){
            this.accessToken = data.data
            return resolve(this.accessToken)
          }else{
            return reject(data)
          }
        })
      }
    })
    
  }
  async getConnectionAccessToken({connectionId}={}){
    if(!connectionId){
      throw new Error('Miss param connectionId')
    }
    const {access_token} = await this.getAccessToken();
    if(this.connectionMap[connectionId] && !isExpired(this.connectionMap[connectionId].expiresAt)){
      return this.connectionMap[connectionId]
    }else{
      return fetch(`${this.endpoint}/connections/${connectionId}`,{
       headers:{
        Authorization:`Bearer ${access_token}`
       }
      }).then(data=>{
        if(data.data && data.data.connection_status === 'active'){
          this.connectionMap[connectionId] = data.data.auth
          this.connectionMap[connectionId].expires_at = data.data.expires_at
          return this.connectionMap[connectionId]
        }else{
          return reject(new Error('connection status is inactive'))
        }
      })
    }
  }
}

function isExpired(expiresAt){
  if(expiresAt-getTimestamp()>60*5){
    return false
  }else{
    return true
  }
}

function getTimestamp(){
    return Math.floor(Date.now() / 1000);
}

module.exports = Auth1;