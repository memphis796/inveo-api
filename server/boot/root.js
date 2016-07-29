function migrateModel(database, modelName) {
  return new Promise(function(resolve, reject) {
    console.log('automigrating', modelName);
    database.isActual(modelName, function (err, actual) {
      if (err) {
        return reject(err);
      }
      if (actual) {
        return resolve();
      }
      database.autoupdate(modelName, function(err) {
        if (err) {
          return reject(err);
        }

        console.log('automigrated', modelName);
        console.log('discovering model properties', modelName);
        database.discoverModelProperties(modelName, function (err, props) {
          if (err) {
            return reject(err);
          }

          console.log('discovered model properties', props);
          resolve();
        });
      });
    });
  });
}

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);

  router.get(`/migrations`, function(req, res) {
    const db = server.dataSources.db;
    const models = [
      'end-user',
      'laptop',
      'order'
    ];

    Promise.all(models.map(function(model) {
      return migrateModel(db, model);
    })).then(function() {
      res.send({
        status: 200,
        message: 'Migration Complete',
      });
    }).catch(function(err) {
      console.error(err)
    });
  });
};
