import { NextResponse } from 'next/server';
import https from 'https';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchFromDolarApi(): Promise<{ USD: number; EUR: number } | null> {
  try {
    const resUsd = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { cache: 'no-store' });
    const dataUsd = await resUsd.json();
    
    if (dataUsd && dataUsd.promedio && typeof dataUsd.promedio === 'number') {
      const usdRate = dataUsd.promedio;
      // Fetch EUR if available or compute from standard EUR/USD ratio
      let eurRate = usdRate * 1.08;
      try {
        const resEur = await fetch('https://ve.dolarapi.com/v1/euros/oficial', { cache: 'no-store' });
        const dataEur = await resEur.json();
        if (dataEur && dataEur.promedio && typeof dataEur.promedio === 'number') {
          eurRate = dataEur.promedio;
        }
      } catch (e) {
        // fallback eur ratio
      }
      return { USD: usdRate, EUR: eurRate };
    }
  } catch (err) {
    console.warn('DolarApi fetch failed, trying direct BCV scrape...', err);
  }
  return null;
}

async function fetchFromBcvDirect(): Promise<{ USD: number; EUR: number } | null> {
  return new Promise((resolve) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    https.get('https://www.bcv.org.ve/', {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const $ = cheerio.load(data);
          const usdText = $('#dolar strong').text().trim().replace(',', '.');
          const eurText = $('#euro strong').text().trim().replace(',', '.');
          
          const USD = parseFloat(usdText);
          const EUR = parseFloat(eurText);

          if (!isNaN(USD) && !isNaN(EUR) && USD > 0) {
            resolve({ USD, EUR });
          } else {
            resolve(null);
          }
        } catch (error) {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

export async function GET() {
  // Provider 1: DolarApi (Fast CDN)
  const dolarApiResult = await fetchFromDolarApi();
  if (dolarApiResult) {
    return NextResponse.json(dolarApiResult);
  }

  // Provider 2: Direct Scrape of BCV Official Site (https://www.bcv.org.ve/)
  const bcvDirectResult = await fetchFromBcvDirect();
  if (bcvDirectResult) {
    return NextResponse.json(bcvDirectResult);
  }

  // Fallback Baseline if BCV servers are down
  return NextResponse.json({ USD: 36.45, EUR: 39.20, fallback: true });
}
