module.exports = function(app) {
  var User = app.models.endUser;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([
      {username: 'Admin', email: 'admin@inveo.com', password: 'secret'}
  ], function(err, users) {
      User.find({}, function (err, users) {
        console.error(err)
        console.log('found %s users', users.length, users);
      });
      if (err) return console.log('%j', err);
      // Create the admin role
      Role.create({
        name: 'admin'
      }, function(err, role) {
        if (err) return console.log(err);
        console.log(role);

        // Make Admin an admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function(err, principal) {
          if (err) return console.log(err);
          console.log(principal);
        });
      });
    });
};
