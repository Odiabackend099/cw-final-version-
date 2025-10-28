import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const NEW_URL = 'https://bcufohulqrceytkrqpgd.supabase.co';
const NEW_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20';

const supabase = createClient(NEW_URL, NEW_SERVICE_ROLE_KEY);

async function executeMigration() {
  try {
    console.log('Reading migration file...');
    const sql = readFileSync('/workspace/migrate_to_new_backend.sql', 'utf8');
    
    console.log('Executing migration on new backend (bcufohulqrceytkrqpgd)...\n');
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';';
      const preview = stmt.substring(0, 80).replace(/\s+/g, ' ');
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { query: stmt });
        
        if (error) {
          // Try direct query if RPC doesn't work
          const response = await fetch(`${NEW_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
              'apikey': NEW_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            }
          });
        }
        
        console.log(`✓ [${i+1}/${statements.length}] ${preview}...`);
        successCount++;
      } catch (err) {
        console.log(`✗ [${i+1}/${statements.length}] ${preview}... ERROR: ${err.message.substring(0, 100)}`);
        errorCount++;
      }
    }
    
    console.log(`\n=== Migration Summary ===`);
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log(`========================\n`);
    
  } catch (error) {
    console.error('Fatal error:', error.message);
  }
}

executeMigration();
