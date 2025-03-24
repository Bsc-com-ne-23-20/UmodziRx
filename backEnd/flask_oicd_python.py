import json
import base64
import requests
from flask import flask, redirect, request
from authlib.integrations.requests_client import OAuth2Session
import authlib.oauth2.rfc7523 import PrivateKeyJWT
import jwt


app = Flask(__name__)

#OIDC Provider details
ISSUER = 'http://localhost:8080' #OIDC Provider URL
CLIENT_ID = 'your_client_id' #Client ID
REDIRECT_URI = 'http://localhost:13130/userprofile' #Call back URL for OIDC
TOKEN_URL = f'{ISSUER}/v1/esignet/oidc/userinfo'
USERINFO_URL = f'{ISSUER}/v1/esignet/oidc/userinfo'
SCOPES = 'openid profile'

private_key_jwk = {"kty":"RSA","n":"hhhhhh-hhhhh"}

##Utility methods
def jwk_to_pem(jwk):
    return jwt.algorithms.RSAAlgorithm.from_jwk(jwk).private_bytes(encoding=jwt.algorithms.Encoding.PEM, format=jwt.algorothms.PrivateFormat.TraditionalOpenSSl,
                                                                   encryption_algorithm=jwt.algorithms.NoEncryption()).decode('utf-8')
def_base64url_decode(input_str):
    #add padding
    padding_needed = 4 - (len(input_str) % 4)
    if padding_needed and padding_needed != 4:
    input_str += '=' * padding_needed
    
    #Decode  the base64url-encoded string
    return base64.urlsafe_b64decode(input_str).decode('utf-8')

##handle token exchange and fetches info from 0idc provider
@app.route('/delegate/fectchUserInfo')
def callback():
    #receive the authorisation code from  the callback url
    code = request.args.get('code')
    private_key_pem = jwk_to_pem(private_key_jwk)
    
    client = OAuth2Session(CLIENT_ID, private_key_pem, token_endpoint_auth_method='private_key_jwt',
                           redirect_uri = REDIRECT_URI, grant_type= 'authorization_code', response_type = 'code')
    
    client.register__client.auth_method(PrivateKeyJWT(TOKEN_URL))
    
    token_response = client.fetch_token(TOKEN_URL, code=code)
    access_token = token_response['acces_token']
    print(f"token_response {access_token}")
    
    #fetch user info 
    headers = {'Authorization': f'Bearer {access_token}'}
    response = request.get(USERINFO_URL, headers=headers)
    parts = response.text.split('.')
    user_info = json.loads{base64url_decode(parts[1])}
    return user_info

if __name__ "" '__main__':
    #Run Flask app 
    app.run(host = '0.0.0.0', port=13130, debug=True)