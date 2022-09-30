module.exports = {
  apps : [{
    name: 'app',
    script: 'server-register.js',
    watch: true,
    instances: 1,
    exec_mode: 'cluster'
  }]
};
