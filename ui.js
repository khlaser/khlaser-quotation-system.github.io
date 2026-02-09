/**
 * ui.js - UI交互逻辑模块
 * 
 * 功能：
 * - 处理用户界面交互逻辑，包括事件监听和处理
 * - 管理模态框、面板、折叠框等UI组件的显示和隐藏
 * - 实现通知系统，提供用户反馈
 * - 处理表单输入和验证
 * - 更新价格显示和历史记录列表
 * - 实现标签页切换和其他UI状态管理
 * 
 * 主要模块：
 * - notificationModule：通知系统，用于显示成功、警告、错误等通知
 * - uiModule：核心UI模块，处理DOM操作和事件监听
 * 
 * 主要功能：
 * - 初始化UI事件（模态框、标签页、折叠框等）
 * - 显示/隐藏历史记录面板
 * - 显示/隐藏模态框和加载中遮罩
 * - 更新价格显示和费用明细
 * - 更新历史记录列表
 * - 更新机器信息显示
 * - 处理表单输入和提交事件
 * - 处理价格来源变更事件
 * - 处理其他配件搜索事件
 */

/**
 * 通知模块
 * 用于显示通知消息
 */
const notificationModule = {
    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型：success, warning, danger
     * @param {number} duration - 持续时间（毫秒），默认为3000
     */
    show(message, type = 'success', duration = 3000) {
        // 确保通知容器存在
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // 创建通知内容
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        
        // 根据类型设置图标
        switch (type) {
            case 'success':
                icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'danger':
                icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                break;
            default:
                icon.innerHTML = '<i class="fas fa-info-circle"></i>';
        }
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const title = document.createElement('div');
        title.className = 'notification-title';
        
        // 根据类型设置标题
        switch (type) {
            case 'success':
                title.textContent = '成功';
                break;
            case 'warning':
                title.textContent = '警告';
                break;
            case 'danger':
                title.textContent = '错误';
                break;
            default:
                title.textContent = '信息';
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => {
            this.hide(notification);
        };
        
        // 组装通知元素
        content.appendChild(title);
        content.appendChild(messageElement);
        notification.appendChild(icon);
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        
        // 添加到容器
        container.appendChild(notification);
        
        // 自动隐藏
        setTimeout(() => {
            this.hide(notification);
        }, duration);
    },
    
    /**
     * 隐藏通知
     * @param {HTMLElement} notification - 通知元素
     */
    hide(notification) {
        if (notification) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    },
    
    /**
     * 清空所有通知
     */
    clearAll() {
        const container = document.querySelector('.notification-container');
        if (container) {
            container.innerHTML = '';
        }
    }
};

/**
 * UI模块
 * 包含与UI相关的交互逻辑
 */
const uiModule = {
    /**
     * 初始化UI事件
     */
    init() {
        this.initModalEvents();
        this.initTabEvents();
        this.initCollapseEvents();
        this.initHistoryPanelEvents();
        this.initFormEvents();
        this.initPriceSourceEvents();
        this.initOtherAccessoriesEvents();
    },
    
    /**
     * 初始化模态框事件
     */
    initModalEvents() {
        // 关闭模态框事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
    },
    
    /**
     * 初始化标签页事件
     */
    initTabEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab')) {
                const tabContainer = e.target.closest('.tab-container');
                if (tabContainer) {
                    // 移除所有标签页的活动状态
                    const tabs = tabContainer.querySelectorAll('.tab');
                    tabs.forEach(tab => tab.classList.remove('active'));
                    
                    // 添加当前标签页的活动状态
                    e.target.classList.add('active');
                    
                    // 隐藏所有内容
                    const tabContents = tabContainer.querySelectorAll('.tab-content');
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // 显示当前标签页对应的内容
                    const tabId = e.target.getAttribute('data-tab');
                    if (tabId) {
                        const tabContent = tabContainer.querySelector(`.tab-content[data-tab="${tabId}"]`);
                        if (tabContent) {
                            tabContent.classList.add('active');
                        }
                    }
                }
            }
        });
    },
    
    /**
     * 初始化折叠面板事件
     */
    initCollapseEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('collapse-header') || e.target.closest('.collapse-header')) {
                const header = e.target.closest('.collapse-header');
                if (header) {
                    const content = header.nextElementSibling;
                    if (content && content.classList.contains('collapse-content')) {
                        content.classList.toggle('expanded');
                        
                        // 切换图标
                        const icon = header.querySelector('i');
                        if (icon) {
                            if (content.classList.contains('expanded')) {
                                icon.className = 'fas fa-chevron-up';
                            } else {
                                icon.className = 'fas fa-chevron-down';
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * 初始化历史记录面板事件
     */
    initHistoryPanelEvents() {
        // 打开历史记录面板
        const openHistoryBtn = document.getElementById('openHistoryPanel');
        if (openHistoryBtn) {
            openHistoryBtn.addEventListener('click', () => {
                this.showHistoryPanel();
            });
        }
        
        // 关闭历史记录面板
        const closeHistoryBtn = document.getElementById('closeHistoryPanel');
        if (closeHistoryBtn) {
            closeHistoryBtn.addEventListener('click', () => {
                this.hideHistoryPanel();
            });
        }
        
        // 点击遮罩关闭历史记录面板
        const historyPanelOverlay = document.getElementById('historyPanelOverlay');
        if (historyPanelOverlay) {
            historyPanelOverlay.addEventListener('click', () => {
                this.hideHistoryPanel();
            });
        }
    },
    
    /**
     * 初始化表单事件
     */
    initFormEvents() {
        // 表单输入事件
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                // 触发输入事件回调
                if (this.onInput) {
                    this.onInput(e.target);
                }
            }
        });
        
        // 表单提交事件
        document.addEventListener('submit', (e) => {
            if (this.onSubmit) {
                this.onSubmit(e);
            }
        });
    },
    
    /**
     * 初始化价格来源事件
     */
    initPriceSourceEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('price-source-option')) {
                const priceSource = e.target.closest('.price-source');
                if (priceSource) {
                    // 移除所有选项的活动状态
                    const options = priceSource.querySelectorAll('.price-source-option');
                    options.forEach(option => option.classList.remove('active'));
                    
                    // 添加当前选项的活动状态
                    e.target.classList.add('active');
                    
                    // 触发价格来源变更事件
                    if (this.onPriceSourceChange) {
                        const source = e.target.getAttribute('data-source');
                        this.onPriceSourceChange(source);
                    }
                }
            }
        });
    },
    
    /**
     * 初始化其他配件事件
     */
    initOtherAccessoriesEvents() {
        // 搜索框事件
        const searchInput = document.getElementById('otherAccessoriesSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (this.onAccessorySearch) {
                    this.onAccessorySearch(e.target.value);
                }
            });
        }
        
        // 清空搜索按钮事件
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    if (this.onAccessorySearch) {
                        this.onAccessorySearch('');
                    }
                }
                clearSearchBtn.style.display = 'none';
            });
        }
        
        // 搜索框输入时显示/隐藏清空按钮
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
                }
            });
        }
    },
    
    /**
     * 显示历史记录面板
     */
    showHistoryPanel() {
        const panel = document.getElementById('historyPanel');
        const overlay = document.getElementById('historyPanelOverlay');
        
        if (panel && overlay) {
            panel.classList.add('active');
            overlay.classList.add('active');
        }
    },
    
    /**
     * 隐藏历史记录面板
     */
    hideHistoryPanel() {
        const panel = document.getElementById('historyPanel');
        const overlay = document.getElementById('historyPanelOverlay');
        
        if (panel && overlay) {
            panel.classList.remove('active');
            overlay.classList.remove('active');
        }
    },
    
    /**
     * 显示模态框
     * @param {string} modalId - 模态框ID
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    /**
     * 隐藏模态框
     * @param {string} modalId - 模态框ID
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    /**
     * 显示加载中遮罩
     */
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    },
    
    /**
     * 隐藏加载中遮罩
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    },
    
    /**
     * 更新历史记录列表
     * @param {Array} history - 历史记录数组
     */
    updateHistoryList(history) {
        const historyList = document.getElementById('historyList');
        if (historyList) {
            if (history && history.length > 0) {
                historyList.innerHTML = history.map(item => `
                    <div class="history-item" data-id="${item.id}">
                        <div class="history-date">${item.date}</div>
                        <div class="history-total">${item.total}</div>
                        <div class="history-details">${item.details}</div>
                    </div>
                `).join('');
            } else {
                historyList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clock"></i>
                        <p>暂无历史报价记录</p>
                    </div>
                `;
            }
        }
    },
    
    /**
     * 更新价格显示
     * @param {number} cnyPrice - 人民币价格
     * @param {number} usdPrice - 美元价格
     */
    updatePriceDisplay(cnyPrice, usdPrice) {
        const cnyPriceElement = document.getElementById('cnyPrice');
        const usdPriceElement = document.getElementById('usdPrice');
        
        if (cnyPriceElement) {
            cnyPriceElement.textContent = `¥${cnyPrice.toFixed(2)}`;
        }
        
        if (usdPriceElement) {
            usdPriceElement.textContent = `$${usdPrice.toFixed(2)}`;
        }
    },
    
    /**
     * 更新费用明细
     * @param {Object} priceDetails - 费用明细对象
     */
    updatePriceDetails(priceDetails) {
        const priceDetailsContainer = document.querySelector('.price-details-container');
        if (priceDetailsContainer) {
            priceDetailsContainer.innerHTML = `
                <div class="price-details-group">
                    <div class="price-details-grid">
                        <div class="price-row">
                            <span class="price-detail-label">机器价格:</span>
                            <span class="price-detail-value" id="priceDetailMachine">¥${priceDetails.machinePrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">水冷机价格:</span>
                            <span class="price-detail-value" id="priceDetailWaterCooler">¥${priceDetails.waterCoolerPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">配件价格:</span>
                            <span class="price-detail-value" id="priceDetailAccessories">¥${priceDetails.accessoriesPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">其他配件价格:</span>
                            <span class="price-detail-value" id="priceDetailOtherAccessories">¥${priceDetails.otherAccessoriesPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">国际运费:</span>
                            <span class="price-detail-value" id="priceDetailInternationalShipping">¥${priceDetails.internationalShipping.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">国内运费:</span>
                            <span class="price-detail-value" id="priceDetailDomesticShipping">¥${priceDetails.domesticShipping.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">其他费用:</span>
                            <span class="price-detail-value" id="priceDetailOtherFees">¥${priceDetails.otherFees.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-detail-label">数量:</span>
                            <span class="price-detail-value" id="priceDetailQuantity">${priceDetails.quantity}</span>
                        </div>
                    </div>
                    <div class="price-total-row">
                        <span class="price-total-label">总计:</span>
                        <span class="price-total-value" id="priceDetailTotal">¥${priceDetails.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    },
    
    /**
     * 更新机器信息显示
     * @param {Object} machineInfo - 机器信息对象
     */
    updateMachineInfo(machineInfo) {
        const machineInfoDisplay = document.getElementById('machineInfoDisplay');
        const packingSize = document.getElementById('packingSize');
        const cbmValue = document.getElementById('cbmValue');
        const volumeWeight = document.getElementById('volumeWeight');
        const actualWeight = document.getElementById('actualWeight');
        
        if (machineInfoDisplay && machineInfo) {
            machineInfoDisplay.style.display = 'block';
            
            if (packingSize) {
                packingSize.textContent = `${machineInfo.packingSize.length}×${machineInfo.packingSize.width}×${machineInfo.packingSize.height} cm`;
            }
            
            if (cbmValue) {
                cbmValue.textContent = machineInfo.cbm.toFixed(3);
            }
            
            if (volumeWeight) {
                volumeWeight.textContent = machineInfo.volumeWeight.toFixed(2) + ' kg';
            }
            
            if (actualWeight) {
                actualWeight.textContent = machineInfo.actualWeight.toFixed(2) + ' kg';
            }
        } else if (machineInfoDisplay) {
            machineInfoDisplay.style.display = 'none';
        }
    },
    
    /**
     * 事件回调
     */
    onInput: null,
    onSubmit: null,
    onPriceSourceChange: null,
    onAccessorySearch: null
};

/**
 * UI模块导出
 */
const ui = {
    module: uiModule,
    notification: notificationModule
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ui;
} else if (typeof window !== 'undefined') {
    window.ui = ui;
}
