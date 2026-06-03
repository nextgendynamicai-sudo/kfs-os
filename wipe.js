const url = 'https://uplgtylqjkxallwtnehj.supabase.co/rest/v1/kfs_store_states?id=eq.kfs-general-db-v2';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbGd0eWxxamt4YWxsd3RuZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNjcyNTEsImV4cCI6MjA5NTk0MzI1MX0.Kpi7QNuhIBDWnJd_n3Ari0d0N-0eh6JsgUEJ4d5ocGQ';

fetch(url, {
  method: 'DELETE',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key
  }
}).then(res => {
  console.log('Wiped Supabase! Status:', res.status);
}).catch(console.error);
