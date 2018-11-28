module.exports = (app)=> {

  // Initialize user session
  app.use((req, res, callback)=> {
    console.log(req.db);
    if (!req.session.user) req.session.user = { is_logged_in: false };
    callback();
  });


}
