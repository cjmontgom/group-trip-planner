# WING

A group holiday planning app. Our final project at Makers Academy. 


### Technologies used

- Node
- Express server
- Nodemailer (for sending emails to users)
- SQL database
- Twilio (for texting users)
- Jest & Puppeteer (for testing)
- bcrypt (for encrypting user passwords)


### Start the app locally

```
# Clone the repo
git clone git@github.com:cjmontgom/group-trip-planner.git

# Go into the repo
cd group-trip-planner

# Install the dependencies
npm install

# Set up a local database 
psql -d postgres -U <your-username>
CREATE DATABASE planning;
CREATE TABLE trips (id SERIAL PRIMARY KEY, name VARCHAR(60), description VARCHAR, organiser INTEGER);
CREATE TABLE stages (id SERIAL PRIMARY KEY, name VARCHAR, content VARCHAR, due_date DATE, event_id INTEGER);
CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR, last_name VARCHAR, email VARCHAR, phone_number VARCHAR, password VARCHAR);
CREATE TABLE polls (id SERIAL PRIMARY KEY, type VARCHAR, options VARCHAR, deadline DATE, trip_id INTEGER REFERENCES trips (id), stage_id INTEGER REFERENCES stages (id));
create table trips_users (id SERIAL PRIMARY KEY, trip_id INTEGER REFERENCES trips (id), user_id INTEGER REFERENCES users (id));
CREATE TABLE stages_users (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users (id), stage_id INTEGER REFERENCES stages (id));
CREATE TABLE votes (id SERIAL PRIMARY KEY, trip_id INTEGER REFERENCES trips (id), poll_id INTEGER REFERENCES polls (id), user_id INTEGER REFERENCES users (id), option_id VARCHAR, stage_id INTEGER REFERENCES stages (id));
CREATE TABLE comments (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users (id), comment VARCHAR, date TIMESTAMP DEFAULT NOW(), announcement BOOL, trip_id INTEGER REFERENCES trips (id));

# Run app
node server.js

# Go to localhost:8000 to use the app

```
