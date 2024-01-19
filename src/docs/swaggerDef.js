const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'emdo API documentation',
    version,
    license: {
      name: 'MIT',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:3030/v1/`,
    },
  ],
};

module.exports = swaggerDef;
