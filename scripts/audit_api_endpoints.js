const BASE_URL = 'https://kfs-os.vercel.app';

const ENDPOINTS = [
  { path: '/', method: 'GET', expect: [200] },
  { path: '/pos', method: 'GET', expect: [200] },
  { path: '/comercio', method: 'GET', expect: [200] },
  { path: '/promotora', method: 'GET', expect: [200] },
  { path: '/rider', method: 'GET', expect: [200] },
  { path: '/vendedor', method: 'GET', expect: [200] },
  { path: '/core', method: 'GET', expect: [200] },
  { path: '/rewards', method: 'GET', expect: [200] },
  { path: '/download-apk', method: 'GET', expect: [200] },
  { path: '/api/cron/keepalive', method: 'GET', expect: [200] },
  { path: '/api/bcv', method: 'GET', expect: [200, 500, 502, 503] }, // external scraper may vary
];

async function auditProductionEndpoints() {
  console.log("=================================================");
  console.log("KFS OS - Production Cloud & API Routing Audit");
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  for (const ep of ENDPOINTS) {
    const url = `${BASE_URL}${ep.path}`;
    try {
      const res = await fetch(url, {
        method: ep.method,
        headers: {
          'User-Agent': 'KFS-Audit-Agent/1.0'
        },
        signal: AbortSignal.timeout(15000)
      });

      const isExpected = ep.expect.includes(res.status);
      if (isExpected) {
        console.log(`✅ [HTTP ${res.status}] ${ep.path.padEnd(25)}: Response OK`);
        passed++;
      } else {
        console.error(`❌ [HTTP ${res.status}] ${ep.path.padEnd(25)}: Unexpected status (expected ${ep.expect.join(',')})`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR]   ${ep.path.padEnd(25)}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n=================================================");
  console.log(`Route Audit Results: ${passed} Passed | ${failed} Failed`);
  console.log("=================================================");
  
  if (failed > 0) {
    process.exit(1);
  }
}

auditProductionEndpoints();
