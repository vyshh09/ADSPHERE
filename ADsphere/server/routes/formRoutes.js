const express = require('express');
const router = express.Router();
const Que = require('../models/question');
const Customer = require('../models/customer')

router.post("/addque", async (req, res) => {
    if (!req.session.type || req.session.type !== "admin") {
      res.json({ valid: false, message: "Unauthorized!" })
      return
    }
    try {
      // console.log('Received POST request:', req.body);
      const { que_type, que, mandatory, options, categorize, jsonName } = req.body
      const newque = new Que(
        {
          que_type,
          que,
          mandatory,
          options,
          categorize,
          jsonName
        }
      )
      // console.log(newque)
      await newque.save();
      res.json({ success: true, message: 'question saved successfully' });
    }
    catch (error) {
      console.error('Error uploading que data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
  
router.get('/questions', async (req, res) => {
    
    // for all users, not only admin
    // if (!req.session.type || req.session.type != "admin") {
    //   res.json({ message: "Invalid request!" })
    //   return
    // }
    try {
      
      const { email } = req.query;
  
      const customer = await Customer.findOne({ email }, { questions: 1 });
      
      let questions = []
      if(customer){
        questions = await Que.find( { jsonName: { $nin: customer.questions } } );
  
        if (questions.length <= 1){
          // template questions
        }
      }
      else{
        initial_questions = ['interests']
        questions = await Que.find({ $or: [ { mandatory: true }, { jsonName:{ $in: initial_questions } } ] })
      }
      
      res.json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  
// Route for verifying email
router.get('/verifyEmail', async (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    try {
      const existingCustomer = await Customer.findOne({ email: email });
      if (existingCustomer) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.post("/que-save", (req, res) => {
    if (!req.session.type || req.session.type != "admin") {
      res.json({ valid: false, message: "Unauthorized!" })
      return
    }
    let data = {}
    data["_id"] = req.body["que"]["_id"]
    data["que_type"] = req.body["que"]["que_type"]
    data["que"] = req.body["que"]["que"]
    data["mandatory"] = req.body["que"]["mandatory"]
    data["options"] = req.body["que"]["options"]
    data["categorize"] = req.body["que"]["categorize"]

    Que.updateOne({ "_id": data._id }, data)
      .then(result => {
        res.json({ success: true, message: "saved successfully" });
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
      })
})
router.get('/displayque', (req, res) => {
    if (!req.session.type || req.session.type != "admin") {
      res.json({ valid: false, message: "Unauthorized!" })
      return
    }
    Que.find({})
      .then(data => res.json(data))
  
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "internal server error" })
      })
})

router.post("/remove-entry", (req, res) => {
    if (!req.session.type || req.session.type !== "admin") {
      res.json({ valid: false, message: "Unauthorized!" })
      return
    }
    const del = { _id: req.body.id }
    Que.deleteOne(del)
      .then(data => {
        // console.log(data)
      })
      .catch(err => console.log(err))
    res.json({ message: "trying to remove" })
})

module.exports = router;