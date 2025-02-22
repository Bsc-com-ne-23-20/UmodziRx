import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock MOSIP API endpoints
const mosipHandlers = [
  rest.post('https://api.mosip.io/v1/auth/initiate', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        transactionId: 'mock-transaction-id',
        authMethods: ['OTP', 'BIO'],
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      })
    );
  }),

  rest.post('https://api.mosip.io/v1/auth/verify', (req, res, ctx) => {
    const { digitalId } = req.body;
    
    // Accept any non-empty digital ID
    if (digitalId && digitalId.trim() !== '') {
      return res(
        ctx.status(200),
        ctx.json({
          authCode: 'mock-auth-code',
          status: 'SUCCESS',
          message: 'Verification successful',
          timestamp: new Date().toISOString()
        })
      );
    }
    
    return res(
      ctx.status(400),
      ctx.json({
        status: 'FAILED',
        message: 'Invalid Digital ID'
      })
    );
  }),

  rest.post('https://api.mosip.io/v1/auth/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-access-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'openid',
        timestamp: new Date().toISOString()
      })
    );
  })
];

// Create the mock server
const server = setupServer(...mosipHandlers);

export { server };
