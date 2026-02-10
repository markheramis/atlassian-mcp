#!/bin/bash

# Atlassian MCP Server installer script
# This script installs the Atlassian MCP Server globally and runs the setup

echo "Installing Atlassian MCP Server..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install the package globally
npm install -g .

# Run the setup script
atlassian-mcp-setup

echo "Installation complete!"
echo "You can now run the server using the 'atlassian-mcp-server' command."