#!/usr/bin/env node

// Database Connection Test Script
// This script tests the PostgreSQL connection without Prisma

const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables
function loadEnv() {
    const envPath = path.join(__dirname, '../backend/.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key] = value.replace(/"/g, '');
            }
        });
    }
}

async function testConnection() {
    console.log('🔍 Testing PostgreSQL Connection...');
    console.log('===================================');
    
    loadEnv();
    
    // Parse DATABASE_URL or use individual components
    const databaseUrl = process.env.DATABASE_URL || 
        'postgresql://treasure_user:treasure_pass@localhost:5432/treasure_db';
    
    console.log(`📡 Connecting to: ${databaseUrl.replace(/:[^:]*@/, ':****@')}`);
    
    const client = new Client({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 5000,
    });
    
    try {
        console.log('🔌 Attempting connection...');
        await client.connect();
        console.log('✅ Connection successful!');
        
        console.log('🔍 Testing basic query...');
        const result = await client.query('SELECT version(), current_database(), current_user');
        
        console.log('📊 Database Info:');
        console.log(`   Version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
        console.log(`   Database: ${result.rows[0].current_database}`);
        console.log(`   User: ${result.rows[0].current_user}`);
        
        console.log('🔍 Testing table creation...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS connection_test (
                id SERIAL PRIMARY KEY,
                test_time TIMESTAMP DEFAULT NOW()
            )
        `);
        
        await client.query('INSERT INTO connection_test DEFAULT VALUES');
        const testResult = await client.query('SELECT COUNT(*) as count FROM connection_test');
        console.log(`   Test table has ${testResult.rows[0].count} records`);
        
        await client.query('DROP TABLE connection_test');
        console.log('✅ Table operations successful!');
        
        console.log('');
        console.log('🎉 All database tests passed!');
        console.log('💡 Your database is ready for Prisma migrations.');
        
    } catch (error) {
        console.log('❌ Connection failed!');
        console.log('');
        console.log('🔍 Error Details:');
        console.log(`   Code: ${error.code || 'Unknown'}`);
        console.log(`   Message: ${error.message}`);
        
        console.log('');
        console.log('🔧 Troubleshooting Steps:');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('1. Check if PostgreSQL container is running:');
            console.log('   docker ps | grep treasure-postgres');
            console.log('');
            console.log('2. Start the database container:');
            console.log('   ./scripts/setup_database.sh');
            console.log('');
            console.log('3. Check if port 5432 is available:');
            console.log('   lsof -i :5432');
        } else if (error.code === 'ENOTFOUND') {
            console.log('1. Check your DATABASE_URL in backend/.env');
            console.log('2. Ensure hostname is correct (usually "localhost")');
        } else if (error.message.includes('authentication')) {
            console.log('1. Verify database credentials in backend/.env');
            console.log('2. Check container environment variables:');
            console.log('   docker exec treasure-postgres env | grep POSTGRES');
            console.log('');
            console.log('3. Recreate container with correct credentials:');
            console.log('   ./scripts/setup_database.sh restart');
        } else if (error.message.includes('database') && error.message.includes('does not exist')) {
            console.log('1. Check if database was created properly');
            console.log('2. Recreate container:');
            console.log('   ./scripts/setup_database.sh restart');
        }
        
        console.log('');
        console.log('📚 For more help, see: docs/database-troubleshooting.md');
        
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run the test
if (require.main === module) {
    testConnection().catch(console.error);
}

module.exports = { testConnection };
