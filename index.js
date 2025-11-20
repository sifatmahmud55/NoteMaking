const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir('./files', function(err, files) {
    console.log(files);
    res.render('index', { files: files });
  });
});
app.get('/file/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf8', function(err, data) {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.render('show', {filename: req.params.filename, filedata: data});
  });
});
app.get('/edit/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf8', function(err, data) {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.render('edit', {filename: req.params.filename, filedata: data});
  });
});

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`, req.body.details,function (err) {
    res.redirect("/");
  });
});
app.post('/edit/:filename', (req, res) => {
  fs.writeFile(`./files/${req.body.new.split(' ').join('_')}.txt`, req.body.details,function (err) {
    if(req.body.previous !== req.body.new){
      fs.unlink(`./files/${req.body.previous}`, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    res.redirect("/");
  });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
