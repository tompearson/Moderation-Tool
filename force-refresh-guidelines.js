// Force refresh guidelines from gist
const https = require('https');

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'moderation-assistant-tool.vercel.app',
      path: '/api/guidelines-endpoint',
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function forceRefresh() {
  try {
    console.log('Forcing refresh of guidelines...');
    
    const result = await makeRequest('', 'POST', { action: 'refresh' });
    console.log('Refresh result:', result);
    
    console.log('\nChecking current guidelines...');
    const current = await makeRequest('', 'GET');
    console.log('Current guidelines source:', current.guidelines?.source);
    console.log('Config URL:', current.config?.url);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

forceRefresh(); 