const express = require('express'); 
const app = express();
const port = 3000;

let url = "mongodb://localhost:27017/budget"
const mongoose = require("mongoose"); 
const chart = require('./model/chart');
mongoose.set('useCreateIndex', true); 

const model = require("/model/chart"); 

app.use(cors());

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to the database."); 
        chart.find({})
            .then((data) => {
                console.log(data); 
                res.json(data); 
                mongoose.connection.close(); 
            })
            .catch((connectionError) => {
                console.log(connectionError)
            }); 
    })
    .catch((connectionError) => {
        console.log(connectionError); 
    }); 
}); 

app.post("/add", (req, res) => {
    console.log(req.query); 
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to the database."); 
            let budgetData = new chart(req.query); 
            budgetData.validateSync();
            if(budgetData.errors !== undefined){
                let error =[]; 
                for(let prop in budgetData.errors){
                    error.push(budgetData.error[prop].properties.message); 
                }

                res.json({
                    "ok": 0, 
                    "error": error
                }); 

                mongoose.connection.close();
                return; 
            }
            chart.deleteOne({"title": budgetData.title})
                .catch((connectionError) => {
                    console.log(connectionError);
                });
            chart.updateOne({"title": budgetData.title }, budgetData, {"upsert": true})
                .then((data) => {
                    console.log(data); 
                    res.json(data); 
                    mongoose.connection.close(); 
                })
                .catch((connectionError) => {
                    console.log(connectionError);
                });
            })
            .catch((connectionError) => {
                console.log(connectionError); 
            });  

})


/*
    const budget = require('./exercise.json');
    res.json(budget);
});
*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});