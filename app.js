const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const { planSchema, daySchema } = require('./schemas');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
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

const validatePlan = (req, res, next) => {
    const { error } = planSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

const validateDay = (req, res, next) => {
    const { error } = daySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/plans', wrapAsync(async (req, res) => {
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

}));

app.get('/plans/new', (req, res) => {
    res.render('plans/new');
});

app.post('/plans', validatePlan, wrapAsync(async (req, res, next) => {
    const plan = new Plan(req.body.plan);
    await plan.save();
    res.redirect(`/plans/${plan._id}`)

}));

app.get('/plans/:id', wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render('plans/show', { plan });
}));

app.get('/plans/:id/edit', wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render('plans/edit', { plan });
}));

app.put('/plans/:id', validatePlan, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    res.redirect(`/plans/${plan._id}`);
}));

app.delete('/plans/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.redirect('/plans');
}));

app.post('/plans/:id/days', validateDay, wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    const day = req.body.day;
    plan.days.push(day);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

app.delete('/plans/:id/days/:dayId', wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    plan.days.splice(req.params.dayId, 1);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { message });
    //res.send('Oh boy, something went wrong!')
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})