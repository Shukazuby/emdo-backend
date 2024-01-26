const express = require('express');
const authRoute = require('./auth.route');
const router = express.Router();
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const employerRoute = require('./employer.route')
const jobRoute = require('./job.route')
const uploadRoute = require('./upload.route')
const teamRoute = require('./teamManager.route')

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },

{
  path: '/employers',
  route: employerRoute
},
{
  path: '/jobs',
  route: jobRoute
},
{
  path: '/uploads',
  route: uploadRoute
},
{
  path: '/team',
  route: teamRoute
},

]


  const devRoutes = [
    {
      path: '/docs',
      route: docsRoute,
    },

  ];

  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  
  if (config.env === 'development') {
    devRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });
  }
  
module.exports = router;


