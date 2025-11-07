console.log('✅ page-thumbnail.js 已加载');

let currentPreviewUrl = null; // 用于跟踪当前预览的 URL
let previewWrapper = null;
let debounceTimer = null; // 用于悬停去抖
const DEBOUNCE_DELAY = 300; // 300ms 延迟，避免快速划过就弹出
const PREVIEW_ELEMENT_ID = 'page-preview-wrapper';
const IFRAME_ELEMENT_ID = 'preview-iframe';
const TITLE_ELEMENT_ID = 'preview-title';
const CLOSE_BTN_ID = 'preview-close';

/**
 * 优化 1: 将容器创建/事件绑定逻辑独立，只在初始化时执行一次。
 * 避免重复创建和移除 DOM 元素。
 */
function createAndSetupPreviewContainer() {
  if (previewWrapper) {
    console.log('🏗️ 预览容器已存在，跳过创建');
    return;
  }

  console.log('🏗️ 创建并设置预览容器');

  previewWrapper = document.createElement('div');
  previewWrapper.id = PREVIEW_ELEMENT_ID;
  
  // 优化 2: 使用 CSS class 而不是 inline style 来管理样式
  // 这里为了保持单文件完整性，仍然使用 style.cssText，但添加了 `transition` 属性
  previewWrapper.style.cssText = `
    position: fixed;
    top: 80px;
    right: 10px;
    width: 600px;
    height: calc(100vh - 120px);
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 1000;
    display: block; /* 默认设为 block，通过 opacity 和 transform 控制显示/隐藏 */
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none; /* 默认不接受点击事件 */
    transition: opacity 0.2s ease-out, transform 0.2s ease-out; /* 添加动画 */
    overflow: hidden;
  `;

  previewWrapper.innerHTML = `
    <div style="
      padding: 12px 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      font-weight: 600;
      font-size: 14px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span id="${TITLE_ELEMENT_ID}">页面预览</span>
      <button id="${CLOSE_BTN_ID}" style="
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
      ">×</button>
    </div>
    <iframe 
      id="${IFRAME_ELEMENT_ID}"
      sandbox="allow-scripts allow-same-origin allow-popups"
      style="
        width: 100%;
        height: calc(100% - 50px);
        border: none;
        background-color: white;
      "
    ></iframe>
  `;

  document.body.appendChild(previewWrapper);
  console.log('✅ 预览容器已添加到 body');

  // 绑定关闭按钮
  const closeBtn = document.getElementById(CLOSE_BTN_ID);
  closeBtn.addEventListener('click', () => {
    console.log('🔴 点击关闭按钮');
    hidePreview();
  });
  
  // 绑定点击外部关闭
  document.addEventListener('click', (e) => {
    if (currentPreviewUrl && 
        !previewWrapper.contains(e.target) && 
        !e.target.closest('a[data-has-preview]')) {
      console.log('🔴 点击外部，关闭预览');
      hidePreview();
    }
  });

  // 优化 3: 绑定 document.body 的 mouseleave 事件，当鼠标移出整个页面时关闭预览
  document.body.addEventListener('mouseleave', () => {
    if (currentPreviewUrl) {
      // 增加一个微小的延迟，以防误触
      setTimeout(hidePreview, 100); 
    }
  });
}

/**
 * 优化 4: 移除滚动锁定/恢复逻辑
 * 页面抖动和文字移动主要是因为滚动条消失和出现导致的。
 * 在现代网页设计中，非模态的预览通常应避免修改主页面的滚动行为。
 * 如果一定要锁定，应该使用更精确的方法，例如给 body 添加 `overflow: hidden;`
 * 并计算滚动条宽度来避免页面内容跳动。但为了简化和解决抖动问题，这里选择移除锁定。
 *
 * 如果需要恢复锁定，请使用以下逻辑：
 * document.body.style.overflow = 'hidden';
 * document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
 * (但请注意，这可能会导致标题栏等非正文区域跳动，这也是不推荐的原因)
 */

function showPreview(url, title) {
  // 优化 5: 避免重复加载
  if (currentPreviewUrl === url) {
    return;
  }
  
  console.log('🟢 显示预览:', url);

  if (!previewWrapper) {
    console.error('❌ 预览容器不存在！');
    return;
  }

  const iframe = document.getElementById(IFRAME_ELEMENT_ID);
  const titleSpan = document.getElementById(TITLE_ELEMENT_ID);

  if (!iframe || !titleSpan) {
    console.error('❌ iframe 或 title 元素不存在！');
    return;
  }

  currentPreviewUrl = url;
  iframe.src = url;
  titleSpan.textContent = title || '页面预览';
  
  // 使用 CSS 动画显示
  previewWrapper.style.opacity = '1';
  previewWrapper.style.transform = 'scale(1)';
  previewWrapper.style.pointerEvents = 'auto'; // 允许点击
  
  console.log('✅ 预览框已显示 (URL:', url, ')');
}

function hidePreview() {
  if (!currentPreviewUrl) {
    return; // 已经是隐藏状态
  }
  
  console.log('🔴 隐藏预览');

  if (previewWrapper) {
    // 使用 CSS 动画隐藏
    previewWrapper.style.opacity = '0';
    previewWrapper.style.transform = 'scale(0.95)';
    previewWrapper.style.pointerEvents = 'none';
  }

  // 延迟清空 iframe，等待动画结束 (可选，但能提高性能)
  setTimeout(() => {
    const iframe = document.getElementById(IFRAME_ELEMENT_ID);
    if (iframe) {
      iframe.src = 'about:blank';
      console.log('🧹 已清空 iframe');
    }
  }, 200); // 200ms 和 transition 时间一致

  currentPreviewUrl = null;
}

function initPageThumbnails() {
  console.log('🔍 开始初始化缩略图功能');

  // 如果在 iframe 内，不初始化预览功能（防止套娃）
  if (window.self !== window.top) {
    console.log('⚠️ 检测到在 iframe 内，跳过预览功能');
    return;
  }

  // 确保容器只创建一次
  createAndSetupPreviewContainer();

  const currentOrigin = window.location.origin;

  // 只选择正文内的链接
  const links = document.querySelectorAll('article a[href], .md-content a[href]');
  console.log(`📊 找到 ${links.length} 个链接`);

  let processedCount = 0;

  links.forEach((link) => {
    try {
      const href = link.getAttribute('href');
      const fullHref = link.href;

      // 排除条件（保持原有逻辑，确保只处理内部文档链接）
      const isAnchorLink = href && href.startsWith('#'); 
      const isHeaderLink = link.classList.contains('headerlink'); 
      const isTocLink = link.closest('.md-nav'); 
      const isExternalLink = !fullHref.startsWith(currentOrigin); 
      const isSpecialProtocol = href && (
        href.startsWith('mailto:') || 
        href.startsWith('tel:') || 
        href.startsWith('javascript:')
      );
      const isCurrentPage = fullHref === window.location.href || 
                            fullHref.replace(/\/$/, '') === window.location.href.replace(/\/$/, '');

      if (isAnchorLink || isHeaderLink || isTocLink || isExternalLink || isSpecialProtocol || isCurrentPage) {
        return;
      }

      processedCount++;
      // console.log(`✅ 处理内部链接 ${processedCount}:`, fullHref);

      link.setAttribute('data-has-preview', 'true');
      link.style.cursor = 'pointer';

      // 优化 6: 引入 Debounce (去抖) 逻辑
      link.addEventListener('mouseenter', function() {
        // 清除上一次的计时器
        clearTimeout(debounceTimer); 

        debounceTimer = setTimeout(() => {
          console.log('🖱️ 鼠标悬停去抖触发:', fullHref);
          showPreview(fullHref, link.textContent);
        }, DEBOUNCE_DELAY);
      });

      // 优化 7: 引入 mouseleave/click 逻辑来清除 timer 和隐藏
      link.addEventListener('mouseleave', function() {
        // 鼠标移出链接，清除计时器，避免预览弹出
        clearTimeout(debounceTimer); 
      });

      // 优化 8: 阻止链接默认行为 (重要: 如果用户点击链接，应该关闭预览)
      link.addEventListener('click', (e) => {
        // 如果预览是激活状态，点击链接时应优先清除悬停状态，让链接跳转
        clearTimeout(debounceTimer); 
        hidePreview(); 
      });


    } catch (error) {
      console.error(`❌ 处理链接时出错:`, error);
    }
  });

  console.log(`✅ 初始化完成！成功处理 ${processedCount} 个内部链接`);
}

function init() {
  console.log('🚀 开始初始化...');

  // 页面切换时，只需隐藏/清空现有预览，不需要重新创建容器
  hidePreview(); 

  // 延迟初始化，确保所有 DOM 都已加载完毕，对 Material for MkDocs 很有用
  setTimeout(() => {
    initPageThumbnails();
  }, 300);
}

// 确保 DOM 加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 兼容 Material for MkDocs 的即时加载 (Instant loading)
if (typeof document$ !== 'undefined') {
  console.log('✅ 检测到 Material 即时加载');
  document$.subscribe(function() {
    console.log('🔄 页面切换，重新初始化');
    init();
  });
}

console.log('📦 page-thumbnail.js 脚本加载完成');