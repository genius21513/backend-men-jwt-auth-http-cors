const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
      // "Origin, Content-Type, Accept, Access-Control-Allow-Origin, Set-Cookie, Authorization"
    );
    // This is default cookie func
    res.cookie("test-cookie-from-auth", "This is set by default cookie func.");
    // This is test cookieSession token
    req.session.test_token = "test_token (httpOnly cookieSession)";
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
};
