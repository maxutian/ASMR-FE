class Carousel {
  constructor(config) {
    this.images = config.images
    this.duration = config.animateDuration
    this.switching = false
    this.background = null
    this.imageDoms = []
    this.prevAnimation = {
      left: {
        transform: [
          'rotateY(25deg) translateX(-100%) scale(0.8)',
          'rotateY(-25deg) translateX(100%) scale(0.8)',
        ],
      },
      right: {
        filter: ['contrast(50%) grayscale(80%)', 'contrast(100%) grayscale(0)'],
        transform: [
          'rotateY(25deg) translateX(-100%) scale(0.8)',
          'rotateY(0deg) translateX(0) scale(1)',
        ],
      },
    }
    this.currentAnimation = {
      left: {
        filter: ['contrast(100%) grayscale(0)', 'contrast(50%) grayscale(80%)'],
        transform: [
          'rotateY(0deg) translateX(0) scale(1)',
          'rotateY(25deg) translateX(-100%) scale(0.8)',
        ],
      },
      right: {
        filter: ['contrast(100%) grayscale(0)', 'contrast(50%) grayscale(80%)'],
        transform: [
          'rotateY(0deg) translateX(0) scale(1)',
          'rotateY(-25deg) translateX(100%) scale(0.8)',
        ],
      },
    }
    this.nextAnimation = {
      left: {
        filter: ['contrast(50%) grayscale(80%)', 'contrast(100%) grayscale(0)'],
        transform: [
          'rotateY(-25deg) translateX(100%) scale(0.8)',
          'rotateY(0deg) translateX(0) scale(1)',
        ],
      },
      right: {
        transform: [
          'rotateY(-25deg) translateX(100%) scale(0.8)',
          'rotateY(25deg) translateX(-100%) scale(0.8)',
        ],
      },
    }
    this.backgroundAnimation = {
      opacity: [1, 0, 0, 1],
    }
    this.animationConfig = {
      duration: config.animateDuration,
      easing: 'ease-out',
    }
  }

  initDom = () => {
    const root = document.querySelector(`#carousel`)
    const background = document.querySelector(`#carousel-background`)
    const wrap = document.createElement('div')
    background.src = this.images[1]
    this.background = background
    this.imageDoms = this.images.map((image, index) => {
      const div = document.createElement('div')
      const img = document.createElement('img')
      img.src = image
      img.alt = `img${index}`
      img.classList.add('carousel-img')
      index === 0 && img.classList.add('img-prev')
      index === 2 && img.classList.add('img-next')
      div.classList.add('carousel-item')
      div.appendChild(img)
      wrap.appendChild(div)
      return div
    })

    root.appendChild(wrap)
  }

  updateBackground = (direction) => {
    setTimeout(() => {
      this.background.src =
        this.images[
          {
            left: 2,
            right: 0,
          }[direction]
        ]
    }, (this.duration / 2) * 0.95)
    this.background.animate(this.backgroundAnimation, this.animationConfig)
  }

  updateImageOrder = (direction) => {
    let newOrder = [0, 1, 2]
    let newImages = this.images
    let newImageDoms = this.imageDoms
    switch (direction) {
      case 'left':
        newOrder = [1, 2, 0]
        break
      case 'right':
        newOrder = [2, 0, 1]
        break
      default:
        break
    }
    newImages = newOrder.map((order) => this.images[order])
    newImageDoms = newOrder.map((order) => this.imageDoms[order])
    this.images = newImages
    this.imageDoms = newImageDoms
  }

  updateImageClass = () => {
    this.imageDoms.forEach((image, index) => {
      const img = image.getElementsByTagName('img')[0]
      img.classList.remove('img-prev')
      img.classList.remove('img-next')
      index === 0 && img.classList.add('img-prev')
      index === 2 && img.classList.add('img-next')
    })
  }

  switch = (direction) => {
    if (this.switching) {
      return
    }

    this.switching = true
    this.imageDoms.forEach((image, index) => {
      image.style.zIndex = {
        left: 3 + index,
        right: 3 - index,
      }[direction]
    })

    this.updateBackground(direction)
    this.imageDoms[0]
      .getElementsByTagName('img')[0]
      .animate(this.prevAnimation[direction], this.animationConfig)
    this.imageDoms[1]
      .getElementsByTagName('img')[0]
      .animate(this.currentAnimation[direction], this.animationConfig)
    this.imageDoms[2]
      .getElementsByTagName('img')[0]
      .animate(this.nextAnimation[direction], this.animationConfig)
    setTimeout(() => {
      this.updateImageOrder(direction)
      this.updateImageClass()
      this.switching = false
    }, this.duration * 0.95)
  }
}
