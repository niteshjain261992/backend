class UserCtrl {

  login(req) {
    const body = req.body;
    return new Promise((resolve, reject)=> {
      if (!body.email || !body.password) return resolve({ statusCode: 406, payload: { message: "missing mandatory parameters" }});

      // checkimg email and password
      // TODO: use database to check email and password
      if (body.email == "gagan.gupta@gmail.com" && body.password == "gagan") {
        req.session.user = {
          is_logged_in: true,
          email: "gagan.gupta@hippoinnovations.com"
        };
        return resolve({ statusCode: 200, payload: { message: "login successfull"}});
      } else {
        return resolve({ statusCode: 406, payload: { message: "Wrong login or password"}});
      }

    });
  }

  logout(req) {
    return new Promise((resolve,reject)=> {
      req.session.user = {
        is_logged_in: false
      };
      return resolve({ statusCode:200, payload: { message: "Logout successfull" }});
    })
  }

  isLoggedIn(req) {
    return new Promise((resolve, reject)=> {
      const userSession = req.session.user;
      if (userSession.is_logged_in) {
        return resolve({ statusCode: 200, payload: { message: "User is logged in" }});
      } else {
        return resolve({ statusCode: 406, payload: { message: "User is not logged in" }});
      }
    })
  }
}

module.exports = new UserCtrl();
