const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const base64url = require('base64url');

const app = express();

// OIDC Provider details
const ISSUER = 'http://localhost:8088'; // OIDC Provider URL
const CLIENT_ID = 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo2g2s'; // Client ID
const REDIRECT_URI = 'http://localhost:13130/userprofile'; // Callback URL for OIDC
const TOKEN_URL = `${ISSUER}/v1/esignet/oidc/token`;
const USERINFO_URL = `${ISSUER}/v1/esignet/oidc/userinfo`;
const SCOPES = 'openid profile';

const privateKeyJwk ={"kty":"RSA","n":"o2g2s6dPTptGpTVbDWaSLOl9uqYOVU-x_emVLvN-bL5piZgxe7DkT8c8gsvw0YYLNM93lH7IYLU0VHHu8OQvZkZGx1eKMCiouEeA7GU6hgpb7UGMWIx3HcuQESaopjluWoTLXb4LRCJpCcEYsO7kumJdwEqZQRw2HkInLCSkiJafgHuvU9VhYJNBPeelXOW849kWmz6VZHvoeVLMgkOLnSzrcV3WyzQcBAd3hZVXWU9OXEJTwvT7bjO-5ZBtUXZdbl2IwYhcUeLl8p_GXK_pIsqbEM8MPIjZlZnxUV0yLcmqk5i9NMdL_PReXT1b6BHydLwSlUhjjOm3LIQXl7ZKWQ","e":"AQAB","d":"UDqNiP1fadfBAsJElzrCEDz_lxGKvgYn_OOfdHLmopuGk6Dewr0iC61ln05kSWsHu4EVVBo_ZYPyUnex-iH-x7c_bwYi-ewsknXA7c_xwPf7FGz3bE5i-YUFkfYqHZra_KRwePEi9Ov0KG7fIZfZQ02ifBPkVNx2EbsnInxHMCwCP0ruTbW9YAXsCQUehg28JB8VViVVsTIzHjz-qMbFxu1CrqcBm0j-eo2Gy1sUVJwUXD17QTRRV3bbPzZzKUdDiNx3j_YahQ7md3QAnC9BbLh_2ijfZyEdQJxHUYnizYb-BX71uOAE0T_eIIzdoaTIkINTDx-jqMhJ6mcut9to0Q","p":"3ynsmnpFd_9_OS-e9cockskoyjDRXdTLvOrj7cw8LkfpXval7LBpV0KgL2tpcu3WDNDDXLklhl3ogQe8I0cwtwrzlPk_wgviLj43aJRM8FfsqPgnGELZnKE4vRoYaSlZ745SFXIfrSL3LUqbUBcnRJCTHQd1OYsPwUzJTmDIUL0","q":"u3Nj2AVsVveKJUtmkHCxOzX1xD9Ah434dK8z8t2K8cEnoFaVs56kV89JX0-QrF9QSnYGJC7heSeeixAfGrpd3I0_GRGVt1v5UoJ21G_cgLRylTyWZ9SbAMMCL6SEzexCgyRL66JfFIjRCG4klCVbu3Y5lzNHtIicRaaxPOLt380","dp":"szFm22PzBDgUYEbszVBNQVBlgHVSqJWGQ1wZSYkFieQUcDx9X2EINRk6ptkJA1AW4JOBS6MfjpU5bOJZH7q6U0Bn9udtWtNP-vHabA8o-JShY8xfGAwV0L9kX_PkRgz-Om19W9sXtF6vO578t4Lf9R5iAp1Kc7pGHGEcA-OS9cE","dq":"Cb9mYcVmbN9Sf738B2bU0I9tyFbBtErdsLOrr-V1ZDz3Io9eGYkWYrqUxjANBemu8zBQAXGup-43gGPGOk2Ws_FkZplTf8V4oaHHLCTlAoxfqQMNjzivFssNQgz8Gvk-PDOW_xnid97lf9q6bDnFG2p6dDJmeCzic3zHmrLyS8E","qi":"CKX1MxZmjxsdkz-cHevDScJ2iiCRwp4cgHT3ftz-XLf5YZt34g0Ev7ZGdJ1u0vIJ6fCgadHnk-kcA5S9F1LJ9s5zJdjNiXWvdxYqoZGGsphb4-H31QE6KMqpX2ygBuXiGOha2dMBfgdPZ2J0XN3bETJMDSufkcI8ehYmLmfdRiM"}

// Convert JWK to PEM
function jwkToPem(jwk) {
    const keyObject = {
        kty: jwk.kty,
        n: jwk.n,
        e: jwk.e
    };
    return jwt.sign(keyObject, { algorithm: 'RS256' });
}

// Base64 URL decode
function base64urlDecode(inputStr) {
    let paddingNeeded = 4 - (inputStr.length % 4);
    if (paddingNeeded && paddingNeeded !== 4) {
        inputStr += '='.repeat(paddingNeeded);
    }
    return Buffer.from(inputStr, 'base64').toString('utf-8');
}

// Handle token exchange and fetch user info
app.get('/delegate/fetchUserInfo', async (req, res) => {
    try {
        const code = req.query.code;
        const privateKeyPem = jwkToPem(privateKeyJwk);

        // Generate JWT for private key authentication
        const clientAssertion = jwt.sign(
            {
                iss: CLIENT_ID,
                sub: CLIENT_ID,
                aud: TOKEN_URL,
                exp: Math.floor(Date.now() / 1000) + 300
            },
            privateKeyPem,
            { algorithm: 'RS256' }
        );

        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            TOKEN_URL,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                client_assertion_type:
                    'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: clientAssertion
            })
        );

        const accessToken = tokenResponse.data.access_token;
        console.log(`Access Token: ${accessToken}`);

        // Fetch user info using access token
        const userInfoResponse = await axios.get(USERINFO_URL, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const parts = userInfoResponse.data.split('.');
        const userInfo = JSON.parse(base64url.decode(parts[1]));
        res.json(userInfo);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Start Express server
const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
 