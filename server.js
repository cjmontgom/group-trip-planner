const express =       require("express");
const app =           express();
const bodyParser =    require("body-parser");
const port =          8000;
const path =          require("path");
const trips =         require("./routes/trips.js");
const polls =         require("./routes/polls.js");
const users =         require("./routes/users.js");
const comments =      require("./routes/comments.js");
const tripsUsers =    require("./routes/tripsUsers.js");
const sendEmail =     require("./routes/sendEmail.js");
var cookieParser =    require("cookie-parser");
const stages =        require("./routes/stages.js");

const dotenv = require("dotenv");
dotenv.config();

app.use(cookieParser());
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "index.html"));
});

app.use("/trips", trips);
app.use("/polls", polls);
app.use("/users", users);
app.use("/stages", stages);
app.use("/trips_users", tripsUsers);
app.use("/send-email", sendEmail);
app.use("/comments", comments);

app.use(function(req, res, next) {
    if (!req.cookies.user){
      res.redirect('/?fromUrl=' +req.originalUrl);
    } else {
      next()
    }
});

app.get('/guests', (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "guests.html"));
});

app.get("/trip_home", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "tripHome.html"))
});

app.get('/create_poll', (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "polls.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "about.html"));
});

app.get("/newTrip", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "newTrip.html"));
});

app.get("/whoami", (req, res) => {
    res.send(req.cookies.user)
});

app.get("/logout", (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

app.listen(port, () => console.log(`Planning app listening here: ${port}!`));
