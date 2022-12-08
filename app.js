const express = require("express")
const request = require("postman-request")
const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const app = express();


app.set("view engine", "ejs");  //to use embedded javascript templates instead of html files
app.use(express.static("public")); //to serve static files
app.use(express.urlencoded({extended:true})); // to req input data in forms (ejs or html) with req.body.

//a)Schema
const articlesSchema = new mongoose.Schema ({
  title:String,
  content: String
})

//b)Model
const Article = mongoose.model("Article", articlesSchema);


///////////////// Requests targetting all Articles ////////////////
app.route('/articles')

.get((req,res) => {
  Article.find({}, (err,i) => (err) ?
      res.send('err') :
      res.send(i)
  );
})

.post((req,res) =>{
  //c)CreateDocuments
  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save( (err) => (err) ?
  res.send(err) :
  res.send('Successfully added a new article.')
  );
})

.delete((req,res) => {
  Article.deleteMany({}, (err) => (err) ?
  res.send(err) :
  res.send('Successfully deleted all articles')
  );
});

///////////////// Requests targetting one Articles ////////////////
app.route('/articles/:articleTitle')

.get((req,res) => {
  Article.findOne({title: req.params.articleTitle}, (err, i) => (!i) ?
    res.send('No article matching that title was found.') :
    res.send(i)
  );
})

.put((req,res) => {
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    (err) => err ?
    res.send(err) :
    res.send('Article title and content were updated successfully.')
  );
})

.patch((req,res) => {
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    (err) => err ?
    res.send(err):
    res.send('Successfully updated article'+ req.params.articleTitle + '.')
  );
})

.delete((req,res) => {
  Article.deleteOne(
    {title:req.params.articleTitle},
    (err) => err ?
    res.send(err) :
    res.send('Succesfully deleted ' + req.params.articleTitle + '.')
  );
});

  


app.listen(3000, function() {
  console.log('Server started on port 3000');
});
