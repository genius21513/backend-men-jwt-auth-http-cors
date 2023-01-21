const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    // Access-Control-Allow-Methods: *
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
      // "Origin, Content-Type, Accept, Access-Control-Allow-Origin, Set-Cookie, Authorization"
    );    
    res.cookie("test-cookie-from-user", "This is set by default cookie func.");
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
