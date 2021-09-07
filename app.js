require("dotenv").config({path: "./config.env"});
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const connectDB = require("./db");
const task = require("./model/task");
// const custom = require("./model/custom");

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  const day = date.getDate();
  task.find({}, (err, foundTasks) => {
    if(err){
      console.log(err);
    } else {
      res.render("list", { listTitle: day, newListItems: foundTasks });
    }
  });
});

// app.get("/:customName", (req, res) => {
//   const customName = req.params.customName;
//   custom.findOne({name: customName}, (err, foundList) => {
//     if(!err){
//       if(!foundList){
//         const list = new custom({
//           name: customName,
//         });
//         list.save();
//       } else {
//         res.render("list", {listTitle: foundList.name, newListItems: foundList.newListItems});
//       }
//     }
//   });
// });


app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new task({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req,res) => {
  const checkedTask = req.body.checkbox;
  task.findByIdAndRemove(checkedTask, (err) => {
    if(!err){
      res.redirect("/");
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
