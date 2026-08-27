/// <reference path="./libs/animejs-4.5.0/anime.umd.js" />

declare var anime: typeof import('./libs/animejs-4.5.0/anime.umd.js')

declare interface Window {
  anime: typeof import('./libs/animejs-4.5.0/anime.umd.js')
}