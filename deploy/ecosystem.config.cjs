/**
 * pm2 process definition for the TradeFx API.
 *
 * The server already runs other pm2 apps, so this file defines only ours —
 * `pm2 start deploy/ecosystem.config.cjs` adds it without touching the rest.
 * Port 3200 is TradeFx's alone; 3100/4100/8080 belong to other projects.
 */
module.exports = {
  apps: [
    {
      name: 'tradefx-api',
      cwd: '/var/www/tradefx/app/apps/api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production' },
      error_file: '/var/log/tradefx/api-error.log',
      out_file: '/var/log/tradefx/api-out.log',
      time: true,
    },
  ],
};
