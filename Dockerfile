# Use an official Node image that supports multi-arch (works on macOS and Linux)
FROM node:22-slim
# Install NGINX, Tini, and other required tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    ca-certificates \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only package manifests first to take advantage of cached dependency installation
COPY package.json bun.lock ./



# Install pnpm using corepack
# Install bun
RUN npm install --global bun@latest

# Ensure bun is on PATH (usually already is after npm -g)
ENV PATH="/usr/local/bin:${PATH}"

# Install dependencies with bun
RUN bun install


# Copy the rest of the application (including .env)
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}}


# Build the Next.js application
RUN bun run build

# Copy NGINX configuration (remove default sites so only our app is served)
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

COPY nginx.conf /etc/nginx/sites-available/app.conf
RUN ln -sf /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/app.conf

# Expose required ports
EXPOSE 3000 80 443

# Use a script to start both NGINX and your Node app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Change CMD to use the script
CMD ["/start.sh"]