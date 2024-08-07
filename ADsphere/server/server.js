const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const { faker } = require('@faker-js/faker');

const relatedCategoriesMap = require('./data/relatedCategories.json');

const app = express();

// body parser, converts raw request.body to json format
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '8mb' }));

// public folder for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// session cookies, saving login session
const secret = process.env.COOKIE_SECRET_KEY || "57d83a38752ac885cff505b2b310a499b6c9e70e947b882626825bf9f4b8d8a3";
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    },
  })
);

// connection to the mongoDB Atlas
const URI = "mongodb+srv://vivekhruday005:kFdzrmET7mrcf4NI@cluster0.bficz.mongodb.net/box_ads"
mongoose.connect(URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Database Models
const User = require("./models/user")
const Que = require("./models/question")
const Customer = require("./models/customer")
const Response = require("./models/response")
const AdModel = require("./models/advertisment")

// Utils
const renameFile = require("./utils/utils")

// Routes
const userRouter = require('./routes/userAuth');
const adRouter = require('./routes/adRoutes');
const formRouter = require('./routes/formRoutes');

app.use('/', userRouter);
app.use('/', adRouter);
app.use('/', formRouter);

const CUSTOMER_MAPS_LIMIT = 20;
const MAPPED_ADS_LIMIT = 10;

const SpecificQuestions = () => {
  // If the customer has interacted with an Advertiser,
  // show him other ads of the same advertiser

  // Introduce other advertisers in the same region or age-group maybe
  // "Have you heard of 'Org. Name'?"
  // "Do you fall under the category of 'so-and-so'?"
  // "Are you willing to buy 'product/service' in next 6 months?"
}


app.get('/get-associations', async (req, res) => {
  if (!req.session.type) {
    res.json({ success: false, message: "Unauthorized!" })
    return
  }
  try {
    const email = req.session.email;
    let retrievedassociates = []
    if (req.session.type === "admin") {
      retrievedassociates = await User.find({ $or: [{ type: "advertiser" }, { type: "logistics" }] }).lean();
    }
    else
      count = await User.find().lean();

    res.json({ success: true, associates: retrievedassociates });
  }
  catch (error) {
    console.error('Error fetching data:', error);
    res.json({ status: 500, success: false, message: error })
  }
})

app.get('/get-advertiser-details', async (req, res) => {

  if (!req.session.type) {
    res.json({ success: false, message: "Unauthorized!" })
    return
  }
  try {
    const email = req.session.email;
    const advertiser_email = req.query.email.toString();
    let advertiserDetails = []
    if (req.session.type === "admin") {
      advertiserDetails = await User.find({ email: advertiser_email }).lean();
    }
    else
      advertiserDetails = await User.find().lean();

    res.json({ success: true, details: advertiserDetails });
  }
  catch (error) {
    console.error('Error fetching data:', error);
    res.json({ status: 500, success: false, message: error })
  }
})

app.get('/get-stats', async (req, res) => {
  if (!req.session.type) {
    res.json({ success: false, message: "Unauthorized!" })
    return
  }
  try {
    const email = req.session.email;
    let count = []
    if (req.session.type === "admin") {
      count[0] = await AdModel.countDocuments({ approval: "null", });
      count[1] = await AdModel.countDocuments({ payment_status: "1", });
      count[2] = await AdModel.countDocuments({ approval: "1", payment_status: "0", });
      count[3] = await AdModel.countDocuments({ approval: "0", });
    }
    else if (req.session.type === "advertiser") {
      count[0] = await AdModel.countDocuments({ approval: "null", ad_id: { $regex: email, $options: 'i' }, });
      count[1] = await AdModel.countDocuments({ payment_status: "1", ad_id: { $regex: email, $options: 'i' }, });
      count[2] = await AdModel.countDocuments({ approval: "1", payment_status: "0", ad_id: { $regex: email, $options: 'i' }, });
      count[3] = await AdModel.countDocuments({ approval: "0", ad_id: { $regex: email, $options: 'i' }, });
    }
    else
      count = await AdModel.find().lean();

    res.json({ success: true, data: count });
  }
  catch (error) {
    console.error('Error fetching data:', error);
    res.json({ status: 500, success: false, message: error })
  }
})

app.post('/formResponses', async (req, res) => {
  try {
    const { normalResponses, categorizedResponses } = req.body;
    const timestamp = (new Date()).toString()
    console.log(timestamp)

    if (normalResponses.age) {
      normalResponses.age = parseInt(normalResponses.age);
      console.log(normalResponses)
    }
    const normalQuestions = Object.keys(normalResponses);
    const categorizedQuestions = Object.keys(categorizedResponses);

    let all_questions = [...normalQuestions, ...categorizedQuestions];
    all_questions = all_questions.filter(item => item !== "email");

    console.log(all_questions)

    // Save normal responses to the database
    const normalResponse = new Response({
      personal_info: normalResponses,
      categorize: categorizedResponses,
      timestamp,
      orderId: faker.lorem.word(),
      product_type: faker.commerce.product(),

      // random category in our list
      product_category: faker.commerce.department(),
      mapped_ads: [],
      customer_email: normalResponses.email,
      status: "ready-to-print",
    });
    await normalResponse.save();

    // console.log(categorizedResponses.interests)
    let interests = []
    if (categorizedResponses.interests) {
      interests = categorizedResponses.interests.slice(0, 10);
    }

    Customer.findOne({ email: normalResponses.email })
      .then(async (customer) => {
        if (customer) {
          if (interests.length > 0) {
            interests.forEach(interest => {
              if (!customer.categories.includes(interest))
                customer.categories.push(interest)

              // incrementing with one, since it is still relevant for the customer
              else
                customer.category_scores[customer.categories.indexOf(interest)] += 3
            })
          }
          customer.questions = customer.questions.concat(all_questions)
          await customer.save();
        }
        else {
          const newCustomer = new Customer({
            email: normalResponses.email.toLowerCa3se(),
            personal_info: normalResponses,
            categories: interests,
            category_scores: Array(interests.length).fill(3),
            advInteracted: [],
            questions: all_questions,
          });

          await newCustomer.save();
        }
      })

    res.status(200).send('Responses saved successfully');
  }
  catch (error) {
    console.error('Error saving responses:', error);
    res.status(500).send('Internal Server Error');
  }

})

app.get("/get-user-details", (req, res) => {
  // console.log(req.query.email)
  if (!req.session.email) {
    res.json({ status: false, message: "Not logged in!" })
    return
  }

  User.findOne({ email: req.session.email })
    .then(data => {
      // console.log(data)
      res.json({ status: true, info: data })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Internal server error" })
    })
})

// QR Tracking
app.get("/verify-qr", (req, res) => {
  AdModel.find(req.query)
    .then(result => {
      if (result.length === 0) {
        res.status(404).json({ message: "page not found" })
      }
      else {
        res.json({ success: true, websiteUrl: result[0].websiteUrl })
      }
    })
    .catch(err => console.log(err))
})

app.post("/record-customer-interaction", (req, res) => {
  // const {email, location} = req.body.data
  const qr_link_id = req.query
  // console.log(req.body.normalResponses)
  // console.log()
  // AdModel.findOneAndUpdate()

  const email = req.body.normalResponses.email;
  let adCategory;

  AdModel.findOneAndUpdate(qr_link_id, { $push: { customers: req.body.normalResponses } })
    .then(result => {
      adCategory = result.ad_category;
      console.log(result.websiteUrl)
      res.json({ success: true, websiteUrl: result.websiteUrl })
    })
    .catch(err => console.log(err))

  Customer.findOne({ email: email })
    .select("categories")
    .then(customer => {
      let related_categories = relatedCategoriesMap[adCategory];
      related_categories.forEach((category, index) => {
        if (category == adCategory) {
          customer.category_scores[index] += 7
        }
        if (!customer.categories.includes(category) && customer.categories.length < CUSTOMER_MAPS_LIMIT)
          customer.categories.push(category)
        else if (customer.categories.includes(category)) {
          customer.category_scores[index] += 3
        }
      })

      customer.save()
    })
})

//logistic dashboard 
app.get("/retrieve-orders", (req, res) => {
  Response.find({status: {$ne: "dispatched"}})
    .then(data => {
      // console.log(data)
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Invalid request" })
    })
})

app.post("/dispatch-order", (req, res) => {
  
  if(!req.session.type || req.session.type != "logistics"){
    res.json({message: "Unauthorized request!"})
    return
  }
  
  let query = req.query
  console.log(req.body)
  console.log(query)
  
  User.find({ email: req.session.email, type: req.session.type })
    .then(user => {
      if(user){
        if (!user.options)
          user.options = {}
        
        if(user.options.current_prints)
          user.options.current_prints += req.body.length
        else
          user.options.current_prints = 0

        user.markModified('options');
        user.save()
      }
    })

  Response.updateMany(req.query, { $set: { status: "dispatched" } })
    .then(result => {
      console.log(result)
      // res.json({ success: true })
      if (result.acknowledged) {
        console.log("hi")
        AdModel.updateMany({ ad_id: { $in: req.body.mapped_ads } }, { $inc: { prints: 1 } }, { multi: true })
          .then(reslt => {
            console.log(reslt)
            res.json({ success: true })
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({success: false,message: "request failed!"})
      })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ success: false, message: "Request failed!" })
    })
  // res.status(500).json({ success: false, message: "Request failed!" })
})

app.post("/toggle-payments", (req, res) => {
  
  if (!req.session.type || req.session.type != "admin"){
    res.json({message: "Unauthorized request!"})
    return
  }

  const { logistics_id, status } = req.body;

  User.findOne({ _id: logistics_id, type: "logistics" })
    .then(user => {
      user.options = {}
      user.options.payments = status

      user.markModified('options');
      user.save()
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  
  res.json({message: "Saved!"})
})

const PAYMENT_THRESHOLD = 900;
const PRINT_COST = 5;

app.get("/payments-status", (req, res) => {
  if (!req.session.type || req.session.type != "logistics"){
    res.json({message: "Unauthorized request!"})
    return
  }

  User.findOne({ email: req.session.email, type: req.session.type })
    .then(user => {
        if(user){
          if (user.options){
            if (!user.options.current_prints){
              user.options.current_prints = 0
      
              user.markModified('options');
              user.save()
            }
            res.json({status: user.options.payments, total_prints: user.options.current_prints, payment_threshold: PAYMENT_THRESHOLD, print_cost: PRINT_COST})
          }
          else
            res.json({status: "off"})
        }
        else{
          res.json({message: "Something went wrong!"})
        }
    })
    .catch(err => console.log(err));
})

app.post("/request-payout", (req, res) => {
  if (!req.session.type || req.session.type != "logistics"){
    res.json({message: "Unauthorized request!"})
    return
  }

  User.findOne({ email: req.session.email, type: req.session.type })
  .then(user => {
    if(user){
      if(user.options.request == "payment-request")
        res.json({message: "Request already in queue"})
      else{
        user.options.request = "payment-request"

        user.markModified('options');
        user.save()
          .then(resp => {
            res.json({message: "Requested!"})
          })
      }
    }
  })
  .catch(err => console.log(err));
})

app.post("/accept-payment-request", (req, res) => {
  if (!req.session.type || req.session.type != "admin"){
    res.json({message: "Unauthorized request!"})
    return
  }

  User.findOne({ _id: req.body.logistics_id })
    .then(user => {
      if(user){ 
        if(user.options && user.options.request){
          user.options.current_prints = 0
          user.options.request = false
  
          user.markModified('options');
          user.save()
            .then(resp => res.json({message: "Approved Payment request!"}) )
        }
        else{
          res.json({message: "Invalid!"})
        }
      }
    })
})

function getIndicesWithTrue(obj) {
  return Object.entries(obj)
    .filter(([index, value]) => value === true)
    .map(([index]) => parseInt(index));
}
app.listen(4000, async () => {
  console.log("Server running on port 4000");
});


const constantDecrementCategory = () => {
  Customer.find({})
  .then(customers => {
    customers.forEach((customer, index) => {
      if(customer.category_scores){
        customer.category_scores.forEach((score, index) => {
          customer.category_scores[index] -= 1

          // remove the category from the customer_categories if it is less than 15-20, i.e, 
          // there is no reference of that particular category from 15-20 days, so, their interests might have changed
        })
      }
    })

    customers.save()
  })
};

// // Set the interval to execute the category decrement once every 12 hours
const categoryDecrementalInterval = setInterval(constantDecrementCategory, 1000 * 60 * 60 * 12);
