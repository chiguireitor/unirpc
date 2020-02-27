
function Rpc(ob) {
  let middlewared = {}

  for (let x in ob) {
    middlewared[x] = [ob[x]]
  }

  async function call(method, req, res) {
    let routines = middlewared[method]
    for (let i=0; i < routines.length; i++) {
      await routines[i](req, res)
    }
  }

  async function route(req, res) {
    if (!req.method || req.method.length === 0) {
      throw new Error('No method specified')
    }

    if (!Array.isArray(req.method)) {
      req._path = req.method
      req.method = req.method.split('/')
    }

    if ('*' in middlewared) {
      await call('*', req, res)
    }

    let method = req.method.shift()

    if (method && method in middlewared) {
      await call(method, req, res)
    } else {
      throw new Error(`Method ${method} not found in path ${req._path}`)
    }
  }

  route.after = (method, rpc) => {
    if (method in middlewared) {
      middlewared[method].push(rpc)
    }
  }

  route.before = (method, rpc) => {
    if (method in middlewared) {
      middlewared[method].unshift(rpc)
    }
  }

  return route
}

module.exports = Rpc
