#!/usr/bin/env node

/**
 * Token Creation Monitoring Script
 * 
 * This script provides real-time monitoring of token creation activities,
 * including success rates, error distributions, and system health metrics.
 * 
 * Usage:
 *   node scripts/monitor.js [--network=devnet|mainnet-beta] [--interval=60]
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const fetch = require('node-fetch');

// Parse command line arguments
program
  .option('-n, --network <network>', 'network to monitor (devnet or mainnet-beta)', 'devnet')
  .option('-i, --interval <seconds>', 'polling interval in seconds', '60')
  .option('-e, --endpoint <url>', 'API endpoint URL', process.env.API_ENDPOINT || 'http://localhost:3000/api')
  .parse(process.argv);

const options = program.opts();
const NETWORK = options.network;
const INTERVAL = parseInt(options.interval, 10) * 1000;
const API_ENDPOINT = options.endpoint;

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

// Function to fetch analytics data from API
async function fetchAnalyticsData() {
  try {
    const [successResponse, errorResponse, startedResponse] = await Promise.all([
      fetch(`${API_ENDPOINT}/analytics?type=token_creation_success&network=${NETWORK}`),
      fetch(`${API_ENDPOINT}/analytics?type=token_creation_error&network=${NETWORK}`),
      fetch(`${API_ENDPOINT}/analytics?type=token_creation_started&network=${NETWORK}`)
    ]);
    
    if (!successResponse.ok || !errorResponse.ok || !startedResponse.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    
    const success = await successResponse.json();
    const errors = await errorResponse.json();
    const started = await startedResponse.json();
    
    return {
      success,
      errors,
      started
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      success: [],
      errors: [],
      started: []
    };
  }
}

// Function to check system health
async function checkSystemHealth() {
  try {
    const response = await fetch(`${API_ENDPOINT}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking system health:', error);
    return {
      api: 'down',
      solanaRpc: 'disconnected',
      database: 'unhealthy'
    };
  }
}

// Function to clear terminal
function clearTerminal() {
  process.stdout.write('\x1Bc');
}

// Function to calculate success rate
function calculateSuccessRate(success, errors) {
  const total = success.length + errors.length;
  if (total === 0) return 0;
  return (success.length / total * 100).toFixed(1);
}

// Function to group errors by code
function groupErrorsByCode(errors) {
  const errorsByCode = {};
  
  errors.forEach(event => {
    const code = event.error?.code || 'UNKNOWN_ERROR';
    errorsByCode[code] = (errorsByCode[code] || 0) + 1;
  });
  
  return errorsByCode;
}

// Function to display a progress bar
function progressBar(percent, width = 30) {
  const filled = Math.round(width * (percent / 100));
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${filledBar}${emptyBar} ${percent}%`;
}

// Function to display monitoring data
async function displayMonitoringData() {
  clearTerminal();
  
  // Fetch real data from API
  const analyticsData = await fetchAnalyticsData();
  const healthData = await checkSystemHealth();
  
  const { success, errors, started } = analyticsData;
  const successRate = calculateSuccessRate(success, errors);
  const errorsByCode = groupErrorsByCode(errors);
  
  // Header
  console.log(`${colors.bright}${colors.fg.cyan}===== SOLMINT TOKEN CREATION MONITOR =====${colors.reset}`);
  console.log(`${colors.fg.yellow}Network: ${colors.bright}${NETWORK}${colors.reset}   ${colors.fg.yellow}Polling Interval: ${colors.bright}${INTERVAL/1000}s${colors.reset}\n`);
  
  // Summary stats
  console.log(`${colors.bright}SUMMARY STATISTICS:${colors.reset}`);
  console.log(`${colors.fg.green}✓ Successful Creations: ${colors.bright}${success.length}${colors.reset}`);
  console.log(`${colors.fg.red}✗ Failed Creations: ${colors.bright}${errors.length}${colors.reset}`);
  console.log(`${colors.fg.blue}⟳ In Progress: ${colors.bright}${Math.max(0, started.length - success.length - errors.length)}${colors.reset}`);
  
  // Success rate
  const rateColor = successRate > 90 ? colors.fg.green : (successRate > 70 ? colors.fg.yellow : colors.fg.red);
  console.log(`\n${colors.bright}SUCCESS RATE:${colors.reset} ${rateColor}${progressBar(successRate)}${colors.reset}`);
  
  // Error distribution
  if (Object.keys(errorsByCode).length > 0) {
    console.log(`\n${colors.bright}ERROR DISTRIBUTION:${colors.reset}`);
    
    Object.entries(errorsByCode).forEach(([code, count]) => {
      const percent = (count / errors.length * 100).toFixed(1);
      console.log(`  ${colors.fg.red}${code}:${colors.reset} ${count} (${percent}%)`);
    });
  }
  
  // Recent activity
  console.log(`\n${colors.bright}RECENT ACTIVITY:${colors.reset}`);
  
  const recentEvents = [...success, ...errors]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
  
  if (recentEvents.length === 0) {
    console.log(`  ${colors.dim}No recent activity${colors.reset}`);
  } else {
    recentEvents.forEach(event => {
      const isSuccess = success.includes(event);
      const time = new Date(event.timestamp).toLocaleTimeString();
      const tokenName = event.data?.tokenName || 'Unknown';
      const tokenSymbol = event.data?.tokenSymbol || 'Unknown';
      
      if (isSuccess) {
        console.log(`  ${colors.fg.green}[${time}] ✓ Created ${colors.bright}${tokenName} (${tokenSymbol})${colors.reset}`);
      } else {
        console.log(`  ${colors.fg.red}[${time}] ✗ Failed ${colors.bright}${tokenName} (${tokenSymbol})${colors.reset} - ${event.error?.code || 'Unknown error'}`);
      }
    });
  }
  
  // System health
  console.log(`\n${colors.bright}SYSTEM HEALTH:${colors.reset}`);
  
  const apiStatusColor = healthData.api === 'operational' ? colors.fg.green : (healthData.api === 'degraded' ? colors.fg.yellow : colors.fg.red);
  const rpcStatusColor = healthData.solanaRpc === 'connected' ? colors.fg.green : colors.fg.red;
  const dbStatusColor = healthData.database === 'healthy' ? colors.fg.green : colors.fg.red;
  
  console.log(`  ${apiStatusColor}● API: ${healthData.api}${colors.reset}`);
  console.log(`  ${rpcStatusColor}● Solana RPC: ${healthData.solanaRpc}${colors.reset}`);
  console.log(`  ${dbStatusColor}● Database: ${healthData.database}${colors.reset}`);
  
  console.log(`\n${colors.dim}Press Ctrl+C to exit${colors.reset}`);
}

// Main monitoring loop
async function startMonitoring() {
  console.log(`Starting monitoring for ${NETWORK} network with ${INTERVAL/1000}s polling interval...`);
  
  // Initial display
  await displayMonitoringData();
  
  // Set up polling interval
  const intervalId = setInterval(displayMonitoringData, INTERVAL);
  
  // Handle exit
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log('\nMonitoring stopped');
    process.exit(0);
  });
}

// Start the monitoring
startMonitoring();
