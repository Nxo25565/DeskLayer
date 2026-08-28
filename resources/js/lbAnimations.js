const animejs = window.anime

console.log('hello from lbAnimations.js')
function containerShowAnimation(){
    console.log('containerAnimation start')
    animejs.animate(
        '.linkbro-container',
        {
            scaleX: [0,1],
            scaleY: [0,1],
            opacity: [0,1],
            transformOrigin: '0% 0%',
            duration: 200,
            ease: animejs.spring({ bounce: 0.5, duration: 200 })
        }
    )
    console.log('containerAnimation end')
}
function containerHideAnimation(){
    console.log('containerAnimation hide start')
    animejs.animate(
        '.linkbro-container',
        {
            scaleX: [1,0],
            scaleY: [1,0],
            opacity: [1,0],
            transformOrigin: '0% 0%',
            duration: 400,
            ease: animejs.cubicBezier(0.856, -0.274,0,1.016)
        }
    )
    console.log('containerAnimation hide end')
}

function itemShowAnimation(){
    console.log('itemShowAnimation start')

    animejs.animate('.item-name', {
        x: [
            { to: ['-100%', '0%'] },
        ],
        opacity: [0,1],
        duration: 750,
        ease: 'out(3)',
        delay: animejs.stagger(40),
    });
    console.log('itemShowAnimation end')
}

function itemHideAnimation(){
    console.log('itemHideAnimation start')

    animejs.animate('.item-name', {
        opacity: [1,0],
        duration: 750,
        ease: 'out(3)',
        delay: animejs.stagger(40),
    });
    console.log('itemHideAnimation end')
}

function showAnimations(){
    containerShowAnimation()
    itemShowAnimation()
}

window.linkbro.onPlayShowAnimation(showAnimations)
window.linkbro.onPlayHideAnimation(containerHideAnimation)
