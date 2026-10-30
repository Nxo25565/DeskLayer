console.log("hello from listItemAnimation.js")

const singleContainer = document.getElementsByClassName('single-scroll')
const folderConatiner = document.getElementsByClassName('folders-scroll')

const animejs = window.anime
console.log(singleContainer[0].children)

let elementPlayed

// GenByAI #13: 列表项悬停弹跳动画，使用 animejs WAAPI 实现
function bounceAnimation(element) {
    animejs.animate(element, {
        scaleX: [0.9, 1],
        scaleY: [0.9, 1],
        duration: 500,
        ease: 'outElastic'
    })
}



// for (var chd of singleContainer[0].children){
//     chd.addEventListener('mouseover',() => {
//         bounceAniamtiom(chd)
//     })
//     console.log("add animation")
// }


// GenByAI #13: 事件委托批量绑定悬停动画，避免逐元素绑定
// FixByAI: 改用事件委托替代 var for 循环，修复闭包陷阱导致动画始终作用于最后一个元素
singleContainer[0].addEventListener('mouseover', (e) => {
    const item = e.target.closest('.list-item')
    if (item && item != elementPlayed) {
        bounceAnimation(item)
        elementPlayed = item
    }
})
folderConatiner[0].addEventListener('mouseover', (e) => {
    const item = e.target.closest('.list-item')
    if (item && item != elementPlayed) {
        bounceAnimation(item)
        elementPlayed = item
    }
})

settings.onSettingsHideAnimation(() => {
    animejs.utils.remove()
    animejs.animate('*',{
        opacity:[1,0],
        duration:500,
        easing:'linear',
        delay:animejs.stagger(1)
    })
    animejs.animate('*',{
        scaleX: [1,0.9],
        scaleY: [1,0.9],
        duration:800,
        ease: 'outElastic',
        delay:animejs.stagger(2)
    })
})

// GenByAI #14: 设置窗口显示时的入场动画
settings.onSettingsShowAnimation(() => {
    animejs.utils.remove()
    animejs.animate('*',{
        opacity:[0,1],
        duration:500,
        easing:'linear',
        delay:animejs.stagger(1)
    })
    animejs.animate('*',{
        scaleX: [0.9, 1],
        scaleY: [0.9, 1],
        duration:800,
        ease: 'outElastic',
        delay:animejs.stagger(2)
    })
    // for (let element of singleContainer[0].children) {
    //     animejs.animate(element, {
    //         scaleX: [0.9, 1],
    //         scaleY: [0.9, 1],
    //         duration: 500,
    //         ease: 'outElastic',
    //         delay:t
    //     })
    //     t += 50
    // }
    // t = 0
    // for (let element of folderConatiner[0].children) {
        
    //     animejs.animate(element, {
    //         scaleX: [0.9, 1],
    //         scaleY: [0.9, 1],
    //         duration: 300,
    //         ease: 'outElastic',
    //         delay:t
    //     })
    //     t += 50
    // }
})