const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Plan = require('./models/plan')

mongoose.connect('mongodb://localhost:27017/plan-ahead', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('strictQuery', true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/plans', async (req, res) => {
    const { country } = req.query;

    if (country) {
        const plans = await Plan.find({ "location": { $regex: new RegExp(country, "i") } });
        let countryString = country.toString();
        res.render('plans/index', { plans, country: countryString.charAt(0).toUpperCase() + countryString.substring(1) });
    }
    else {
        const plans = await Plan.find({});
        res.render('plans/index', { plans, country: 'all countries' });
    }

});

app.get('/plans/new', (req, res) => {
    res.render('plans/new');
});

app.post('/plans', async (req, res) => {
    const plan = new Plan(req.body.plan);
    await plan.save();
    res.redirect(`/plans/${plan._id}`)
});

app.get('/plans/:id', async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render('plans/show', { plan });
});

app.get('/plans/:id/edit', async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render('plans/edit', { plan });
});

app.put('/plans/:id', async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    res.redirect(`/plans/${plan._id}`);
});

app.delete('/plans/:id', async (req, res) => {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.redirect('/plans');
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})