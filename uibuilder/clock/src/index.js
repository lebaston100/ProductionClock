/* jshint browser: true, asi: true */
/* globals Vue, uibuilder, RTC, RundownController, AnimationController, URLSearchParams */
// @ts-nocheck
// eslint-disable-next-line no-unused-vars
'use strict'

// Vue-hu it's a vue.js app
const app = new Vue({
    el: '#app',

    data() { return {
        rtc: {
            clock: null,
            refTimestamp: 0,
            rendered: "",
            isVisible: true
        },
        
        countdownTimer: {
            ts: 0,
            rendered: "",
            message: "No Timer Active",
            red: false
        },
        
        rundown: {
            rundown: null,
            fullRundown: [],
            activeCue: null
        },
        
        animCnt: null,
        trueTS: 0,
        settings: {
            urlParams: new URLSearchParams(window.location.search),
            tzOffset: 0,
            MilliResolution: 0,
            RealTimeOffset: 0,
            ShowHours: false
        }
    }},

    computed: {
    }, // --- End of computed --- //

    methods: {
        nodeRedMessageHandler: function(msg) {
            //console.debug("msg received from node-red:", msg)
            if (msg.topic == "settings/rundown") {
                this.rundown.fullRundown = msg.payload;
            } else if (msg.topic == "settings/settings") {
                this.settings.tzOffset = parseInt(msg.payload.TimeZoneOffset)*3600000||0;
                this.settings.MilliResolution = parseInt(msg.payload.MilliResolution)||0;
                this.settings.RealTimeOffset = parseInt(msg.payload.RealTimeOffset)||0;
                this.settings.ShowHours = msg.payload.ShowHours === "Yes" ? true : false;
            } else if (msg.topic == "settings/rtcRefTs") {
                this.rtc.refTimestamp = msg.payload.ts;
            } else {
                console.error("unhandled msg received from node-red:", msg)
            }
        },
        
        toggleFullscreen: function() {
            if (document.fullscreenEnabled && !document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.fullscreenEnabled && document.exitFullscreen();
            }
        },
        
        sendInitalContact: function() {
            uibuilder.send({
                topic: "initialContact",
                payload: {
                    clockID: this.settings.urlParams.get("id")||1,
                }
            });
        }
    }, // --- End of methods --- //
    
    watch: {
        "rtc.refTimestamp": function() {
            this.rtc.clock.update();
        },
        "rundown.fullRundown": function(frd) {
            this.rundown.rundown.updateRundown(frd);
        },
        "rundown.activeCue": function(nac) {
            if (nac) {
                this.rtc.isVisible = nac["Show-Current-Time"];      // Update realtime clock visibility
                this.countdownTimer.message = nac["Timer-Text"];    // Update text message
            } else {
                this.rtc.isVisible = true;                          // Update realtime clock visibility
                this.countdownTimer.message = "No Timer Active";    // Update text message
                this.countdownTimer.rendered = "";                  // Don't show any timer
            }
        }
    }, // --- End of watch --- //

    /** Called after the Vue app has been created. A good place to put startup code */
    created: function() {
        uibuilder.start(this);
        
        this.settings.urlParams.get("id")||1
        
        // Init animationController class
        this.animCnt = new AnimationController();
        
        // Init realtime clock class
        this.rtc.clock = new RTC(this, this.animCnt);
        
        // Init Rundown class
        this.rundown.rundown = new RundownController(this, this.animCnt);
    }, // --- End of created hook --- //

    /** Called once all Vue component instances have been loaded and the virtual DOM built */
    mounted: function() {
        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        uibuilder.onChange('msg', function(msg) {
            app.nodeRedMessageHandler(msg);
        })
        
        /** If Socket.IO connects/disconnects, we get true/false here */
        uibuilder.onChange('ioConnected', function(connected) {
            if (connected) app.sendInitalContact();
        })

        this.rtc.clock.start();     // Start clock
    }, // --- End of mounted hook --- //

}) // --- End of app --- //