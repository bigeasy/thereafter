// Control-flow utilities.
var cadence = require('cadence')

// Evented semaphore.
var Signal = require('signal')

// Contextualized callbacks and event handlers.
var Operation = require('operation/variadic')

function Thereafter () {
    this.ready = new Signal
    this.ready.unlatch()
    this.canceled = false
}

Thereafter.prototype.cancel = function () {
    this.canceled = true
}

Thereafter.prototype.run = function () {
    var vargs = Array.prototype.slice.call(arguments)
    var operation = new Operation(vargs)
    var previous = this.ready
    var ready = this.ready = new Signal
    var thereafter = this
    previous.wait(function () {
        if (!thereafter.canceled) {
            operation.apply(null, [ ready ].concat(vargs))
        }
    })
}

module.exports = Thereafter
