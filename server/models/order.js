var loopback = require('loopback');
var lodash = require('lodash');

function copyProperties(data, from, to) {
  from.forEach(function (_, index) {
    data[to[index]] = data[from[index]];
  });
  return data;
}

module.exports = function(Order) {
  Order.history = function (cb) {
    cb(null, 'test', 'application/json');
  };
  Order.remoteMethod('history', {
    returns: {arg: 'data', type: 'array'}
  });
  Order.observe('before save', function beforeSave(ctx, next) {
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
    var currentCtx = loopback.getCurrentContext();
    var currentUser = currentCtx && currentCtx.get('currentUser');
    data['user-id'] = currentUser.id;
    /// Shipping address.
    if (data['shipping-is-billing']) {
      copyProperties(data, [
        'shipping-address1',
        'shipping-address2',
        'shipping-state',
        'shipping-city',
        'shipping-postal-code',
      ], [
        'billing-address1',
        'billing-address2',
        'billing-state',
        'billing-city',
        'billing-postal-code',
      ]);
    }
    /// Price.
    var ModelName = lodash.upperFirst(lodash.camelCase(data['item-type']));
    var Item = Order.app.models[ModelName];
    Item.findOne({ id: data['item-id'] }, function(err, item) {
      if (err) return console.error(err);
      data['price-per-unit'] = item.price;
      console.log('`data`', 'Order', data);
      next();
    });
  });
};
