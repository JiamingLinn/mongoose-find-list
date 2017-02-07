const mongoose = require('mongoose');

const findList = require('../');

const Promise = require('bluebird');

const SchoolSchema = new mongoose.Schema({
  f: String,
  r: String,
  s: String,
  n: String,
});

SchoolSchema.plugin(findList);

const School = mongoose.model('school', SchoolSchema);

mongoose.connect('mongodb://localhost:27017/test');
School.remove({}).then(() => {
  return School.create([{
    f: '1',
    r: '13',
    s: '13',
    n: '1',
  }, {
    f: '21',
    r: '1',
    s: '1',
    n: '2',
  }, {
    f: '1',
    r: '2',
    s: '23',
    n: '3',
  }, {
    f: '1',
    r: '23',
    s: '1',
    n: '4',
  }]);
})
.then(() => {
  // 模糊查询
  return School.findList({filters: {r: {type: 'normal', value: '3'}}},console.log);
})
.then(() => {
  return School.findList({filters: {f: '1'}}).then(result => console.log('*filters*\n', result));
})
.then(() => {
  return School.findList({sortDir: 'ASC', sortField: 's'}).then(result => console.log('*sort*\n', result));
})
.then(() => {
  return School.findList({perPage: 1, page: 2}).then(result => console.log('*page*\n', result));
})
.then(() => process.exit(0)).catch(error => {console.log(error.stack);  process.exit(0)});
