// 1. DATABASE SETUP SCRIPT
// scripts/setup-database.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Over Unity database...');

  // Create companies table
  const { error: companiesError } = await supabase.rpc('create_companies_table');
  if (companiesError) {
    console.error('Error creating companies table:', companiesError);
  } else {
    console.log('✅ Companies table created');
  }

  // Create jobs table with Google Jobs schema support
  const { error: jobsError } = await supabase.rpc('create_jobs_table');
  if (jobsError) {
    console.error('Error creating jobs table:', jobsError);
  } else {
    console.log('✅ Jobs table created');
  }

  // Create candidates table
  const { error: candidatesError } = await supabase.rpc('create_candidates_table');
  if (candidatesError) {
    console.error('Error creating candidates table:', candidatesError);
  } else {
    console.log('✅ Candidates table created');
  }

  // Create applications table
  const { error: applicationsError } = await supabase.rpc('create_applications_table');
  if (applicationsError) {
    console.error('Error creating applications table:', applicationsError);
  } else {
    console.log('✅ Applications table created');
  }

  // Set up Row Level Security
  await setupRLS();
  
  console.log('🎉 Database setup complete!');
}

async function setupRLS() {
  console.log('🔒 Setting up Row Level Security...');
  
  // Companies RLS
  await supabase.rpc('enable_rls_companies');
  await supabase.rpc('create_company_policies');
  
  // Jobs RLS  
  await supabase.rpc('enable_rls_jobs');
  await supabase.rpc('create_job_policies');
  
  // Applications RLS
  await supabase.rpc('enable_rls_applications');
  await supabase.rpc('create_application_policies');
  
  console.log('✅ RLS policies created');
}

if (require.main === module) {
  setupDatabase().catch(console.error);
}
