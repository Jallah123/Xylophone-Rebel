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

 var app = function(){
    var self = this;
    var shownVenues = undefined;
    var currentDetailVenue = undefined;
    var eetNu = undefined;

    self.initialize = function(eetNu) {
        alert("initializing");
        self.eetNu = eetNu;
        bindEvents();
        $('#listview').delegate('li', 'tap', function () {
            alert("tap delegate");
            event.preventDefault();
            var index = $(this).index();
            currentDetailVenue = shownVenues[index];
            eetNu.getReviewsByVenueId(shownVenues[index]);
        });
    };
    bindEvents = function() {
        console.log('bindEvents');
        document.addEventListener('deviceready', onDeviceReady, false);
    };
    onError = function(error) {
        alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    };
    onSuccess = function(position) {
        window.localStorage.setItem("location", JSON.stringify(position));
        eetNu.getLocalVenues();
    };
    getCurrentLocation = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show');
            clearInterval(interval);
        },1); 
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 15000});
    };
    onDeviceReady = function() {
        alert("Device ready");
        getCurrentLocation();
    };
    self.addNewVenues = function(venues) {
        alert("WTFF");
        content = "";
        shownVenues = venues;
        for(var i = 0; i < venues.length; i++) {
            content += "<li data-id='" + venues[i].id + "'>" + venues[i].name + "</li>";
        }
        alert(content);
        $("#listview").html(content);
        $("#listview").listview("refresh");
    };
    self.fillDetail = function(venue) {
        alert("fill yo mamma up");
        console.log(self.currentDetailVenue);
        $("#detail").find("#title").text(currentDetailVenue.name);
        if(venue.results.length > 0){
            var averages = calculateAverageScore(venue.results);
            $("#detail").find("#food").text(averages['food']);
            $("#detail").find("#ambiance").text(averages['ambiance']);
            $("#detail").find("#service").text(averages['service']);
            $("#detail").find("#value").text(averages['value']);
        }

        location.hash = "detail";     
    };

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
        return array;
    };

    return self;
};