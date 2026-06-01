import { NextResponse } from 'next/server';
import https from 'https';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Promise<NextResponse>((resolve) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    https.get('https://www.bcv.org.ve/', { agent }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const $ = cheerio.load(data);
          const usdText = $('#dolar strong').text().trim().replace(',', '.');
          const eurText = $('#euro strong').text().trim().replace(',', '.');
          
          const USD = parseFloat(usdText);
          const EUR = parseFloat(eurText);

          if (isNaN(USD) || isNaN(EUR)) {
            resolve(NextResponse.json({ USD: 36.45, EUR: 39.20, error: 'Invalid parsing' }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ USD, EUR }));
          }
        } catch (error) {
          resolve(NextResponse.json({ USD: 36.45, EUR: 39.20, error: 'Parse failed' }, { status: 500 }));
        }
      });
    }).on('error', (err) => {
      resolve(NextResponse.json({ USD: 36.45, EUR: 39.20, error: err.message }, { status: 500 }));
    });
  });
}
