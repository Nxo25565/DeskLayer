

const timer = window.anime.animate({
  targets: '.plus-symbol',
  translateX: [-100, 100],
  duration: 1000,
  loop: true
})
console.log('hello from anime.js')
console.log(timer)