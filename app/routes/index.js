module.exports = (app)=> {

  // Initialize user session
  app.use((req, res, callback)=> {
    if (!req.session.user) req.session.user = { is_logged_in: false };
    callback();
  });

  // Application routes
  require('./services/users')(app);
  require('./services/charts')(app);
}
