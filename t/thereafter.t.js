require('proof')(2, prove)

function prove (assert, callback) {
    var Thereafter = require('..')
    var thereafter = new Thereafter

    thereafter.run(function (ready, callback) {
        setImmediate(function () {
            ready.unlatch()
            callback(null, 1)
        })
    }, function (error, result) {
        assert(result, 1, 'finished')
        callback()
    })

    thereafter.run(function (ready, value)  {
        thereafter.cancel()
        assert(value, 1, 'parameters')
        ready.unlatch()
    }, 1)

    thereafter.run(function (ready, value, callback)  {
        throw new Error
    })
}
