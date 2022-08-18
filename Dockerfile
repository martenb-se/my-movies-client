# Alpine
FROM node:18-alpine

# Get cURL for Health-Check
RUN apk --no-cache add curl

# Create App Directory in Container
RUN mkdir -p /opt/my-movies-client
RUN mkdir -p /opt/my-movies-client/cypress
RUN mkdir -p /opt/my-movies-client/public
RUN mkdir -p /opt/my-movies-client/src

# Copy Front-End Source Files
COPY .env .eslintrc.cjs cypress.config.js index.html package.json vite.config.js vitest.config.js vitest.setup.js /opt/my-movies-client/
COPY cypress /opt/my-movies-client/cypress
COPY public /opt/my-movies-client/public
COPY src /opt/my-movies-client/src

# Install & Run Front-End
WORKDIR /opt/my-movies-client
RUN npm install

# Run
ENTRYPOINT ["npm", "run", "dev:host"]
