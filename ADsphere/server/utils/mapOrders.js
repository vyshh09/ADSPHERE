const Customer = require('../models/customer')
const Response = require('../models/response')

const CUSTOMER_MAPS_LIMIT = 20;
const MAPPED_ADS_LIMIT = 10;

const ageGroups = [
    { $lt: 18 }, // < 18
    { $gte: 18, $lt: 24 }, // 18 - 24
    { $gte: 24, $lt: 30 }, // 24 - 30
    { $gte: 30, $lt: 40 }, // 30 - 40
    { $gte: 40, $lt: 50 }, // 40 - 50
    { $gte: 50, $lt: 65 }, // 50 - 65
    { $gte: 65 } // 65+
];

const mapOrders = (advertisement) => {

    // 1. Take an Ad
    // 2. Get customer's orders whose region is that.
    // 3. Also take their age maybe
    // 4. Take the interests from the corresponding Response, 
    //    and check it with the category of the ad.
  
    let adAge = []
    Array.from(advertisement.ad_target_age).forEach(index => adAge.push(ageGroups[index]))

    adAge = adAge.filter(Boolean);

    const ageQueries = adAge.map(ageGroup => {
      return {
        'personal_info.age': ageGroup
      };
    });
  
    let customer_emails = []
    
    let query = {}

    if (ageQueries.length == 0){
        query = { 'personal_info.region': advertisement.ad_region }
    }
    else{
        query = { 'personal_info.region': advertisement.ad_region, $or: ageQueries }
    }

    Customer.find(query)
      .select('email categories')
      .then(customers => {
        const customer_categories = customers.reduce((acc, customer) => {
          acc[customer.email] = customer.categories;
          return acc;
        }, {});
  
        customer_emails = customers.map(customer => customer.email)
        console.log(customer_emails)
  
        Response.find({ customer_email: { $in: customer_emails }, status: { $ne: "dispatched" } })
          .then(responses => {
            responses.map(response => {
              if ((customer_categories[response.customer_email].includes(advertisement.ad_category)
                || false
                || response.product_category == advertisement.ad_category)
                && !response.mapped_ads.includes(advertisement.ad_id)
                && response.mapped_ads.length < MAPPED_ADS_LIMIT
              ) {
                response.mapped_ads.push(advertisement.ad_id)
                console.log(response.orderId, response.mapped_ads)
                response.save()
                  .then(res => console.log("saved"))
              }
            })
          })
          .catch(err => console.log(err));
  
        // add the customers to the ad object and save()
      })
      .catch(err => console.log(err));
  
}

module.exports = mapOrders;