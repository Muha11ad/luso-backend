module.exports = {
  apps: [
    {
      name: 'api-cosmetic', // Name of your app
      script: './dist/src/main.js', // Path to the compiled JavaScript file
      instances: 'max', // Or a number of instances
      exec_mode: 'cluster', // Enable cluster mode
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
