/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 var app = function() {
    var self = this;
    var shownVenues = undefined;
    var currentDetailVenue = undefined;
    var eetNu = undefined;
    var shakeEvent = undefined;
    var db = undefined;
    var settings = undefined;
    var panelOpen = false;
    var nextPage = undefined;

    self.initialize = function(eetNu) {
        createDb();
        myShakeEvent = new Shake({
            threshold: 15 // optional shake strength threshold
        });
        myShakeEvent.start();
        self.eetNu = eetNu;
        bindEvents();
        $(".footer_text").text("Door Mij");
        $('#listview').delegate('li', 'tap', function () {
            var index = $(this).index();
            currentDetailVenue = shownVenues[index];
            eetNu.getReviewsByVenueId(shownVenues[index]);
        });
        $("#settings").find("#savesettings").on('click', function(){
            saveSettings();
        });
        $('#listview').delegate('li', 'swipeleft', function () {
            var index = $(this).index();
            currentDetailVenue = shownVenues[index];
            eetNu.getReviewsByVenueId(shownVenues[index]);
        });
        $("#detail").on("swiperight", function(e){
            if($(document).width() <= 720){
                $.mobile.changePage("#main");
            }
        });
        $("#main").on('touchmove', function(e){
            if($(window).scrollTop() == ($(document).height() - $(window).height())){
                if($(document).width() <= 720){
                    loadNewVenues();
                }
            }
        });
    };
    loadNewVenues = function(){
        self.eetNu.execRequest(self.nextPage, function(data){
            self.setNextPage(data.pagination.next_page);
            self.addNewVenues(data.results);
        });
    };
    createDb = function() {
        //alert("creating");
        db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id unique, max_distance)');
            tx.executeSql('INSERT INTO settings (id, max_distance) VALUES (1, 5)');
        });
    };
    self.getMaxDistance = function(onSuccess){
        db.transaction(function (tx) {
            tx.executeSql('SELECT "max_distance" FROM settings', [], onSuccess, dbError);
        });
    };
    saveSettings = function() {
        db.transaction(function (tx) {
            tx.executeSql('UPDATE settings SET max_distance=' + $("#max_distance").val() + ' WHERE id=1');
        });
        $("#settings").find("#message").text("Max distance saved.");
    };
    dbError = function (err) {
        console.log(err.code);
    };
    bindEvents = function() {
        console.log('bindEvents');
        document.addEventListener('deviceready', onDeviceReady, false);
        window.addEventListener('shake', shakeEventDidOccur, false);
    };
    shakeEventDidOccur = function() {
        if(panelOpen){
            $("#settings").panel("close");
            panelOpen = false;
            $("#settings").find("#message").text("");
        }else{
            $("#settings").panel("open");
            panelOpen = true;
        }
    };
    onError = function(error) {
        alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    };
    onSuccess = function(position) {
        window.localStorage.setItem("location", JSON.stringify(position));
        self.eetNu.getLocalVenues();
    };
    getCurrentLocation = function() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 15000});
    };
    onPause = function(){
        if($("#settings").find("#max_distance").val() != ""){
            window.localStorage.setItem("tempDistance", $("#settings").find("#max_distance").val());
        }
    };
    onDeviceReady = function() {

        var interval = setInterval(function(){
            $.mobile.loading('show');
            clearInterval(interval);
        },1); 

        document.addEventListener("pause", onPause, false);
        var tempDistance = window.localStorage.getItem("tempDistance");
        if(tempDistance != ""){
            $("#settings").find("#max_distance").text(tempDistance);
        }
        getCurrentLocation();
    };

    self.openExternal = function() {
        event.preventDefault();
        window.open($("#website_url").attr('href'), '_system', 'location=yes');
        return false;
    };
    self.openFacebook = function() {
        event.preventDefault();
        window.open($("#facebook_url").attr('href'), '_system', 'location=yes');
        return false;
    };
    self.openTwitter = function() {
        event.preventDefault();
        window.open($("#twitter_url").attr('href'), '_system', 'location=yes');
        return false;
    };

    self.addNewVenues = function(venues) {
        content = "";
        if(shownVenues != undefined){
            shownVenues = shownVenues.concat(venues);
        }else{
            shownVenues = venues;
        }
        for(var i = 0; i < venues.length; i++) {
            content += "<li data-id='" + venues[i].id + "'>" + venues[i].name + "</li>";
        }
        $("#listview").append(content);
        $("#listview").listview("refresh");
    };
    self.fillDetail = function(reviews) {
        var location = JSON.parse(window.localStorage.getItem("location"));
        $("#detail").find("#image").attr("src", "");
        $("#detail").find("#title").text(currentDetailVenue.name);
        $("#detail").find("#numberReviews").text(reviews.results.length);

        setReviews(reviews);

        if(currentDetailVenue.images.original.length > 0) {
            $("#detail").find("#image").attr("src", currentDetailVenue.images.original[0]);
        }
        $("#detail").find("#contact").html("Contact " + "Telephone: <a href='tel:" + currentDetailVenue.telephone +"'>" + currentDetailVenue.telephone  +  "</a> Website: <a id='website_url' href='" + currentDetailVenue.website_url + "' onclick='return app.openExternal();' target='_system'>" + currentDetailVenue.website_url + "</a>");
        $("#detail").find("#navbutton").attr("onclick","window.open('https://www.google.com/maps/dir/"+ location.coords.latitude + "," + location.coords.longitude +"/" + currentDetailVenue.address.street.replace(" ", "+") + "+" + currentDetailVenue.address.zipcode.replace(" ", "+") + "', '_system', 'location=yes')");
        $("#detail").find("#facebook").html("<a id='facebook-url' href='" + currentDetailVenue.facebook + "' onclick='return app.openFacebook();' target='_system'>Facebook</a>");
        $("#detail").find("#twitter").html("<a id='twitter-url' href='" + currentDetailVenue.twitter + "' onclick='return app.openTwitter();' target='_system'>Twitter</a>");

        //BUILDED WIDTH
        if($(document).width() <= 720){
        //DEV APP WIDTH
        //if($(document).width() <= 540){
            $.mobile.changePage("#detail");
        }
    };

    function setReviews(reviews){
        if(reviews.results.length > 0)
        {
            var averages = calculateAverageScore(reviews.results);
        }   
        if(averages != undefined){
            $("#detail").find("#food").text(((isNaN(averages['food'])) ? "0" : averages['food']));
            $("#detail").find("#ambiance").text(((isNaN(averages['ambiance'])) ? "0" : averages['ambiance']));
            $("#detail").find("#service").text(((isNaN(averages['service'])) ? "0" : averages['service']));
            $("#detail").find("#value").text(((isNaN(averages['value'])) ? "0" : averages['value']));
        }else{
            $("#detail").find("#food").text(0);
            $("#detail").find("#ambiance").text(0);
            $("#detail").find("#service").text(0);
            $("#detail").find("#value").text(0);
        }
    };
    self.setNextPage = function(next_page){
        this.nextPage = next_page;
    }
    calculateAverageScore = function(reviews) {
        var averageFood = 0;
        var averageAmbiance = 0;
        var averageService = 0;
        var averageValue = 0;

        var foodCount = 0;
        var ambianceCount = 0;
        var serviceCount = 0;
        var valueCount = 0;

        for(var i = 0; i < reviews.length; i++){
            if(reviews[i].scores.food != null){
                averageFood += reviews[i].scores.food;
                foodCount++;
            }
            if(reviews[i].scores.ambiance != null){
                averageAmbiance += reviews[i].scores.ambiance;
                ambianceCount++;
            }
            if(reviews[i].scores.service != null){
                averageService += reviews[i].scores.service;
                serviceCount++;
            }
            if(reviews[i].scores.value != null){
                averageValue += reviews[i].scores.value;
                valueCount++;
            }
        }

        var array = new Array();
        array['food'] = Math.round((averageFood / foodCount));
        array['ambiance'] = Math.round((averageAmbiance / ambianceCount));
        array['service'] = Math.round((averageService / serviceCount));
        array['value'] = Math.round((averageValue / valueCount));

        if(foodCount == 0){
            array['food'] = "No food reviews yet.";
        }
        if(ambianceCount == 0){
            array['ambiance'] = "No ambiance reviews yet.";
        }
        if(serviceCount == 0){
            array['service'] = "No service reviews yet.";
        }
        if(valueCount == 0){
            array['value'] = "No value reviews yet.";
        }
        return array;
    };

    return self;
};