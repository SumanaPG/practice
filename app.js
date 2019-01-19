var express = require('express');  
var app = new express();  
var port = 3000;  
app.listen(port, function(err) {  
    if (typeof(err) == "undefined") {  
        console.log('Your application is running on : ' + port + ' port');  
    }  
});  

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var cors = require('cors')
 
app.use(cors())

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}




var fs = require('fs');
var path = require('path');
var matchesPath = path.join(__dirname, 'matches.csv');
var deliveriesPath = path.join(__dirname, 'deliveries.csv');

var matchData = fs.readFileSync(matchesPath, {
    encoding: 'utf-8'
});

matchData = matchData.split("\n");
headers = matchData.shift().split(",");
headers.splice(headers.length - 1, 1);
var matchArr = [];

//Get matches from csv
matchData.forEach(function (d) {
    tmp = {};
    row = d.split(",");
    for (var i = 0; i < headers.length; i++) {
        tmp[headers[i]] = row[i];
    }
    matchArr.push(tmp);
});

var deliveriesData = fs.readFileSync(deliveriesPath, {
    encoding: 'utf-8'
});

//Get deliveries from csv
deliveriesData = deliveriesData.split("\n");
headers = deliveriesData.shift().split(",");
headers.splice(headers.length - 1, 1);
var deliveriesArr = [];

deliveriesData.forEach(function (d) {
    tmp = {};
    row = d.split(",");
    for (var i = 0; i < headers.length; i++) {
        tmp[headers[i]] = row[i];
    }
    deliveriesArr.push(tmp);
});

// Problem 1 - 
var seasons = [];
matchArr.forEach(a => seasons.push(a['season']));

var seasonsCount = [];
var seasonobj = {};
Year = [];
countmatch = [];
//seasons.forEach(function (i) { seasonsCount[i] = (seasonsCount[i] || 0) + 1; });
for (var i = 0; i < seasons.length; i = i + count) {
    count = 1;
   
        for (var j = i + 1; j < seasons.length; j++) {
            if (seasons[i] === seasons[j])
                count++;
        }
        
        if (seasons[i] != undefined) 
		{
			seasonsCount.push(seasons[i] + ":" + count);
			Year.push(seasons[i])
			countmatch.push(count);
		}

        seasonobj.name = Year;
        seasonobj.matchescount = countmatch;    
}


// Problem 2
var winners = [];
matchArr.forEach(a => winners.push(a['winner'] + ":" + a['season']));

var res = [];
var yearwins = [];

for (var s = 0; s < seasonsCount.length; s++) {
    var year = seasonsCount[s].toString().split(':')[0];
    var wins = winners.filter(w => w.toString().split(':')[1] === year);
    //var sortedWinners = wins.filter(w => w.toString().split(':')[0]);
    var sortedWinners = [];
    for (var i = 0; i < wins.length; i++) {
        sortedWinners.push(wins[i].toString().split(':')[0]);
    }
    sortedWinners = sortedWinners.sort();

    for (var i = 0; i < sortedWinners.length; i = i + count) {
        count = 1;
        for (var j = i + 1; j < sortedWinners.length; j++) {
            if (sortedWinners[i] === sortedWinners[j])
                count++;
        }
        res.push(sortedWinners[i] + " : " + count);
		yearwins.push(year);
    }
}

var sortedTeams = [];
var uniqueArray = [];

for (var i = 0; i < res.length; i++) {
    sortedTeams.push(res[i].toString().split(':')[0]);
}
uniqueArray = sortedTeams.filter(function (elem, pos) {
    return sortedTeams.indexOf(elem) == pos;
})

var result = [];
var prob2obj = {};
var prob2data = [];
var prob2value = [];

for (var i = 0; i < uniqueArray.length; i++) {
    var count = 0;
    for (var j = 0; j < res.length; j++) {
        if (uniqueArray[i] == res[j].toString().split(':')[0]) {
            count = count + parseInt(res[j].toString().split(':')[1]);
        }
    }
    if (uniqueArray[i] != ' ') {
        result.push(uniqueArray[i] + ":" + count);
        prob2data.push(uniqueArray[i]);
        prob2value.push(count);
    }
}

prob2obj.data = prob2data;
prob2obj.value = prob2value;


//console.log(prob2obj);


// problem 3
var matches = [];
var teams = [];
for (var i = 0; i < matchArr.length; i++) {

    if (matchArr[i]['season'] === '2016') {
        matches.push(matchArr[i]['season'] + ":" + matchArr[i]['id']);
    }
}

var deliveries = [];
for (var i = 0; i < deliveriesArr.length; i++) {
    deliveries.push(deliveriesArr[i]['match_id'] + ":" + deliveriesArr[i]['bowling_team'] + ":" + deliveriesArr[i]['extra_runs']);
    teams.push(deliveriesArr[i]['bowling_team']);
}

var conceededTeams = [];
for (var i = 0; i < matches.length; i++) {
    var id = matches[i].toString().split(':')[1];
    for (var j = 0; j < deliveries.length; j++) {
        var match_id = deliveries[j].toString().split(':')[0];
        if (id === match_id && deliveries[j].toString().split(':')[2] > 0)
            conceededTeams.push(deliveries[j].toString().split(':')[1] + ":" + deliveries[j].toString().split(':')[2])
    }
}

var sortedTeams = teams.sort();
teamsCount = [];

for (var i = 0; i < sortedTeams.length; i = i + count) {
    count = 1;
    for (var j = i + 1; j < sortedTeams.length; j++) {
        if (sortedTeams[i] === sortedTeams[j])
            count++;
    }
    teamsCount.push(sortedTeams[i] + ":" + count);
}

var conceededTeamCount = [];
var prob3obj = {};
var prob3data = [];
var prob3val = [];

for(var item of teamsCount) {
    var count = 0;
    var team = item.toString().split(':')[0];

    for (var j = 0; j < conceededTeams.length; j++) {
        if (team.trim() === conceededTeams[j].toString().split(':')[0].trim()) {
            count = count + parseInt(conceededTeams[j].toString().split(':')[1]);
        }
    }
    if (team != 'undefined' && count>0)
    {
        conceededTeamCount.push(team + ":" + count);
        prob3data.push(team);
        prob3val.push(count);
    }
}

prob3obj.data = prob3data;
prob3obj.value = prob3val;



// Problem 4
var matches2015 = [];

for (var i = 0; i < matchArr.length; i++) {

    if (matchArr[i]['season'] === '2015') {
        matches2015.push(matchArr[i]['season'] + ":" + matchArr[i]['id']);
    }
}
//console.log(matches2015);

var deliveries2015 = [];
var bowlers = [];
for (var i = 0; i < deliveriesArr.length; i++) {
    deliveries2015.push(deliveriesArr[i]['match_id'] + ":" + deliveriesArr[i]['bowler'] + ":" + deliveriesArr[i]['total_runs']);
    bowlers.push(deliveriesArr[i]['bowler']);
}
//console.log(deliveries2015);

var conceededBowlers = [];
for (var i = 0; i < matches2015.length; i++) {
    var id = matches2015[i].toString().split(':')[1];
    for (var j = 0; j < deliveries2015.length; j++) {
        var match_id = deliveries2015[j].toString().split(':')[0];
        if (id === match_id)
            conceededBowlers.push(deliveries2015[j].toString().split(':')[1] + ":" + deliveries2015[j].toString().split(':')[2])
    }
}
//console.log(conceededBowlers);
var sortedBowlers = bowlers.sort();
bowlersCount = [];

for (var i = 0; i < sortedBowlers.length; i = i + count) {
    count = 1;
    for (var j = i + 1; j < sortedBowlers.length; j++) {
        if (sortedBowlers[i] === sortedBowlers[j])
            count++;
    }
    bowlersCount.push(sortedBowlers[i] + ":" + count);
}

var conceededRunsCount = [];
var allBowlers = [];
var distinctBowlers = [];
var prob4obj = {};
var prob4data = [];
var prob4value = [];
for(var item of bowlersCount) {
    var count = 0;
    var bowler = item.toString().split(':')[0];
    var overs = Math.round(item.toString().split(':')[1] / 6); // 6 balls an over
    for (var j = 0; j < conceededBowlers.length; j++) {
        if (bowler.trim() === conceededBowlers[j].toString().split(':')[0].trim()) {
            count = count + parseInt(conceededBowlers[j].toString().split(':')[1]);
        }
    }
    //allBowlers.push(bowler);
    if (Math.floor(count / overs) > 0)
    {
        conceededRunsCount.push(bowler + ":" + count + ":" + (count / overs));
        prob4data.push(bowler);
        prob4value.push(Math.floor(count / overs));
    }
}

prob4obj.data = prob4data;
prob4obj.value = prob4value;



app.get('/', function(req, res) {  
    res.send('<h1>Hello C# Corner.</h1>');  
});  
app.get('/articles', cors(), function(req, res) { 
    res.send(seasonobj);  
});  

app.get('/probtwo', cors(), function(req, res) { 
    res.send(prob2obj);  
});  

app.get('/probthree', cors(), function(req, res) { 
    res.send(prob3obj);  
}); 

app.get('/probfour', cors(), function(req, res) { 
    res.send(prob4obj);  
}); 













app.get('/problem1', cors(), function(req, res) { 
 
    res.render('problem1.html');  
}); 



