// GenByAI: 动态生成+号网格背景（稳定版）
// 实现原理：计算容器尺寸，按36px间距均匀分布+号字符，居中对齐每个网格单元
// 调用方式：自动执行，监听DOMReady事件
// 参数说明：gridSize=36px间距, fontSize=14px字体大小

function generatePlusGrid(container) {
  const gridSize = 36
  const fontSize = 14

  if (!container) return false

  // FixByAI: 获取容器实际尺寸
  const parent = container.parentElement
  if (!parent) return false

  const width = parent.offsetWidth || 420
  const height = parent.offsetHeight || 600

  // FixByAI: 仅在有效尺寸时生成
  if (width < 100 || height < 100) return false

  // FixByAI: 避免重复生成
  if (container.children.length > 0) return true

  container.innerHTML = ''

  const cols = Math.ceil(width / gridSize)
  const rows = Math.ceil(height / gridSize)

  // GenByAI: 使用DocumentFragment提升性能
  const fragment = document.createDocumentFragment()

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const plus = document.createElement('span')
      plus.textContent = '+'
      plus.className = 'plus-symbol'

      // FixByAI: 使用cssText一次性设置样式，减少重排
      plus.style.cssText = `
        position: absolute;
        left: ${col * gridSize + gridSize / 2}px;
        top: ${row * gridSize + gridSize / 2}px;
        transform: translate(-50%, -50%);
        font-size: ${fontSize}px;
        color: rgba(193, 193, 193, 0.4);
        font-weight: 300;
        pointer-events: none;
        user-select: none;
      `

      fragment.appendChild(plus)
    }
  }

  container.appendChild(fragment)

  return container.children.length > 10
}

// FixByAI: 延迟重试机制 - 确保DOM完全渲染后再生成
// 实现原理：多次尝试直到成功或达到最大重试次数
function initPlusGrid() {
  let retryCount = 0
  const MAX_RETRY = 10
  const RETRY_DELAY = 200

  function tryGenerate() {
    const gridContainer = document.querySelector('.plus-grid-background')

    if (generatePlusGrid(gridContainer)) {
      console.log(`✅ +号网格已生成：${gridContainer?.children.length || 0}个`)
      return
    }

    retryCount++

    if (retryCount < MAX_RETRY) {
      setTimeout(tryGenerate, RETRY_DELAY)
    } else {
      console.warn(`⚠️ +号网格生成失败（已重试${MAX_RETRY}次）`)
    }
  }

  // GenByAI: 多种时机尝试确保兼容性
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tryGenerate, 100))
  } else {
    setTimeout(tryGenerate, 100)
  }

  // FixByAI: 额外保险：window.onload再试一次
  window.addEventListener('load', () => setTimeout(tryGenerate, 150))
}

initPlusGrid()