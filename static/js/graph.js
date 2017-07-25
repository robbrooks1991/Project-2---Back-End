window.onload = function() {
queue()
    .defer(d3.json, "/goal_stats")
    .await(makeGraphs);

function makeGraphs(error, goalsJson) {
    var goal_stats = goalsJson;

    var dateFormat = d3.time.format("%d/%m/%Y");

    goal_stats.forEach(function (d) {
       d["date"] = dateFormat.parse(d["date"]);
       d["date"].setDate(1);
   });


//CREATE A CROSSFILTER INSTANCE
        var ndx = crossfilter(goal_stats);


//DEFINE THE DIMENSIONS WE WANT
        var time_of_goalDim = ndx.dimension(function (d) {
            return d["time_of_goal"]
        });

        var teamDim = ndx.dimension(function (d) {
            return d["team"]
        });

        var dateDim = ndx.dimension(function (d) {
            return d["date"]
        });

        var home_awayDim = ndx.dimension(function (d) {
            return d["home_away"]
        });

        var goal_scorersDim = ndx.dimension(function(d) {
            return d["scorer"]
        });

        var goals_month = dateDim.group().reduceSum(function (d) {
            return d["_id"]
        });




//CALCULATE METRICS AND GROUPS
        //var numGoalsByTeam = teamDim.group();
        var numGoalsByTimeOfGoal = time_of_goalDim.group();
        var teamGroup = teamDim.group();
        var numGoalshome_away = home_awayDim.group();

        var goal_scorers = goal_scorersDim.group();
        var max_goalscorer = goal_scorers.top(1)[0]["scorers"];

        var all = ndx.groupAll();
        var total_goals = ndx.groupAll().reduceSum(function (d) {
            return d["scorers"]
        })


//DEFINE VALUES TO BE USED
        var minDate = dateDim.bottom(1)[0]["date"];
        var maxDate = dateDim.top(1)[0]["date"];


//CHARTS
    var home_away = dc.lineChart("#line-chart-home-away");
    var time_of_goal_chart = dc.pieChart("#time_of_goal");
    var totalgoals = dc.numberDisplay("#numberofgoals");



//ACTUAL CHARTS AND THEIR CSS
        selectField = dc.selectMenu('#menu-select')
            .dimension(teamDim)
            .group(teamGroup);

        totalgoals
           .formatNumber(d3.format("d"))
           .valueAccessor(function (d) {
               return d;
           })
           .group(total_goals);

        home_away
            .width(500).height(200)
            .dimension(dateDim)
            .group(goals_month)
            .x(d3.time.scale().domain([minDate,maxDate]));


        time_of_goal_chart
           .height(220)
           .radius(90)
           .innerRadius(40)
           .transitionDuration(1500)
           .dimension(time_of_goalDim)
           .group(numGoalsByTimeOfGoal);


        dc.renderAll();
        }};
