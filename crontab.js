const schedule = require('node-schedule');
const spider = require('./index');
const download = require('./downloadFile');

schedule.scheduleJob('0 15 * * * *', function(){
  console.log('spider')
  spider();
});

schedule.scheduleJob('0 0 1 * * *', function(){
  download();
});