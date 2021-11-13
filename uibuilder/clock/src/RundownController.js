// Start of RundownController "class"
function RundownController(fe, animCnt) {
    this._fe = fe;              // Vue app
    this._animCnt = animCnt;    // animation controller
    this._rd = [];              // the full rundown object
    this._activeIndex = -1;     // the current active cue
    this._animCnt.register(this.timer, this); // Register callback on animation controller
}

RundownController.prototype.updateRundown = function(newRundown) {
    this._rd = newRundown;
    //console.debug("Full rundown was updated", this._rd);
};

RundownController.prototype.timer = function() {
    let now = this._fe.trueTS;
    let index = this._rd.findIndex(el => {
        if (el["Timer-End-Time"] + el["Negative-Overrun"] > now) { return true } else { return false }
    });
    if (index >= 0) {
        this._activeIndex = index;
        this._fe.rundown.activeCue = this._rd[index];
    } else {
        this._activeIndex = -1;
        this._fe.rundown.activeCue = null;
    }
    // calulcate and format time here
    if (this._activeIndex >= 0) {
        let remaining = this._fe.rundown.activeCue["Timer-End-Time"] - now;
        
        // calculate seconds left
        let raws = remaining / 1000;
        let urs = Math.abs(raws % 60);
        let rs = Math.abs(Math.ceil(raws) % 60);
        
        // calculate minutes left
        let m = Math.floor(Math.abs(Math.ceil(raws) / 60));
        
        // set seconds to the right value depending on what millis resolution is requested
        let s = this._fe.settings.MilliResolution > 0 ? urs.toFixed(this._fe.settings.MilliResolution) : rs;
        
        // clock should be red
        this._fe.countdownTimer.red = remaining < (this._fe.settings.MilliResolution > 0 ? -0.001 : -999) ? true : false;
        
        // pass to format function
        this._fe.countdownTimer.rendered = this.format(m, s);
    }
};

// Format the datestring even more depending on settings
RundownController.prototype.format = function(mm, ss) {
    if (this._fe.settings.ShowHours) {
        let h = Math.floor(mm / 60);
        return `${ this._fe.countdownTimer.red ? "-": ""}${h>0?h+":":""}${this.zeroPad(mm % 60)}:${this.zeroPad(ss)}`; 
    }
    return `${ this._fe.countdownTimer.red ? "-": ""}${this.zeroPad(mm)}:${this.zeroPad(ss)}`; 
};

// Zero pad numbers
RundownController.prototype.zeroPad = function(number) {
    return number < 10.0 ? "0" + number : number;
};
// End of RundownController class