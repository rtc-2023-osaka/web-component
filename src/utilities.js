// Used for lightweight DOM parsing only
const html = str => (new DOMParser().parseFromString(str, 'text/html').body.children[0])

export {
  html,
}
