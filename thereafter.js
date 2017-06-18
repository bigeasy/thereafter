// Node.js API.
var assert = require('assert')

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
    this._waiting = []
}

Thereafter.prototype.cancel = function () {
    this.canceled = true
    if (this._waiting.length) {
        this._waiting[0].unlatch()
    }
}

Thereafter.prototype.run = function () {
    if (this.canceled) {
        return
    }

    var thereafter = this

    var vargs = Array.prototype.slice.call(arguments)
    var operation = new Operation(vargs)
    var previous = this.ready
    var ready = this.ready = new Signal

    thereafter._waiting.push(ready)

    ready.wait(function () {
        assert(thereafter._waiting[0] === ready)
        thereafter._waiting.shift()
    })

    previous.wait(function () {
        if (thereafter.canceled) {
            ready.unlatch()
        } else {
            operation.apply(null, [ ready ].concat(vargs))
        }
    })
}

module.exports = Thereafter
