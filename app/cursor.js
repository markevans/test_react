import i from "immutable"

// "edgar.users" -> ['edgar', 'users']
let normalizePath = (path) => {
  let pathArray = []
  if (path.forEach) { // array
    path.forEach((p) => {
      pathArray = pathArray.concat(normalizePath(p))
    })
  } else { // string/number
    pathArray = pathArray.concat((''+path).split('.'))
  }
  return pathArray
}

class Cursor {
  constructor (path=[], getData, setData) {
    this.path = normalizePath(path)
    this.getData = getData
    this.setData = setData
  }

  at (...path) {
    return new this.constructor(
      this.path.concat(path),
      this.getData,
      this.setData
    )
  }

  get (...path) {
    return this.getData().getIn(normalizePath(this.path.concat(path)))
  }

  map (callback) {
    return this.get().map( (item, i) => {
      return callback(this.at(i), i)
    })
  }

  update (...args) {
    let pathToAttr, value
    if (args.length == 2) { // update(attr, value)
      pathToAttr = this.path.concat([args[0]])
      value = args[1]
    } else { // update(value)
      pathToAttr = this.path
      value = args[0]
    }

    let newValue,
      data = this.getData()
    if (typeof value === 'function') {
      this.setData(data.updateIn(pathToAttr, value))
    } else {
      this.setData(data.updateIn(pathToAttr, () => value))
    }

  }
}

global.Cursor = Cursor

export default Cursor
