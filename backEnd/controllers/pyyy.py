import jon
import be64
import requests
from fask import flask, reirect, request
from authlib.integration.request_client import import Outh2session
from authlib.oauth2.rfc7523 import PrivateKeyJWT
import jwt


ISSUER: 'http://localhost:8088',
CLIENT_ID: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmqTrx',
REDIRECT_URI: 'http://localhost:5000/auth/login',
TOKEN_PATH: '/v1/esignet/oauth/v2/token',
USERINFO_PATH: '/v1/esignet/oidc/userinfo',
SCOPES: 'openid profile email'

const PRIVATE_KEY_JWK = {"kty":"RSA","n":"mqTrxm-nn8YJCOAC1r0kGmn2bxwpY-BLBfUxWtKPjXX7LzwJEDzXGtK1p6dWbu2bDrPkS8Vu2QGyCZ59Qg5xxlQWi8fyii-wIGHb4RkBwe_qw6vfBH0NT9zv3It169UguSM9CEbkwM6BzI1ziHXzJTQftNOWts4-7ovkU6WbCsdpvTNkbvDx2dXuc8p89w695qKlXiKmBiEBqtYJArq01-5kYiOmATKptqhg1viiS-UZ7ufotzhIB7NMUCeajHirljEtN5QKuHdoUqip6k1b1s6xdgJdC5m7Xe-guXbutYg_Gv58ZCf1lsH4lmbJhbSef5d23-ZUqVSpIeQzX4HmKw","e":"AQAB","d":"TFiteis3gz6-yR3m6OM6BrxXiKVLnd5my4swkZkwe_NKThiClPykab6rJhkMJ_mwOoL_a5UOU55tqigPyOPesb5j3yCYkjZW6rXFWw0AfCGZMn8QvGOMhegalzRWxFZVMHHAOOzfFH0fQcB30GAC6VQhbyGi359VHGn-EHnK4HemCP-etU0W5c4mRgUDlG-vg_LEmDBRZY-Zo_t60jsrKQ1vMe8ctuT8s9mM6vr-w_r-9ecN2g9Dw44qitjxqzAdCZy11KUf3Te58u7LayF6WBHigVesLM2hqcMi_IMTwNdbIPrHS2zJb1pc5484K4qD0om-YVWcfk4HZM5Jdzr_UQ","p":"_5txRNdh-7YIOqx0_Pythp6Wk_N4iEDDrI-UMz6RGNMhIIYwl4VgtciIbVCkqVtLJbgxRMa0JU4BmUQc3dXD8xTjCeUdRi8sb8d2WW7CWN5sEHwL-qbs7ErcgCJ6kzx2a6u2zYr5zdNWhHjvG0CNv0BaZCQq13Zrmhy5G_YqRDk","q":"muHCUMx8IwDEkCH7aBZlE9Zq3jWG1saJHfo2-yNSq7kHl49HDjbwTKa3CXoYriNMANGWUiZjuoPP_JNCDCS6JY-7MEucwBIziJalxlHm3GDE-SP5la83tlJr65atO6SH1kO9YhEIM5VG-edMp_1d4gQRBMB2xdNp40xtp6Oq5YM","dp":"TMx8hO2d4A46fL6SS-zzik4d-ggeP_oNkMx2_8qdt_K_slD_SpdljljZPNcNEmF-u6-TBhIZ0FeWvWEsty5iOKge6zsux4am-FLa6VYRCLiTiYRr6Py8lOaNR-aUI6b4AbPPMgS-t6v3A8h-Nxb3P-5q-kmvoZtQCzb0G0WkP2k","dq":"Kf2bGRzXawYCRLFx375ymPZA8w3ACOq6sg3sahohh70aedS2hvwOGjn41fDsUAnxyScJgiw2TZL_CJNEDNbIQPa-4VEeplRI9Hcjaqk51fXGcWV3fUWL7TpbV_v563mn-kdTSQslFhcarxYuijz-_w_rLUag7PFse9t0v0Z4RtE","qi":"QjPOaMnK5-V_cK4MZZFygGauHoZhmh2--c7OPTg37eh3sqCL7Lmdyl2IOLCvcGU_BEFKSCdtb9yly85bnHiSw8hFv-f44TAJmxeH_sZJ9Q6ZHhvldutkRcE9hpu2Ig6CcPwX_Zo8VxFYuSX8wIgp3s5tPeyN2E3dWDnA9r8h398"};

def jwt_to_pem(jwt):
   return  jwt.algarith.RSAAlgorithm.from_jwt(jwt).private_bytes(encoding=jwt.algarith.Encoding.PEM, format=jwt.algarith.PrivateFormat.TraditionlOpenSSL, encrytion_lgarithm=jwt.lgarith.NoEcryption()).decode('utf-8')

def base64url_decode(input_str):
   #add padding if necessry
   padding_needed =4-(len(input_str)%4)
   if padding_needed and padding_needed != 4:
        input_str += '=' *padding_needed

   #decodding
   return base64.urlsafe_b64decode(input_str).decode('utf-8')



#handle token exchange and fetches user_info from the OIDC provider
def callback();
   #retrieve the authorisation code from callback URL
   code = request.args.get('code')
   private_key_pem(private_key_jwk)
   client=OAauthsession(CLIENT_ID, private_key_pem, token_endpoint_auth_method='private_key_jwt',     redirect_url=REDIRECT_URi, grant_type= 'authorisation_code',response_type='code' )
   client.register_client_auth_method(PrivateKeyJWT(TOKEN_URL))


  #fetch user info 
  headers = {'Authorisation':f'Bearer {access_token}'}
 response = requests.get(USERINFO_URI, headers-headers)
  return user_info


  
