class CameraBasicElement extends HTMLElement {
  constructor() {
    super()

    this.width = 1280
    this.height = 960

    this.shadow = this.attachShadow({ mode: 'open' })

    this.div = document.createElement('div')

    this.video = document.createElement('video')

    this.video.setAttribute('autoplay', '')
    this.video.setAttribute('muted', '')
    this.video.setAttribute('playsinline', '')
    this.stream = null

    const style = document.createElement('style')
    style.textContent = `
        :host {
          --object-fit: cover;
        }
        div.show {
            display: grid;
            padding: 0px;
            margin: 0px;
            overflow: hidden;
            min-width: 100%;
            min-height: 100%;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
        }

        div.hide {
            display: none;
        }

        video {
            grid-area: 1 / 1 / 2 / 2;
            min-width: 100%;
            min-height: 100%;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
            object-fit: var(--object-fit);
            justify-self: center;
            align-self: center;
          }
        `

    this.div.classList.add('hide')

    this.div.appendChild(this.video)
    this.shadow.appendChild(this.div)
    this.shadow.appendChild(style)

    this.addEventListener('pause', this.pause.bind(this))
    this.addEventListener('play', this.play.bind(this))
  }

  connectedCallback() {
    this.start()
  }

  disconnectedCallback() {
    this.stop()
  }

  get facingMode() {
    return this.getAttribute('facingMode') || 'user'
  }

  set facingMode(value) {
    this.setAttribute('facingMode', value)
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: this.width },
          height: { ideal: this.height },
        },
      })

      this.video.srcObject = this.stream
      this.video.addEventListener('play', () => {
        const loadEvent = new CustomEvent('load', {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            width: this.video.videoWidth,
            height: this.video.videoHeight,
          },
        })
        this.dispatchEvent(loadEvent)
      })
    } catch (error) {
      this.div.classList.add('hide')
      this.div.classList.remove('show')
      throw (error)
    }
    this.div.classList.remove('hide')
    this.div.classList.add('show')
  }

  stop() {
    if (!this.stream) {
      // Just return because there is nothing to stop
      return
    }

    try {
      this.stream.getTracks().forEach(track => {
        track.stop()
      })
    } catch (error) {
      // Intentionally warn client if we tried to stop the video tracks but faced issues
      console.warn(error)
    }
  }

  pause() {
    this.video.pause()
  }

  play() {
    this.video.play()
  }
}

export {
  CameraBasicElement,
}
