const NEW_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjY1NX0.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20";

async function queryTables() {
  try {
    const response = await fetch('https://bcufohulqrceytkrqpgd.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': NEW_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
      }
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

queryTables();
