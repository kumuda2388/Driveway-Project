//file that contains all queries
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 

//connecting to SQL database
const connection = mysql.createConnection({
    host: process.env.HOST,
    user:"root",        
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

//to check if connection to database is success/failure
connection.connect((err) => {
    if(err){
       console.log(err.message);
    }
    console.log('db ' + connection.state);    
});

//class and functions to access database
class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        //creates new instance if not present or else uses existing instance
        return instance? instance: new DbService();
    }

    async getUserByEmail(email) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE email = ?";  // Query to get user by email
                connection.query(query, [email], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results[0]);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }
    
    async insertNewName(first_name, last_name, email, hashedPassword, address, cardname, cardnumber, expirydate, cvv, phonenumber) {
        try {
            // Use await to call an asynchronous function (database query)
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (user_id, first_name, last_name, email, password, address, card_name, card_number, expiry_date, cvv, phone_number, created_at) VALUES (UUID(),?, ?, ?, ?, ?,?,?,?,?,?,CURRENT_TIMESTAMP)";
                //query to insert into user tables
                connection.query(query, [first_name, last_name, email, hashedPassword, address,cardname, cardnumber, expirydate, cvv, phonenumber], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            return response;
        } catch (error) {
            // Log and rethrow error for handling in the route controller
            console.error(error);
            throw new Error('Error inserting new user into the database');
        }
    }
    
    async updatePassword(email,newpassword) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE users SET password = ? WHERE email = ?;";  // Query to set new password
                connection.query(query, [newpassword, email], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async get_cont_submitted_requests() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM SubmitRequest";  // Query to get all submit requests
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async get_cost_quotes_generated(userid) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT q.Quote_ID, q.Price, q.Start_Period, q.End_Period, q.Status, sr.Submitrequest_ID FROM Quotes q JOIN SubmitRequest sr ON q.Submitrequest_ID = sr.Submitrequest_ID WHERE sr.user_id = ?";
                //query to get user's quote
                connection.query(query, [userid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async get_cost_submitted_requests(id) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM SubmitRequest where user_id=?";  // Query to get submit request for that user
                connection.query(query,[id], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async billdisplayNegotiation(billid){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM BillNegotiation WHERE BillID = ? ORDER BY timestamp ASC;";  // Query to get user by email
                //query to get bill negotiation data
                connection.query(query,[billid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async cont_rejectrequest(rejection_note,submit_request_id){
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE SubmitRequest SET Note_from_contractor = ?, Tracking_Status = 'Rejected' WHERE Submitrequest_ID = ?;"; 
                //query to update status of submit request
                connection.query(query, [rejection_note,submit_request_id], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async insertSubmitRequest(address, squareFeet, price, note, pictures, userid){
        try {
            // Use await to call an asynchronous function (database query)
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO SubmitRequest (Address, Square_Feet, Price_Dollars, Driveway_Pictures, Note, Tracking_Status, user_id) VALUES (?,?,?,?,?,?,?)";
                // query to insert submit request
                connection.query(query, [address, squareFeet, price, pictures, note, "requested", userid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            console.log(response);
            // Return the result (e.g., inserted user information)
            return response;
        } catch (error) {
            // Log and rethrow error for handling in the route controller
            console.error(error);
            throw new Error('Error inserting new user into the database');
        }
    }

    async generateQuote(price, startdate, enddate, submitrequestid) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query1 = "INSERT INTO Quotes (Price, Start_Period, End_Period, Submitrequest_ID) values (?,?,?,?);";
                //query to insert to qoutes table
                connection.query(query1, [price, startdate, enddate, submitrequestid], (err1, results) => {
                    if (err1) {
                        return reject(new Error(err1.message)); // Reject the promise if there is an error
                    }
                    // Execute the second query independently of the first one
                    const query2 = "UPDATE SubmitRequest SET Tracking_Status = 'Accepted' WHERE Submitrequest_ID = ?;"; //query to update status of submit request
                    connection.query(query2, [submitrequestid], (err2, results2) => {
                        if (err2) {
                            console.error("Second query failed:", err2.message); // Log error for the second query
                        }
                        // Resolve with the results of the first query
                        resolve(results);
                    });
                });
            });
            // Return the result (first query results)
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error executing queries');
        }
    }    

    async get_cont_quotes_generated(){
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Quotes";  // Query to get quotes
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async get_cont_all_bills(){
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Bills";  // Query to get bills data
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async get_cost_all_bills(userid){
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT Bills.BillID,Bills.Price AS Bill_Price,Bills.Status AS Bill_Status,Bills.Timestamp AS Bill_Timestamp,Bills.Payment_date,Bills.Due_Date,Orders.Order_ID FROM Bills JOIN Orders ON Bills.Order_ID = Orders.Order_ID JOIN Quotes ON Orders.Quote_ID = Quotes.Quote_ID JOIN SubmitRequest ON Quotes.Submitrequest_ID = SubmitRequest.Submitrequest_ID JOIN users ON SubmitRequest.user_id = users.user_id WHERE users.user_id = ? ORDER BY Bills.Timestamp DESC;";  
                //query to get bills of that user
                connection.query(query,[userid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching user by email');
        }
    }

    async updateQuote(price, startdate, enddate, quoteid) {
        try {
            // Wrap the query in a Promise for async/await handling
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Quotes SET Price = ?, Start_Period = ?, End_Period = ?, Timestamp=CURRENT_TIMESTAMP WHERE Quote_ID = ?;"; //query to update quote details
                connection.query(query, [price, startdate, enddate, quoteid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (updated rows) or null if no rows were affected
            return response;
        } catch (error) {
            // Log any error that occurs
            console.error(error);
            throw new Error('Error updating quote');
        }
    }
    
    async updateBill(price, billid) {
        try {
            // Wrap the query in a Promise for async/await handling
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Bills SET Price = ? WHERE BillID = ?;"; //query to update bills
                connection.query(query, [price, billid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (updated rows) or null if no rows were affected
            return response;
        } catch (error) {
            // Log any error that occurs
            console.error(error);
            throw new Error('Error updating quote');
        }
    }

async updatepayment(billid){
try {
            // Wrap the query in a Promise for async/await handling
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Bills SET Status = ?, Payment_date = CURRENT_TIMESTAMP WHERE BillID = ?;"; //queery to update bills
                                connection.query(query, ["PAID", billid], (err, results) => {
                                    if (err) {
                                        reject(new Error(err.message));  // Reject with error message if query fails
                                    } else if (!results || results.affectedRows === 0) {
                                        resolve(null);  // No user found, resolve with null
                                    } else {
                                        console.log(results);
                                        resolve(results);  // Resolve with the first user (since emails should be unique)
                                    }
                });
            });
            // Return the result (updated rows) or null if no rows were affected
            return response;
        } catch (error) {
            // Log any error that occurs
            console.error(error);
            throw new Error('Error updating quote');
        }
}

    async acceptupdatequote(quoteid, price, startdate, enddate) {
    try {
        // Use await to call an asynchronous function
        const response = await new Promise((resolve, reject) => {
            const query1 = "UPDATE Quotes SET  Status = ? WHERE Quote_ID = ?;"; //query to update quotes
                connection.query(query1, ["accepted", quoteid], (err1, results) => {
                if (err1) {
                    return reject(new Error(err1.message)); // Reject the promise if there is an error
                }
                // Execute the second query independently of the first one
                const query2 = "INSERT INTO Orders (Quote_ID, Price, Start_Date, End_Date, Status) VALUES (?, ?, ?, ?, ?);"; //query to insert to orders table
                connection.query(query2, [quoteid, price, startdate, enddate, "work in progress"], (err2, results2) => {
                    if (err2) {
                        console.error("Second query failed:", err2.message); // Log error for the second query
                    }
                    // Resolve with the results of the first query
                    resolve(results);
                });
            });
        });
        // Return the result (first query results)
        return response;
    } catch (error) {
        // Log any error that occurs during the process
        console.log(error);
        throw new Error('Error executing queries');
    }
}    

async updatedisputebill(billid){
    try {
        // Wrap the query in a Promise for async/await handling
        const response = await new Promise((resolve, reject) => {
            const query = "UPDATE Bills SET  Status = ? WHERE BillID = ?;"; //query to update bills
            connection.query(query, ["Dispute", billid], (err, results) => {
                if (err) {
                    reject(new Error(err.message));  // Reject with error message if query fails
                } else if (!results || results.affectedRows === 0) {
                    resolve(null);  // No user found, resolve with null
                } else {
                    console.log(results);
                    resolve(results);  // Resolve with the first user (since emails should be unique)
                }
            });
        });
        // Return the result (updated rows) or null if no rows were affected
        return response;
    } catch (error) {
        // Log any error that occurs
        console.error(error);
        throw new Error('Error updating quote');
    }
}

    async rejectupdatequote(quoteid) {
        try {
            // Wrap the query in a Promise for async/await handling
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Quotes SET  Status = ? WHERE Quote_ID = ?;"; //query to update quotes
                connection.query(query, ["quit", quoteid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.affectedRows === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (updated rows) or null if no rows were affected
            return response;
        } catch (error) {
            // Log any error that occurs
            console.error(error);
            throw new Error('Error updating quote');
        }
    }

    async insertNegotiation(note, quote_id){
        try {
            // Use await to call an asynchronous function (database query)
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO QuoteNegotiation (note_message_details, quote_id, sender) VALUES (?,?,?)";
                //query to insert to quote negotiation table
                connection.query(query, [note, quote_id, "admin"], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            console.log(response);
            // Return the result (e.g., inserted user information)
            return response;
        } catch (error) {
            // Log and rethrow error for handling in the route controller
            console.error(error);
            throw new Error('Error inserting new user into the database');
        }
    }

async insertNegotiationBill(note, bill_id){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "INSERT INTO BillNegotiation (note_message, BillID,  sender) VALUES (?,?,?)";
            // query to insert to bill negotiation table
            connection.query(query, [note, bill_id, "admin"], (err, results) => {
                if (err) {
                    reject(new Error(err.message));  // Reject with error message if query fails
                } else if (!results || results.length === 0) {
                    resolve(null);  // No user found, resolve with null
                } else {
                    console.log(results);
                    resolve(results);  // Resolve with the first user (since emails should be unique)
                }
            });
        });
        console.log(response);
        // Return the result (e.g., inserted user information)
        return response;
    } catch (error) {
        // Log and rethrow error for handling in the route controller
        console.error(error);
        throw new Error('Error inserting new user into the database');
    }
}

async costbillnegotiation(note, bill_id){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "INSERT INTO BillNegotiation (note_message, BillID,  sender) VALUES (?,?,?)";
            // query to insert to bill negotiation table
            connection.query(query, [note, bill_id, "user"], (err, results) => {
                if (err) {
                    reject(new Error(err.message));  // Reject with error message if query fails
                } else if (!results || results.length === 0) {
                    resolve(null);  // No user found, resolve with null
                } else {
                    console.log(results);
                    resolve(results);  // Resolve with the first user (since emails should be unique)
                }
            });
        });
        console.log(response);
        // Return the result (e.g., inserted user information)
        return response;
    } catch (error) {
        // Log and rethrow error for handling in the route controller
        console.error(error);
        throw new Error('Error inserting new user into the database');
    }
}

async insertcostNegotiation(note, quote_id){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "INSERT INTO QuoteNegotiation (note_message_details, quote_id, sender) VALUES (?,?,?)";
            // query to insert to quote negotiation table
            connection.query(query, [note, quote_id, "user"], (err, results) => {
                if (err) {
                    reject(new Error(err.message));  // Reject with error message if query fails
                } else if (!results || results.length === 0) {
                    resolve(null);  // No user found, resolve with null
                } else {
                    console.log(results);
                    resolve(results);  // Resolve with the first user (since emails should be unique)
                }
            });
        });
        console.log(response);
        // Return the result (e.g., inserted user information)
        return response;
    } catch (error) {
        // Log and rethrow error for handling in the route controller
        console.error(error);
        throw new Error('Error inserting new user into the database');
    }
}

    async quoteNegotiation(quote_id) {
        try {
            // Wrapping the query inside a promise
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM QuoteNegotiation WHERE quote_id = ? ORDER BY timestamp ASC";
                // Query to get negotiation data by quote_id
                connection.query(query, [quote_id], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            return response;  // This will be either the results or null if no results found
        } catch (error) {
            console.error("Error in quoteNegotiation:", error);  // Log specific error
            throw new Error('Error fetching quote negotiation data');
        }
    }

    async get_cont_orders_generated(){
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Orders";  
                //query to get order details
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching work order');
        }
    }

    async get_cost_orders_generated(userid) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT o.Order_ID, o.Quote_Id, o.Price, o.start_Date, o.End_Date, o.status FROM Orders o JOIN Quotes q ON o.Quote_ID = q.Quote_ID JOIN SubmitRequest sr ON q.Submitrequest_ID = sr.Submitrequest_ID JOIN users u ON sr.user_id = u.user_id WHERE u.user_id = ?";
                //query to get order details for that user
                connection.query(query, [userid], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (!results || results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching work order');
        }
    }

    async generateBill(orderid, price) {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query1 = "UPDATE Orders SET  Status = ? WHERE Order_ID = ?;"; //query to update orders
                    connection.query(query1, ["completed", orderid], (err1, results) => {
                    if (err1) {
                        return reject(new Error(err1.message)); // Reject the promise if there is an error
                    }
                    // Execute the second query independently of the first one
                    const query2 = "INSERT INTO Bills (Order_ID, Price, Status, Payment_date, Due_Date) VALUES (?, ?, ?, NULL, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY))";
                    //query to insert to bills table
                    connection.query(query2, [orderid, price, "Generated"], (err2, results2) => {
                        if (err2) {
                            console.error("Second query failed:", err2.message); // Log error for the second query
                        }
                        // Resolve with the results of the first query
                        resolve(results);
                    });
                });
            });
            // Return the result (first query results)
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error executing queries');
        }
    }    

    async getBigClients() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT u.email, u.first_name, u.last_name, COUNT(o.Order_ID) AS TotalCompletedOrders FROM submitrequest sr JOIN Quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID JOIN Orders o ON q.Quote_ID = o.Quote_ID JOIN users u ON sr.user_id = u.user_id WHERE o.Status = 'completed' GROUP BY u.user_id HAVING COUNT(o.Order_ID) = (SELECT MAX(TotalCompletedOrders) FROM (SELECT COUNT(o.Order_ID) AS TotalCompletedOrders FROM submitrequest sr JOIN Quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID JOIN Orders o ON q.Quote_ID = o.Quote_ID WHERE o.Status = 'completed' GROUP BY sr.user_id) AS Subquery);";
connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No clients found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the list of clients
                    }
                });
            });
    
            // Return the result (big clients data) if found, or null if not found
            return response;
    
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching big clients');
        }
    }
    
    async getDifficultClients() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT u.user_id, u.email, u.first_name, u.last_name FROM users u JOIN submitrequest sr ON u.user_id = sr.user_id LEFT JOIN quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID LEFT JOIN orders o ON q.Quote_ID = o.Quote_ID WHERE sr.user_id IN (SELECT sr.user_id FROM submitrequest sr JOIN quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID WHERE q.Status IN ('Sent') GROUP BY sr.user_id HAVING COUNT(DISTINCT sr.Submitrequest_ID) >= 3) AND o.Order_ID IS NULL GROUP BY u.user_id;";
connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching difficult clients');
        }
    }
    
    async getThisMonthQuotes() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT Quote_ID, Price, Start_Period, End_Period, Submitrequest_ID, Status, Timestamp FROM Quotes WHERE Status = 'Accepted' AND YEAR(Start_Period) = YEAR(CURDATE()) AND MONTH(Start_Period) = MONTH(CURDATE());";
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching this month quotes');
        }
    }
    
    async getProspectiveClients() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT u.user_id, u.first_name, u.last_name, u.email FROM users u LEFT JOIN submitrequest sr ON u.user_id = sr.user_id WHERE sr.Submitrequest_ID IS NULL;";
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching prospective clients');
        }
    }
    
    
    async getLargestDriveway() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT sr.Address, sr.Square_Feet FROM SubmitRequest sr JOIN Quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID JOIN Orders o ON q.Quote_ID = o.Quote_ID WHERE sr.Square_Feet = (SELECT MAX(sr2.Square_Feet) FROM SubmitRequest sr2 JOIN Quotes q2 ON sr2.Submitrequest_ID = q2.Submitrequest_ID JOIN Orders o2 ON q2.Quote_ID = o2.Quote_ID);";
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching data');
        }
    }
    
    async getOverdueBills() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT BillID, Order_ID, Price, Status, Timestamp, Payment_date, Due_Date FROM Bills WHERE (Payment_date > Due_Date OR (Payment_date IS NULL AND CURDATE() > Due_Date));";
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching bills');
        }
    }
    
    async getBadClients() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT u.user_id, u.first_name, u.last_name, u.email FROM users u JOIN SubmitRequest sr ON u.user_id = sr.user_id JOIN Quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID JOIN Orders o ON q.Quote_ID = o.Quote_ID JOIN Bills b ON o.Order_ID = b.Order_ID GROUP BY u.user_id, u.first_name, u.last_name, u.email HAVING COUNT(CASE WHEN b.Payment_date IS NULL AND b.Due_Date < CURDATE() THEN 1 END) = COUNT(b.BillID);";

                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching data');
        }
    }
    
    async getGoodClients() {
        try {
            // Use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT u.user_id, u.first_name, u.last_name, u.email FROM users u JOIN SubmitRequest sr ON u.user_id = sr.user_id JOIN Quotes q ON sr.Submitrequest_ID = q.Submitrequest_ID JOIN Orders o ON q.Quote_ID = o.Quote_ID JOIN Bills b ON o.Order_ID = b.Order_ID WHERE b.Payment_date IS NOT NULL AND TIMESTAMPDIFF(HOUR, b.Timestamp, b.Payment_date) <= 24 GROUP BY u.user_id, u.first_name, u.last_name;";
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));  // Reject with error message if query fails
                    } else if (results.length === 0) {
                        resolve(null);  // No user found, resolve with null
                    } else {
                        console.log(results);
                        resolve(results);  // Resolve with the first user (since emails should be unique)
                    }
                });
            });
            // Return the result (user data) if found, or null if not found
            return response;
        } catch (error) {
            // Log any error that occurs during the process
            console.log(error);
            throw new Error('Error fetching data');
        }
    }


};

module.exports = DbService;