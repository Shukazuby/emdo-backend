const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { Server } = require('socket.io');
const socketServer = require('./config/socket');
const cron = require('./config/cron');
cron
const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

socketServer(server)

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});


module.exports = server
