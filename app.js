require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const profileroute = require("./routes/profileroute");
const appointment = require('./routes/JobAppoinment');
// const subscriptionRoute = require("./routes/subscriptionRoute");
// const foodItem = require('./routes/foodItemsSchema');
// const scheduleSubscriptionUpdate = require("./routes/subscriptionUpdate");
const cors = require("cors");
const cookiParser = require("cookie-parser")
const port = 8009;



app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);
app.use(profileroute);
app.use(appointment)
// app.use(foodItem); 
// app.use('/api', package);
// app.use("/subscriptions", subscriptionRoute);




app.listen(port,()=>{
    console.log(`server start at port no : ${port}`);

    // Schedule the subscription update task
    // scheduleSubscriptionUpdate();
})
