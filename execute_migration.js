const fs = require('fs');

const NEW_URL = 'https://bcufohulqrceytkrqpgd.supabase.co';
const NEW_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20';

async function executeMigration() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('/workspace/migrate_to_new_backend.sql', 'utf8');
    
    console.log('Executing migration on new backend...');
    console.log('SQL length:', sql.length, 'characters');
    
    // Execute via PostgREST query endpoint
    const response = await fetch(`${NEW_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': NEW_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', responseText.substring(0, 500));
    
    if (response.ok || response.status === 201) {
      console.log('\n✓ Migration executed successfully!');
    } else {
      console.error('\n✗ Migration failed:', responseText);
    }
    
  } catch (error) {
    console.error('Error executing migration:', error.message);
  }
}

executeMigration();
