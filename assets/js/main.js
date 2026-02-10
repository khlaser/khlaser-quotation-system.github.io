/**
 * main.js - 应用主入口文件
 * 
 * 功能：
 * - 作为应用的主入口点，负责初始化和启动应用
 * - 协调各个模块的初始化顺序
 * - 绑定全局事件监听器
 * - 设置错误处理机制
 * - 提供工具函数（延迟执行、防抖、节流）
 * 
 * 主要功能：
 * - 初始化UI模块和应用模块
 * - 绑定DOMContentLoaded事件，确保DOM加载完成后初始化
 * - 绑定历史记录面板事件
 * - 绑定全局事件（键盘事件、窗口大小变化事件、页面卸载事件）
 * - 设置全局错误处理（捕获未处理的错误和Promise拒绝）
 * - 提供工具函数：delay（延迟执行）、debounce（防抖）、throttle（节流）
 * 
 * 初始化流程：
 * 1. 设置错误处理
 * 2. 绑定事件监听器
 * 3. 等待DOM加载完成
 * 4. 初始化UI模块
 * 5. 初始化应用模块
 * 6. 显示初始化成功通知
 */

/**
 * 主应用模块
 */
const mainModule = {
    /**
     * 主应用初始化
     */
    initApp: () => {
        // 初始化UI模块
        if (window.ui && window.ui.module && window.ui.module.init) {
            window.ui.module.init();
        }
        
        // 初始化应用模块
        if (window.app && window.app.init) {
            window.app.init();
        }
        
        // 显示初始化成功通知
        if (window.ui && window.ui.notification) {
            window.ui.notification.show('应用初始化成功', 'success');
        }
    },
    
    /**
     * 绑定事件监听器
     */
    bindEventListeners: () => {
        // 页面加载完成事件
        window.addEventListener('DOMContentLoaded', mainModule.initApp);
        
        // 历史记录面板事件
        mainModule.bindHistoryPanelEvents();
        
        // 其他全局事件
        mainModule.bindGlobalEvents();
    },
    
    /**
     * 绑定历史记录面板事件
     */
    bindHistoryPanelEvents: () => {
        // 打开历史记录面板
        const openHistoryPanelBtn = document.getElementById('openHistoryPanel');
        if (openHistoryPanelBtn) {
            openHistoryPanelBtn.addEventListener('click', () => {
                if (window.ui && window.ui.module && window.ui.module.showHistoryPanel) {
                    window.ui.module.showHistoryPanel();
                }
            });
        }
        
        // 关闭历史记录面板
        const closeHistoryPanelBtn = document.getElementById('closeHistoryPanel');
        if (closeHistoryPanelBtn) {
            closeHistoryPanelBtn.addEventListener('click', () => {
                if (window.ui && window.ui.module && window.ui.module.hideHistoryPanel) {
                    window.ui.module.hideHistoryPanel();
                }
            });
        }
        
        // 历史记录面板遮罩点击事件
        const historyPanelOverlay = document.getElementById('historyPanelOverlay');
        if (historyPanelOverlay) {
            historyPanelOverlay.addEventListener('click', () => {
                if (window.ui && window.ui.module && window.ui.module.hideHistoryPanel) {
                    window.ui.module.hideHistoryPanel();
                }
            });
        }
        
        // 清空历史记录
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (window.app && window.app.clearHistory) {
                    window.app.clearHistory();
                }
            });
        }
    },
    
    /**
     * 绑定全局事件
     */
    bindGlobalEvents: () => {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            // ESC键关闭所有模态框和面板
            if (e.key === 'Escape') {
                // 关闭历史记录面板
                if (window.ui && window.ui.module && window.ui.module.hideHistoryPanel) {
                    window.ui.module.hideHistoryPanel();
                }
                
                // 关闭所有模态框
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
        
        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            // 可以在这里添加响应式布局调整逻辑
        });
        
        // 页面卸载事件
        window.addEventListener('beforeunload', () => {
            // 可以在这里添加页面卸载前的清理逻辑
        });
    },
    
    /**
     * 工具函数：延迟执行
     * @param {Function} func - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {number} 定时器ID
     */
    delay: (func, delay) => {
        return setTimeout(func, delay);
    },
    
    /**
     * 工具函数：防抖执行
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce: (func, wait) => {
        let timeout;
        return (...args) => {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 工具函数：节流执行
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * 全局错误处理
     */
    setupErrorHandling: () => {
        // 全局错误捕获
        window.addEventListener('error', (error) => {
            console.error('Global error:', error);
            if (window.ui && window.ui.notification) {
                window.ui.notification.show('发生错误，请查看控制台', 'danger');
            }
        });
        
        // 未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (window.ui && window.ui.notification) {
                window.ui.notification.show('发生异步错误，请查看控制台', 'danger');
            }
        });
    },
    
    /**
     * 初始化应用
     */
    init: () => {
        // 设置错误处理
        mainModule.setupErrorHandling();
        
        // 绑定事件监听器
        mainModule.bindEventListeners();
    }
};

/**
 * 导出主模块
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mainModule;
} else if (typeof window !== 'undefined') {
    window.main = mainModule;
}

/**
 * 立即执行初始化
 */
mainModule.init();
