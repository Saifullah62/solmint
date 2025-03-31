#!/bin/bash

# Print Node.js version for debugging
echo "Current Node.js version:"
node -v

# Install and use the required Node.js version
echo "Installing Node.js 20.18.0..."
export NODE_VERSION=20.18.0
export PATH="$HOME/.nvm/versions/node/v$NODE_VERSION/bin:$PATH"

# Verify the Node.js version
echo "Node.js version after update:"
node -v

# Run the build command
echo "Running build command..."
npm run build
