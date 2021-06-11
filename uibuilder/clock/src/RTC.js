// Start of RTC "class"
function RTC(fe, animCnt) {
    this._fe = fe;           // Vue app
    this._animCnt = animCnt;
    this._active = false;
    this._localClock = 0;
}

// Save when sync ts was updates last for offset calculation
RTC.prototype.update = function() {
    this._localClock = Date.now();
};

// Tick the clock
RTC.prototype.tick = function() {
    // Calculate Time from server offset
    let offset = Date.now() - this._localClock;
    this._fe.trueTS = offset + this._fe.rtc.refTimestamp + this._fe.settings.tzOffset + this._fe.settings.RealTimeOffset;
    if (this._fe.rtc.isVisible) this._fe.rtc.rendered = this.format(new Date(this._fe.trueTS));
};

// Format to human readable Time
RTC.prototype.format = function(dt) {
    return `${dt.getUTCHours()}:${this.pad(dt.getUTCMinutes())}:${this.pad(dt.getUTCSeconds())}`;
};

// Zero-Pad values
RTC.prototype.pad = function(n) {
    return n < 10 ? "0"+n : n;
};

// Start the timer
RTC.prototype.start = function() {
    this._animCnt.register(this.tick, this);
};
// End of RTC class