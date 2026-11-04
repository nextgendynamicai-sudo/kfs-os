import { test, expect } from '@playwright/test';

test.describe('Universal Multi-Device Cloud Sync Hub', () => {
  test.describe.configure({ mode: 'serial' });
  test('GET /api/kfs/sync returns full db_state on fresh sync and delta on subsequent query', async ({ request }) => {
    // 1. Fresh sync
    const res = await request.get('/api/kfs/sync');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('updated');
    expect(body.updated_at).toBeDefined();
    expect(body.db_state).toBeDefined();
    expect(Array.isArray(body.db_state.products)).toBe(true);
    expect(Array.isArray(body.db_state.clients)).toBe(true);

    const lastUpdatedAt = body.updated_at;

    // 2. Delta check with matching timestamp (must return status: 'up_to_date' with zero redundant payload)
    const deltaRes = await request.get(`/api/kfs/sync?since=${encodeURIComponent(lastUpdatedAt)}`);
    expect(deltaRes.status()).toBe(200);
    const deltaBody = await deltaRes.json();
    expect(deltaBody.status).toBe('up_to_date');
    expect(deltaBody.db_state).toBeUndefined(); // Zero redundant download, saving cellular data
  });

  test('POST /api/kfs/sync receives atomic TRANSACTION and broadcasts state update', async ({ request }) => {
    const testTxId = `test_tx_${Date.now()}`;
    const txPayload = {
      id: testTxId,
      clientId: 'kfs-express',
      vendedorId: 'vend_demo_1',
      amountUSD: 45.50,
      paymentMethod: 'PAGO_MOVIL',
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      items: [{ id: 'kfs_prod_1', name: 'Harina PAN', qty: 2, priceUSD: 1.50 }]
    };

    // Device 1 submits transaction
    const postRes = await request.post('/api/kfs/sync', {
      data: {
        action: 'TRANSACTION',
        payload: txPayload
      }
    });
    expect(postRes.status()).toBe(200);
    const postBody = await postRes.json();
    expect(postBody.status).toBe('success');
    expect(postBody.updated_at).toBeDefined();

    // Device 2 polls and receives the updated transaction
    const getRes = await request.get('/api/kfs/sync');
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.status).toBe('updated');
    const foundTx = (getBody.db_state.transactions || []).find((t: any) => t.id === testTxId);
    expect(foundTx).toBeDefined();
    expect(foundTx.amountUSD).toBe(45.50);
  });
});
