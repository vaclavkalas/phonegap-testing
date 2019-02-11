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
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    takePhoto: function(){
        document.getElementById('message').innerHTML = 'click';
        navigator.camera.getPicture(app.photoOnSuccess, app.photoOnFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    },
    photoOnSuccess: function() {
        document.getElementById('message').innerHTML = 'img';
        var image = document.getElementById('myImage');
        image.src = imageURI;
    },
    photoOnFail: function(){
        document.getElementById('message').innerHTML = 'fail';
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.initCamera();
        //app.setupPush();
        app.addMessage(typeof navigator.camera);
        app.addMessage(typeof navigator.mediaDevices.getUserMedia);
        app.addMessage('take photo');
        document.getElementById('takePhoto').addEventListener('click', app.takePhoto);
        app.addMessage('after take photo');
        if (navigator.camera) {
            var parentElement = document.getElementById('camera');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }
        else {
            var parentElement = document.getElementById('camera');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:block;');
            receivedElement.setAttribute('style', 'display:none;');
        }
    },
    addMessage: function(msg){
        document.getElementById('message').innerHTML = document.getElementById('message').innerHTML +'<br />'+ msg;
    },
    clearMessage: function(){
        document.getElementById('message').innerHTML = '';
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    },
    initCamera: function(){
        navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': {
                facingMode: 'environment'
            }
        }).then(function(mediaStream) {
            app.addMessage('mediaOk');
            var video = document.getElementById('video');
            app.addMessage(mediaStream);
            video.srcObject = mediaStream;
            //video.src = URL.createObjectURL(mediaStream);
            //video.onloadedmetadata = function(e) {
                //video.play();
            //};
        })
            .catch(function(err) { app.addMessage(err.name + ": " + err.message); });
    }
};
