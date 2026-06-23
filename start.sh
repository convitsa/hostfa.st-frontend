#!/bin/bash

# Start NGINX in background
nginx &

# Start Bun application
PORT=3000 exec bun run start