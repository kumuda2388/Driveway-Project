//file to handle server calls to back end
const express = require('express')
const cors = require ('cors')
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

const dbService = require('./dbservice');

// Enable CORS for frontend to communicate with the backend
// Allow all origins for development (use this only in dev environment)
app.use(cors({
    origin: 'http://localhost',  // Allow requests from localhost (with your frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
    credentials: true,  // Allow sending cookies (important for sessions)
}));

// Middleware for handling JSON and form data
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',  // Secret key for encrypting session data
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set to true in production with HTTPS
  }));

//endpoint backend to register new user
app.post('/register', async (request, response) => {
    const { first_name, last_name, email, password, address,cardname,cardnumber,expirydate,cvv,phonenumber } = request.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("app: inserting a user.");
      if (email === 'admin@example.com') {
        throw new Error('Email cannot be admin@example.com.');
    }
      // Get DB instance and execute query
      const db = dbService.getDbServiceInstance();
      const result = await db.insertNewName(first_name, last_name, email, hashedPassword, address, cardname,cardnumber,expirydate,cvv,phonenumber);
      response.json({ data: result });
    } catch (err) {
      // Handle errors
      console.error(err);
      response.status(500).send('Error during registration');
    }
  });
  
  // endpoint backend to login for already existing user
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    try {
        // Get DB instance and execute query
        const db = dbService.getDbServiceInstance();
        const user = await db.getUserByEmail(email);  
        console.log("user");
        console.log(user);
        if (!user) {
          console.log("user not found");
            return res.status(400).send('User not found');
        }
        console.log(user.data);
        // Compare entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);  // Compare the entered password
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
        // If the password matches, save user session
        req.session.userId = user.user_id;
        req.session.userEmail = user.email;
        // Respond with success
        res.status(200).json({ message: 'Login successful' });

    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Error during signing in');
    }
});

//endpoint backend to change password
app.post('/passwordchange', async (req, res) => {
  const { email, currentpassword, newpassword } = req.body;
  try {
      // Get DB instance and execute query
      const db = dbService.getDbServiceInstance();
      const user = await db.getUserByEmail(email);  
      if (!user) {
        console.log("user not found");
          return res.status(400).send('User not found');
      }
      // Compare entered password with the stored hashed password
      const isMatch = await bcrypt.compare(currentpassword, user.password);  // Compare the entered password
      if (!isMatch) {
          return res.status(400).send('Invalid password');
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
     const new_password = await db.updatePassword(email,hashedPassword);
      // Respond with success
      res.status(200).json({ message: 'password change successful' });
  } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).send('Error during changing password');
  }
});

//endpoint backend to login for admin
app.post('/adminlogin', (req, res) => {
  const { email, password } = req.body;
  // Compare the provided email and password with the predefined values
  if (email === adminCredentials.email && password === adminCredentials.password) {
      // If the credentials match, set session variables
      req.session.userId = "admin";
      req.session.email = email;
      return res.status(200).json({ message: 'Welcome to the Home page!' });
  } else {
    return res.status(401).send('Not authenticated');
  }
});

  //endpoint backend to home page of customer
  app.get('/home', async(request, response) => {
    if (!request.session.userId || request.session.userId === "admin") {
      return response.status(401).send('Not authenticated');
    }
    response.status(200).json({ message: 'Welcome to the Home page!' });
  });

  //endpoint backend to home page of contractor
  app.get('/home_admin', async(request, response) => {
    if (!request.session.userId) {
      return response.status(401).send('Not authenticated');
    }
    if(request.session.userId === "admin" && request.session.email === "admin@example.com"){
      console.log(request.session.userId);
        console.log(request.session.email);
    response.status(200).json({ message: 'Welcome to the Home page!' });
    return;
    }
    return response.status(401).send('Not authenticated');
  });

  //endpoint backend to logout from current session
  app.get('/logout', async (request, response) => {
    // Clear session data on the server
    request.session.destroy((err) => {
        if (err) {
            // Handle error if session destruction fails
            return response.status(500).send('Failed to log out');
        }
        // Clear the session cookie from the client side
        response.clearCookie('connect.sid');  // Default session cookie name
        console.log('Logged out successfully');
        response.send('Logged out!');
    });
});

//endpoint backend to get submitted request at contractor side
app.get('/cont_submitted_requests', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cont_submitted_requests(); 
      if (result.length > 0) {
          return res.status(200).json({ message: "requests found", data: result });
      } else {
          return res.status(404).json({ message: "No requests found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend to get submitted request at customer side
app.get('/cost_submitted_requests', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cost_submitted_requests(req.session.userId); 
      if (result.length > 0) {
          return res.status(200).json({ message: "requests found", data: result });
      } else {
          return res.status(404).json({ message: "No requests found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend for customer to submit new request form
app.post('/cost_submit_request_form', async (request, response) => {
  const { address, squareFeet, price, note, pictures } = request.body;
  try {
    const db = dbService.getDbServiceInstance();
    const result = await db.insertSubmitRequest(address, squareFeet, price, note, pictures, request.session.userId);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during insertion');
  }
});

//endpoint backend to reject submitted request at contractor side
app.post('/cont_rejectrequest', async (request, response) => {
  const { note ,submit_request_id } = request.body;
  try {
    const db = dbService.getDbServiceInstance();
    const result = await db.cont_rejectrequest(note,submit_request_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating database');
  }
});

//endpoint backend to genearte quote at contractor side
app.post('/cont_generatequote', async (request, response) => {
  const { Price, startDate, endDate ,submit_request_id } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.generateQuote(Price, startDate, endDate, submit_request_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to get quote details at contractor side
app.get('/cont_quote_generated', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cont_quotes_generated(); 
      if (result.length > 0) {
          return res.status(200).json({ message: "requests found", data: result });
      } else {
          return res.status(404).json({ message: "No requests found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend to get all bills at contractor side
app.get('/cont_all_bills', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cont_all_bills(); 
      if (result.length > 0) {
          return res.status(200).json({ message: "requests found", data: result });
      } else {
          return res.status(404).json({ message: "No requests found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend to get quotes generated at customer side
app.get('/cost_quote_generated', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cost_quotes_generated(req.session.userId);
      if (result.length > 0) {
          return res.status(200).json({ message: "requests found", data: result });
      } else {
          return res.status(404).json({ message: "No requests found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend to update quote details at contractor side
app.post('/cont_updatequote', async (request, response) => {
  const { Price, startDate, endDate ,quote_id } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.updateQuote(Price, startDate, endDate, quote_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to update bill at contractor side
app.post('/cont_updatebill', async (request, response) => {
  const { Price, bill_id } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.updateBill(Price, bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to accept quote at customer side
app.post('/cost_acceptquote', async (request, response) => {
  const { quote_id, price, startdate, enddate } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.acceptupdatequote(quote_id, price, startdate, enddate);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to update payment status of bill at customer side
app.post('/cost_updatebill' ,async (request, response) => {
  const { bill_id} = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.updatepayment(bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to negotiate bill details with customer side
app.post('/cost_negotiatebill',async (request, response) => {
  const { note_message, bill_id} = request.body;
  try {
    // Get DB instance and insert user data
    const db = dbService.getDbServiceInstance();
    const result = await db.costbillnegotiation(note_message, bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to update bill status to dispute at contractor side
app.post('/cont_disputebill',async (request, response) => {
  const { bill_id } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.updatedisputebill(bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to generate bill at contractor side
app.post('/cont_generatebill', async (request, response) => {
  const { order_id, price } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.generateBill(order_id,price);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to reject quote at customer side
app.post('/cost_rejectquote', async (request, response) => {
  const { quote_id } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.rejectupdatequote(quote_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during updating');
  }
});

//endpoint backend to negotiate quote at contractor side
app.post('/cont_negotiatequote', async (request, response) => {
  const { note_message, quote_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.insertNegotiation(note_message, quote_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to display negotiation data
app.post('/billnegotiatedata', async (request, response) => {
  const { note_message, bill_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.billdisplayNegotiation(bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to get all bills for that user at customer side
app.get('/cost_bills_generated',async (request, response) => {
  const { note_message, bill_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.get_cost_all_bills(request.session.userId);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to insert negotiation data of bill at contractor side
app.post('/cont_negotiatebill',async (request, response) => {
  const { note_message, bill_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.insertNegotiationBill(note_message, bill_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to insert negotiation data of bill at customer side
app.post('/cost_negotiatequote', async (request, response) => {
  const { note_message, quote_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.insertcostNegotiation(note_message, quote_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

///endpoint backend to get negotiation data of quote
app.post('/quotenegotiatedata', async (request, response) => {
  const { quote_id  } = request.body;
  try {
    // Get DB instance and execute query
    const db = dbService.getDbServiceInstance();
    const result = await db.quoteNegotiation(quote_id);
    response.json({ data: result });
  } catch (err) {
    // Handle errors
    console.error(err);
    response.status(500).send('Error during registration');
  }
});

//endpoint backend to get order details at contractor side
app.get('/cont_orders_generated', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cont_orders_generated(); 
      if (result.length > 0) {
          return res.status(200).json({ message: "orders found", data: result });
      } else {
          return res.status(404).json({ message: "No orders found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint backend to get order details at customer side
app.get('/cost_orders_generated', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  try {
      const result = await db.get_cost_orders_generated(req.session.userId);
      if (result.length > 0) {
          return res.status(200).json({ message: "orders found", data: result });
      } else {
          return res.status(404).json({ message: "No orders found" });
      }
  } catch (error) {
      console.error(error.message); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
  }
});

//end point backend to access data for contractor's dashboard
app.get('/cont_dashboard', async (request, response) => {
  const db = dbService.getDbServiceInstance();
  try {
    // Fetching various sets of data from the database
    const bigClients = await db.getBigClients();
    const difficultClients = await db.getDifficultClients();
    const thisMonthQuotes = await db.getThisMonthQuotes();
    const prospectiveClients = await db.getProspectiveClients();
    const largestDriveway = await db.getLargestDriveway();
    const overdueBills = await db.getOverdueBills();
    const badClients = await db.getBadClients();
    const goodClients = await db.getGoodClients();

    // Sending the fetched data as a JSON response
    response.json({
      data: {
        bigClients,
        difficultClients,
        thisMonthQuotes,
        prospectiveClients,
        largestDriveway,
        overdueBills,
        badClients,
        goodClients,
      },
    });
  } catch (err) {
    // Handling any errors during the fetching process
    console.error('Error fetching data:', err);
    response.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT, 
    () => {
        console.log("I am listening.")
    }
);