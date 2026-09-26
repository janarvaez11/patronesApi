module.exports = {
  apps: [
    {
      name: 'patrones-api-backend',

      cwd: '/var/www/patrones-api-deploy/current/backend',

      script: './dist/index.js',

      instances: 'max',
      exec_mode: 'cluster',

      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      error_file:
        '/var/www/patrones-api-deploy/current/backend/logs/err.log',

      out_file:
        '/var/www/patrones-api-deploy/current/backend/logs/out.log',

      log_date_format:
        'YYYY-MM-DD HH:mm:ss Z',

      merge_logs: true,
      autorestart: true,
      max_memory_restart: '400M'
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',

      host: '3.140.74.207',

      ref: 'origin/main',

      repo:
        'git@github.com:janarvaez11/patronesApi.git',

      path:
        '/var/www/patrones-api-deploy',

      'post-deploy':
        'ln -sfn /var/www/patrones-api-deploy/shared/.env /var/www/patrones-api-deploy/current/backend/.env && ' +
        'mkdir -p /var/www/patrones-api-deploy/current/backend/logs && ' +
        'cd /var/www/patrones-api-deploy/current/backend && ' +
        'npm ci && ' +
        'npx tsc && ' +
        'cd /var/www/patrones-api-deploy/current && ' +
        'pm2 startOrReload ecosystem.config.cjs --env production && ' +
        'pm2 save',

      ssh_options:
        'IdentityFile=~/.ssh/patrones-api-aws.pem'
    }
  }
};