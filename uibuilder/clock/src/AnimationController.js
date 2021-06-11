// Start of AnimationController "class"
function AnimationController(wndhnd) {
    this._callbacks = [];
    this.tick();
}

// Start of AnimationController "class"
AnimationController.prototype.tick = function() {
    // run all registed callbacks
    for (const cb of this._callbacks) {
        cb[0].call(cb[1]);
    }
    window.requestAnimationFrame(this.tick.bind(this));
};

AnimationController.prototype.register = function(callback, this1) {
    this._callbacks.push([callback, this1]);
};
// End of AnimationController class