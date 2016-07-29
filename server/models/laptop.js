module.exports = function(Laptop) {
  Laptop.observe('before save', function beforeSave(ctx, next) {
    var data = null;
    /// Data.
    if (ctx.instance) {
      data = ctx.instance;
    } else {
      data = ctx.data;
    }
    /// Created?
    if (ctx.isNewInstance) {
      data['created-at'] = new Date();
    }
    /// Updated?
    if (ctx.instance) {
      data['updated-at'] = new Date();
    }
    next();
  });
};
