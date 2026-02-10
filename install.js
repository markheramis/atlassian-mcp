#!/usr/bin/env node

/**
 * Installation script for Atlassian MCP Server
 * This script helps users set up their configuration file
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default config path
const configDir = path.join(__dirname, 'config');
const configPath = path.join(configDir, 'config.json');
const sampleConfigPath = path.join(configDir, 'config.sample.json');

// Ensure config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Check if config already exists
if (fs.existsSync(configPath)) {
  console.log('Configuration file already exists at:', configPath);
  console.log('To reconfigure, delete the existing file or edit it directly.');
  rl.close();
  process.exit(0);
}

// Load sample config
let config;
try {
  const sampleConfig = fs.readFileSync(sampleConfigPath, 'utf8');
  config = JSON.parse(sampleConfig);
} catch (error) {
  console.error('Error loading sample configuration:', error);
  rl.close();
  process.exit(1);
}

console.log('Welcome to the Atlassian MCP Server setup!');
console.log('This script will help you configure your server.');
console.log('Press Ctrl+C at any time to exit.\n');

// Prompt for Atlassian base URL
rl.question('Enter your Atlassian instance URL (e.g., https://your-instance.atlassian.net): ', (baseUrl) => {
  config.atlassian.baseUrl = baseUrl.trim();
  
  // Prompt for email
  rl.question('Enter your Atlassian account email: ', (email) => {
    config.atlassian.email = email.trim();
    
    // Prompt for API token
    rl.question('Enter your Atlassian API token: ', (token) => {
      config.atlassian.token = token.trim();
      
      // Prompt for server name (optional)
      rl.question('Enter a name for your server (default: atlassian-server): ', (name) => {
        if (name.trim()) {
          config.server.name = name.trim();
        }
        
        // Save the config
        try {
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          console.log('\nConfiguration saved successfully to:', configPath);
          console.log('\nTo use this server with Cline, add the following to your MCP settings:');
          console.log(`
{
  "mcpServers": {
    "${config.server.name}": {
      "command": "atlassian-mcp-server",
      "args": [],
      "env": {
        "ATLASSIAN_CONFIG_PATH": "${configPath.replace(/\\/g, '\\\\')}"
      },
      "disabled": false
    }
  }
}
          `);
        } catch (error) {
          console.error('Error saving configuration:', error);
        }
        
        rl.close();
      });
    });
  });
});

// Handle exit
rl.on('close', () => {
  console.log('\nSetup complete. Thank you for using Atlassian MCP Server!');
  process.exit(0);
});