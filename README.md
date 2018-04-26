# PFS-Scenariotracker

To run:
- `node start ./src/server_node/bin/www`
- Go to `https://localhost:3443` and accept the self-signed certificate as trusted

To install:
- Get Node
- Install bower system wide `npm install bower --global`
- `npm install` in `/src/server_node` (takes a few minutes)
- `bower install` in `/src/server_node/public`
- Optionally `npm install nodemon --global` then start with `nodemon` instead of `node`

Miscellaneous:
- `npm outdated` to list outdated packages
- `npm update` to update outdated packages