// Test script to see what content we get from the Nextdoor URL
import fetch from 'node-fetch';

async function testURLContent() {
  const url = 'https://help.nextdoor.com/s/article/community-guidelines?language=en_GB';
  
  console.log('🧪 Testing URL content...\n');
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Content-Length: ${response.headers.get('content-length')}`);
    console.log('');
    
    const html = await response.text();
    console.log(`Raw HTML length: ${html.length} characters`);
    console.log('');
    
    // Show first 1000 characters
    console.log('First 1000 characters:');
    console.log('='.repeat(50));
    console.log(html.substring(0, 1000));
    console.log('='.repeat(50));
    console.log('');
    
    // Look for specific patterns
    const patterns = [
      { name: 'Title tag', regex: /<title[^>]*>([\s\S]*?)<\/title>/i },
      { name: 'Meta description', regex: /<meta[^>]*name="description"[^>]*content="([^"]*)"/i },
      { name: 'Body tag', regex: /<body[^>]*>([\s\S]*?)<\/body>/i },
      { name: 'Main content', regex: /<main[^>]*>([\s\S]*?)<\/main>/i },
      { name: 'Article content', regex: /<article[^>]*>([\s\S]*?)<\/article>/i },
      { name: 'Guidelines text', regex: /guidelines?/gi },
      { name: 'Community text', regex: /community/gi },
      { name: 'Rules text', regex: /rules?/gi }
    ];
    
    console.log('Pattern Analysis:');
    console.log('='.repeat(50));
    
    for (const pattern of patterns) {
      const matches = html.match(pattern.regex);
      if (matches) {
        console.log(`✅ ${pattern.name}: Found ${matches.length} match(es)`);
        if (pattern.name !== 'Guidelines text' && pattern.name !== 'Community text' && pattern.name !== 'Rules text') {
          console.log(`   Preview: ${matches[1]?.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ ${pattern.name}: Not found`);
      }
    }
    
    console.log('');
    console.log('Content Analysis:');
    console.log('='.repeat(50));
    
    // Check for common indicators
    const indicators = {
      'JavaScript': /<script/gi,
      'CSS': /<style/gi,
      'Loading': /loading/gi,
      'Error': /error/gi,
      'Nextdoor': /nextdoor/gi,
      'Salesforce': /salesforce/gi,
      'Community': /community/gi,
      'Guidelines': /guidelines?/gi
    };
    
    for (const [name, regex] of Object.entries(indicators)) {
      const matches = html.match(regex);
      const count = matches ? matches.length : 0;
      console.log(`${name}: ${count} occurrences`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching URL:', error.message);
  }
}

testURLContent(); 