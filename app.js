const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Plan = require('./models/plan')

mongoose.connect('mongodb://localhost:27017/plan-ahead', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/plans', async (req, res) => {
    const plans = await Plan.find({});
    res.render('plans/index', { plans });
});
app.get('/plans/new', (req, res) => {
    res.render('plans/new');
});
app.post('/plans', async (req, res) => {
    const plan = new Plan(req.body.plan);
    await plan.save();
    res.redirect(`/plans/${plan._id}`)
})
app.get('/plans/:id', async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render('plans/show', { plan });
});




app.listen(3000, () => {
    console.log('Serving on port 3000')
})