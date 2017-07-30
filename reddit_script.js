var MongoClient = require('mongodb').MongoClient
  , request = require('request');

MongoClient.connect('mongodb://localhost:27017/quarrelofcuties', function(err, db) {
  if(err) 
    throw err;

  db.collection('reddit').removeMany();
  
  request('http://www.reddit.com/r/aww/hot/.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);

      var posts = obj.data.children.map(function (story) { return story.data; });

      db.collection('reddit').insert(posts, function (err, data) {
        if(err) throw err;

        console.dir(data);

        db.close();
      });
    }
  });
  db.collection('reddit').updateMany(
    {},
    {$set: {elo:1000, gamesPlayed: 0}},
    {upsert: true});
});