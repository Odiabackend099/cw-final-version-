const NEW_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20";

async function checkSchema() {
  try {
    // Query using PostgREST to execute SQL
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const response = await fetch('https://bcufohulqrceytkrqpgd.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'apikey': NEW_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Tables found:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
