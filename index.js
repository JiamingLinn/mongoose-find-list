function check(obj, type) {
  if (type === 'normal') {
    return typeof obj === 'object' &&
      typeof obj.value === 'string' &&
      obj.type.toLowerCase() === 'normal';
  }
  return false;
}

function findList(params, done) {
  const query = Object.assign({
    filters: {},
    page: 1,
    perPage: 20,
    sertField: 'id',
    sortDir: 'DESC',
  }, params);
  const {filters, page, perPage, sortField, sortDir} = query;

  const sort = sortField ? {[sortField]: sortDir.toLowerCase()} : {};

  Object.keys(filters).forEach(field => {
    const item = filters[field];
    if (check(item, 'normal')) {
      filters[field] = item.value;
    }
    filters[field] = new RegExp(item);
  });

  const offset = (page -1) * perPage;
  // return this.find(filters).sort(sort).skip(skip).limit(perPage).exec(done)
  return Promise
    .all([
      this.find(filters).sort(sort).skip(offset).limit(perPage).exec(),
      this.count(filters).exec(),
    ]).then(([data, total]) => {
      const result = {total, data, page, perPage};
      return done ? done(null, result) : result;
    })
    .catch(error => {
      if (!done) throw error;
      return done(error);
    });
}

module.exports = (schema, options = {}) => {
  const methodName = options.alias || 'findList';
  schema.static(methodName, findList);
};
