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
var app = {
    // Application Constructor
    shownVenues: undefined,
    currentDetailVenue: undefined,

    initialize: function() {
        this.bindEvents();
        $('#listview').delegate('li', 'tap', function () {
            event.preventDefault();
            var index = $(this).index();
            app.currentDetailVenue = shownVenues[index];
            eetNu.getReviewsByVenueId(shownVenues[index]);
        });
    },
    bindEvents: function() {
        var self = this;

        console.log('bindEvents');
        document.addEventListener('deviceready', self.onDeviceReady, false);
    },
    onError: function(error) {
        alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    },
    onSuccess: function(position) {
        window.localStorage.setItem("location", JSON.stringify(position));
        eetNu.getLocalVenues();
    },
    getCurrentLocation: function() {
        var interval = setInterval(function(){
            $.mobile.loading('show');
            clearInterval(interval);
        },1); 
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, {timeout: 15000});
    },
    onDeviceReady: function() {
        alert("Device ready");
        app.getCurrentLocation();
    },
    addNewVenues: function(venues) {
        alert("WTFF");
        content = "";
        shownVenues = venues;
        for(var i = 0; i < venues.length; i++) {
            content += "<li data-id='" + venues[i].id + "'>" + venues[i].name + "</li>";
        }
        alert(content);
        $("#listview").html(content);
        $("#listview").listview("refresh");
    },
    fillDetail: function(venue) {
        alert("fill yo mamma up");
        alert(venue);
        alert(this.currentDetailVenue);
        alert(this.currentDetailVenue.name);
        $("#detail").find("#title").text(currentDetailVenue.name);
        $("#detail").find("#food").text(venue.results[0].scores.food);

        location.hash = "detail";
    }
};
