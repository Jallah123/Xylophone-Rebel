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
    initialize: function() {
        alert('initialize');
        this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
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
        alert("location is set");
    },
    getCurrentLocation: function() {
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, {timeout: 15000});
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        alert("Device ready");
        app.getCurrentLocation();
    }
};
