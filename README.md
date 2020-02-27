URPC
====

An unopinionated RPC barebones framework

Usage:
==

```javascript
const urpc = require('urpc')
const service = urpc({
  '*': async (req, res) => {
    console.log('this gets evaluated before anything on this tree')
  },

  method1: async (req, res) => {
    if (req.params.issue) {
      res.ok = true
    } else {
      res.ok = false
    }
  },

  subtree: urpc(require('./another-file-with-req-res-pattern'))
})

service({method: 'subtree/submethod', params: { test: true } })
```

License
==

See LICENSE
