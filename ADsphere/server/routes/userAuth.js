const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/user');

router.post("/sign-up", async (req, res) => {
    const { email, password, orgName, web, repName, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      repName,
      email: email.toLowerCase(),
      password: hashedPassword,
      orgName,
      web,
      type
    });
  
    newUser.save()
      .then(result => {
        res.json({ message: "Sign Up Successful!", signUp: 1 });
      })
      .catch(error => {
        if (error.code === 11000) {
          res.json({ message: "Email already exists!!", signUp: 0 });
        } else {
          console.error('Error saving user:', error);
          res.status(500).json({ message: 'Internal Server Error', signUp: -1 });
        }
      });
})
  
router.post("/login", async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const type = req.body.type;
  
    let response = {
      login: 0,
      message: "Entry Not Found for such user!",
    };
  
    User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            if (type != user.type) {
              response.message = "Make sure you are logging as a correct user (Advertiser or Logistics Partner)"
              res.json(response)
              return
            }
            response.message = "Logged In!"
            response.login = 1;
            req.session.email = user.email
            req.session.name = user.repName
            req.session.type = user.type.toLowerCase()
            res.json(response);
          }
          else {
            response.message = "Password is Incorrect!"
            response.login = -1
            res.json(response);
          }
        }
        else {
          res.json(response);
        }
      })
      .catch(err => {
        response.message = `Unknown Error: ${err}`
        response.login = -1
        res.json(response);
      });
})

router.post("/update-info", (req, res) => {
  // console.log(req.body.user_data)
  const data = { ...(req.body.user_data) }
  if (!req.session.email || req.session.email !== data.email) {
    res.json({ valid: false, message: "Unauthorized!" })
    return
  }

  // console.log(data)
  User.updateOne({ "email": data.email }, data)
    .then(result => {
      // console.log(result)
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Internal server error" })
    })
  // res.json({success: true,message: "updating.."})
})

router.post("/change-password", (req, res) => {
    const { password, type, newPassword } = req.body;
    const email = req.body.email.toLowerCase();
  
    // session check (logged in or not)
    if (!req.session.email) {
      res.json({ status: false, message: "Invalid request, no login found!!" })
      return
    }
  
    // whether the requested user is the one who is logged in or not
    if (req.session.email !== email) {
      res.json({ status: false, valid: false, message: "Unauthorized!" })
      return
    }
  
    let response = {
      login: 0,
      message: "Invalid request!!",
    };
  
    User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            if (type != user.type) {
              res.json(response)
              return
            }
  
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();
  
            response.message = "Password Changed Successfully!!"
            response.login = 1;
            res.json(response);
          }
          else {
            response.message = "Password is Incorrect!"
            response.login = -1
            res.json(response);
          }
        }
        else {
          res.json(response);
        }
      })
      .catch(err => {
        response.message = `Unknown Error: ${err}`
        response.login = -1
        res.json(response);
      });
})
  
router.get("/verify-login", (req, res) => {
    if (req.session.email) {
      res.json({ valid: true, email: req.session.email, name: req.session.name, type: req.session.type });
    } else {
      res.json({ valid: false });
    }
})
  
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.send("Logged out successfully!");
    });
})

module.exports = router;