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

        var stadiumDim = ndx.dimension(function (d) {
            return d["location"]
        });

        var scorerDim = ndx.dimension(function (d) {
            return d["scorer"]
        });

//CALCULATE METRICS AND GROUPS
        var home_goals_month = dateDim.group().reduceSum(function (d) {
            return d["home_away"]
        });

        var numGoalsByTimeOfGoal = time_of_goalDim.group();

        var numGoalsByDate = dateDim.group();

        var numGoalsHomeAway = home_awayDim.group();

        var teamGroup = teamDim.group();

        var numStadiumGoals = stadiumDim.group();

        var group_by_scorer = scorerDim.group();
        var max_scorer = group_by_scorer.top(3);
            console.log(max_scorer[0].key);
            console.log(max_scorer[1].key);
            console.log(max_scorer[2].key);

        document.getElementById("topscorer").innerHTML = [
            (max_scorer[0].key)];
        document.getElementById("topscorer1").innerHTML = [
            (max_scorer[1].key)];
        document.getElementById("topscorer2").innerHTML = [
            (max_scorer[2].key)];


        //var all = ndx.groupAll();
        //console.log(all);

//DEFINE VALUES TO BE USED
        var minDate = dateDim.bottom(1)[0]["date"];
        var maxDate = dateDim.top(1)[0]["date"];

        console.log(minDate);
        console.log(maxDate);

//CHARTS
    var stadium_goals = dc.barChart("#stadium_goals");
    var goals_month = dc.lineChart("#goals_month");
    var time_of_goal_chart = dc.pieChart("#time_of_goal");
    var GoalsHomeAwayND = dc.rowChart('#goals_home_away');
    //var top_goal_scorers = dc.numberDisplay('#topgoalscorer');
    //var topgoalscorer = dc.rowChart('#topscorer');


//ACTUAL CHARTS AND THEIR CSS

        /*top_goal_scorers
            .valueAccessor(function (d) {
                return d;
            })
            .group(max_scorer[0].key);*/

         selectField = dc.selectMenu('#menu-select')
            .dimension(teamDim)
            .group(teamGroup);

        stadium_goals
            .width(800)
            .height(200)
            .margins({top: 10, right: 50, bottom: 30, left:50})
            //.brushOn(false)
            .x(d3.scale.linear())
            .dimension(stadiumDim)
            .group(numStadiumGoals)
            .elasticY(true)
            .xAxisLabel("Stadium")
            .yAxisLabel("Number of Goals")
            .x(d3.scale.ordinal())
            .yAxis().ticks(4);

        goals_month
            .width(800)
            .height(200)
            .margins({top: 10, right: 50, bottom: 30, left:50})
            .dimension(dateDim)
            .group(numGoalsByDate)
            .stack(home_goals_month)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .elasticY(true)
            .renderArea(true)
            .xAxisLabel("Months")
            .yAxisLabel("Number of Goals")
            .yAxis().ticks(4);

        time_of_goal_chart
            .height(400)
            .radius(90)
            .innerRadius(40)
            .externalLabels(30)
            //.drawPaths(true)
            //.externalRadiusPadding(50)
            .transitionDuration(1500)
            .dimension(time_of_goalDim)
            .group(numGoalsByTimeOfGoal)
            .legend(dc.legend());

        GoalsHomeAwayND
            .width(500)
            .height(250)
            .elasticX(true)
            .dimension(home_awayDim)
            .group(numGoalsHomeAway);

        /*topgoalscorer
           .width(300)
           .height(250)
           .dimension(top_scorerDim)
           .group(goal_scorers)
           .xAxis().ticks(4);*/

        dc.renderAll();
        }}
