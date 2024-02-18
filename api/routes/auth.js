const router = require("express").Router();
//route using express
const User = require("../models/User");


const bcrypt = require("bcrypt");

//REGISTER
//each method that we use here could be get or post or put 
// creating==> post , updating ==> put , deleting ==> delete , fetching ==> get 
// res==> what comes after prosesing req==> what we gave the server to process

router.post("/register", async (req, res) => {
  try {
    //generating hashed password using bcrypt 
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      // password : req.body.password
      password: hashedPass,
    });

    const user = await newUser.save();

    // save is from mongoose because we have used user schema 
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");
     
    //creating user and directly saving it to user is not possible that is why we are using doc inside user to save it 

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
