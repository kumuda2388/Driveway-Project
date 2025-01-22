The base URL / start point of the project website: http://localhost/Driveway_Project/frontend/index.html

All the backend files are present under backend folder of the project and front end files are present in frontend folder of the project.

App.js under backend folder has all calls to the backend server and dbservice.js has all the database queries queries details.

In the backend folder of the project run below commands to install all necessary packages:
npm init -y
npm install express mysql cors nodemon dotenv
npm install express-session
npm install bcrypt

Do the below changes in package.json file so that changes of the website are dynamically reflected.
"start": "nodemon app.js"
in package.json file

To start the server go to backend folder of this project in your terminal and run the following command:
npm start

Contributions:

I Kumuda Krishnappa and Nikila Choppa collaborated closely on this project, and here’s a summary of our contributions:

We jointly designed the necessary tables, determining what data was required and what could be excluded. 

While I handled the creation of submit requests, quotes, bills, and orders on the customer side and Nikila worked on the same features for the contractor side (David).

Both of us worked together on the queries for the dashboard and its overall creation.

Throughout the project, we coordinated effectively, discussing issues, troubleshooting challenges, and supporting each other whenever we encountered difficulties. If we were unable to resolve an issue on our own, we worked together to find a solution.

While we each focused on our individual tasks, we also collaborated on certain components and ensured that all parts of the project were integrated and functioning smoothly.
