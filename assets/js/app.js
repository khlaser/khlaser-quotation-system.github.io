/**
 * app.js - 应用主逻辑模块
 * 
 * 功能：
 * - 包含应用的核心业务逻辑和默认数据
 * - 处理应用初始化和事件监听
 * - 管理应用状态和数据
 * - 计算价格和费用明细
 * - 处理机器选择和配置
 * - 管理历史记录和模板
 * 
 * 主要功能：
 * - 初始化应用数据和事件监听器
 * - 更新机器选项（系列、型号、功率）
 * - 更新水冷机和配件选项
 * - 选择机器并更新机器信息
 * - 计算价格和费用明细
 * - 管理历史记录（添加、保存、加载、清空）
 * - 管理模板（保存、加载）
 * 
 * 默认数据：
 * - defaultMachines：默认机器数据
 * - defaultWaterCoolers：默认水冷机数据
 * - defaultAccessories：默认配件数据
 * - defaultOtherAccessories：默认其他配件数据
 */

/**
 * 应用模块
 */
const appModule = {
    /**
     * 初始化应用
     */
    init: function() {
        this.initDefaultData();
        this.initEventListeners();
        this.updateMachineOptions();
        this.calculatePrice();
    },
    
    /**
     * 初始化默认数据
     */
    initDefaultData: function() {
        // 默认汇率
        this.exchangeRate = 6.5;
        
        // 默认价格来源
        this.priceSource = 'tier1';
        
        // 默认数量
        this.quantity = 1;
        
        // 默认费用
        this.internationalShipping = 0;
        this.domesticShipping = 0;
        this.otherFees = 0;
        
        // 默认国家
        this.country = 'US';
        
        // 默认选中的机器
        this.selectedMachine = null;
        
        // 默认选中的水冷机
        this.selectedWaterCooler = null;
        
        // 默认选中的配件
        this.selectedAccessories = [];
        
        // 默认选中的其他配件
        this.selectedOtherAccessories = [];
        
        // 历史记录
        this.history = [];
        
        // 默认模板
        this.templates = [];
        
        // 加载历史记录
        this.loadHistory();
        
        // 加载模板
        this.loadTemplates();
    },
    
    /**
     * 初始化事件监听器
     */
    initEventListeners: function() {
        // 汇率变更事件
        const exchangeRateInput = document.getElementById('exchangeRate');
        if (exchangeRateInput) {
            exchangeRateInput.addEventListener('input', (e) => {
                this.exchangeRate = parseFloat(e.target.value) || 6.5;
                this.calculatePrice();
            });
        }
        
        // 数量变更事件
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', (e) => {
                this.quantity = parseInt(e.target.value) || 1;
                this.calculatePrice();
            });
        }
        
        // 国际运费变更事件
        const internationalShippingInput = document.getElementById('internationalShipping');
        if (internationalShippingInput) {
            internationalShippingInput.addEventListener('input', (e) => {
                this.internationalShipping = parseFloat(e.target.value) || 0;
                this.calculatePrice();
            });
        }
        
        // 国内运费变更事件
        const domesticShippingInput = document.getElementById('domesticShipping');
        if (domesticShippingInput) {
            domesticShippingInput.addEventListener('input', (e) => {
                this.domesticShipping = parseFloat(e.target.value) || 0;
                this.calculatePrice();
            });
        }
        
        // 其他费用变更事件
        const otherFeesInput = document.getElementById('otherFees');
        if (otherFeesInput) {
            otherFeesInput.addEventListener('input', (e) => {
                this.otherFees = parseFloat(e.target.value) || 0;
                this.calculatePrice();
            });
        }
        
        // 国家变更事件
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.country = e.target.value;
            });
        }
        
        // 机器系列变更事件
        const seriesSelect = document.getElementById('seriesSelect');
        if (seriesSelect) {
            seriesSelect.addEventListener('change', (e) => {
                const series = e.target.value;
                this.updateModelOptions(series);
                this.selectedMachine = null;
                this.calculatePrice();
            });
        }
        
        // 机器型号变更事件
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                const model = e.target.value;
                this.updatePowerOptions(model);
                this.selectedMachine = null;
                this.calculatePrice();
            });
        }
        
        // 机器功率变更事件
        const powerSelect = document.getElementById('powerSelect');
        if (powerSelect) {
            powerSelect.addEventListener('change', (e) => {
                const power = e.target.value;
                this.selectMachine(power);
                this.calculatePrice();
            });
        }
        
        // 水冷机选择事件
        document.addEventListener('change', (e) => {
            if (e.target.name === 'waterCooler') {
                this.selectedWaterCooler = e.target.value;
                this.calculatePrice();
            }
        });
        
        // 配件选择事件
        document.addEventListener('change', (e) => {
            if (e.target.name === 'accessory') {
                this.updateSelectedAccessories();
                this.calculatePrice();
            }
        });
        
        // 其他配件选择事件
        document.addEventListener('change', (e) => {
            if (e.target.name === 'otherAccessory') {
                this.updateSelectedOtherAccessories();
                this.calculatePrice();
            }
        });
        
        // 清空历史记录事件
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }
    },
    
    /**
     * 默认机器数据
     */
    defaultMachines: [
        {
            id: 'kh-1390-50w',
            series: 'KH-1390',
            model: '1390',
            power: '50W',
            priceTiers: [
                { min: 1, max: 9, price: 10000 },
                { min: 10, max: 99, price: 9500 },
                { min: 100, max: null, price: 9000 }
            ],
            packingSize: { length: 150, width: 100, height: 80 },
            cbm: 1.2,
            volumeWeight: 240,
            actualWeight: 200
        },
        {
            id: 'kh-1390-80w',
            series: 'KH-1390',
            model: '1390',
            power: '80W',
            priceTiers: [
                { min: 1, max: 9, price: 12000 },
                { min: 10, max: 99, price: 11500 },
                { min: 100, max: null, price: 11000 }
            ],
            packingSize: { length: 150, width: 100, height: 80 },
            cbm: 1.2,
            volumeWeight: 240,
            actualWeight: 210
        },
        {
            id: 'kh-1390-100w',
            series: 'KH-1390',
            model: '1390',
            power: '100W',
            priceTiers: [
                { min: 1, max: 9, price: 14000 },
                { min: 10, max: 99, price: 13500 },
                { min: 100, max: null, price: 13000 }
            ],
            packingSize: { length: 150, width: 100, height: 80 },
            cbm: 1.2,
            volumeWeight: 240,
            actualWeight: 220
        },
        {
            id: 'kh-1610-50w',
            series: 'KH-1610',
            model: '1610',
            power: '50W',
            priceTiers: [
                { min: 1, max: 9, price: 12000 },
                { min: 10, max: 99, price: 11500 },
                { min: 100, max: null, price: 11000 }
            ],
            packingSize: { length: 180, width: 120, height: 80 },
            cbm: 1.728,
            volumeWeight: 345.6,
            actualWeight: 280
        },
        {
            id: 'kh-1610-80w',
            series: 'KH-1610',
            model: '1610',
            power: '80W',
            priceTiers: [
                { min: 1, max: 9, price: 14000 },
                { min: 10, max: 99, price: 13500 },
                { min: 100, max: null, price: 13000 }
            ],
            packingSize: { length: 180, width: 120, height: 80 },
            cbm: 1.728,
            volumeWeight: 345.6,
            actualWeight: 290
        },
        {
            id: 'kh-1610-100w',
            series: 'KH-1610',
            model: '1610',
            power: '100W',
            priceTiers: [
                { min: 1, max: 9, price: 16000 },
                { min: 10, max: 99, price: 15500 },
                { min: 100, max: null, price: 15000 }
            ],
            packingSize: { length: 180, width: 120, height: 80 },
            cbm: 1.728,
            volumeWeight: 345.6,
            actualWeight: 300
        }
    ],
    
    /**
     * 默认水冷机数据
     */
    defaultWaterCoolers: [
        { id: 'water-cooler-50w', name: '50W水冷机', price: 800 },
        { id: 'water-cooler-80w', name: '80W水冷机', price: 1000 },
        { id: 'water-cooler-100w', name: '100W水冷机', price: 1200 }
    ],
    
    /**
     * 默认配件数据
     */
    defaultAccessories: [
        { id: 'accessory-laser-tube', name: '激光管', price: 1500 },
        { id: 'accessory-mirror', name: '反射镜', price: 200 },
        { id: 'accessory-lens', name: '聚焦镜', price: 150 },
        { id: 'accessory-power-supply', name: '电源', price: 800 }
    ],
    
    /**
     * 默认其他配件数据
     */
    defaultOtherAccessories: [
        { id: 'other-accessory-chiller', name: '冷水机', price: 2000 },
        { id: 'other-accessory-exhaust-fan', name: '排风扇', price: 300 },
        { id: 'other-accessory-air-compressor', name: '空压机', price: 1500 },
        { id: 'other-accessory-software', name: '软件', price: 1000 },
        { id: 'other-accessory-training', name: '培训', price: 500 },
        { id: 'other-accessory-warranty', name: '保修', price: 800 }
    ],
    
    /**
     * 更新机器选项
     */
    updateMachineOptions: function() {
        const seriesSelect = document.getElementById('seriesSelect');
        if (seriesSelect) {
            // 清空现有选项
            seriesSelect.innerHTML = '<option value="">请选择系列</option>';
            
            // 获取所有唯一的系列
            const seriesSet = new Set(this.defaultMachines.map(machine => machine.series));
            const seriesList = Array.from(seriesSet);
            
            // 添加系列选项
            seriesList.forEach(series => {
                const option = document.createElement('option');
                option.value = series;
                option.textContent = series;
                seriesSelect.appendChild(option);
            });
        }
    },
    
    /**
     * 更新型号选项
     * @param {string} series - 系列名称
     */
    updateModelOptions: function(series) {
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            // 清空现有选项
            modelSelect.innerHTML = '<option value="">请先选择系列</option>';
            modelSelect.disabled = !series;
            
            if (series) {
                // 获取该系列的所有唯一型号
                const modelSet = new Set(this.defaultMachines
                    .filter(machine => machine.series === series)
                    .map(machine => machine.model)
                );
                const modelList = Array.from(modelSet);
                
                // 添加型号选项
                modelSelect.innerHTML = '<option value="">请选择型号</option>';
                modelList.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
            }
            
            // 清空功率选项
            const powerSelect = document.getElementById('powerSelect');
            if (powerSelect) {
                powerSelect.innerHTML = '<option value="">请先选择型号</option>';
                powerSelect.disabled = true;
            }
            
            // 清空水冷机选项
            this.updateWaterCoolerOptions();
            
            // 清空配件选项
            this.updateAccessoryOptions();
        }
    },
    
    /**
     * 更新功率选项
     * @param {string} model - 型号名称
     */
    updatePowerOptions: function(model) {
        const powerSelect = document.getElementById('powerSelect');
        if (powerSelect) {
            // 清空现有选项
            powerSelect.innerHTML = '<option value="">请先选择型号</option>';
            powerSelect.disabled = !model;
            
            if (model) {
                const seriesSelect = document.getElementById('seriesSelect');
                const series = seriesSelect.value;
                
                // 获取该系列和型号的所有功率
                const powerList = this.defaultMachines
                    .filter(machine => machine.series === series && machine.model === model)
                    .map(machine => machine.power);
                
                // 添加功率选项
                powerSelect.innerHTML = '<option value="">请选择功率</option>';
                powerList.forEach(power => {
                    const option = document.createElement('option');
                    option.value = power;
                    option.textContent = power;
                    powerSelect.appendChild(option);
                });
            }
            
            // 清空水冷机选项
            this.updateWaterCoolerOptions();
            
            // 清空配件选项
            this.updateAccessoryOptions();
        }
    },
    
    /**
     * 更新水冷机选项
     */
    updateWaterCoolerOptions: function() {
        const waterCoolerOptions = document.getElementById('waterCoolerOptions');
        if (waterCoolerOptions) {
            waterCoolerOptions.innerHTML = '';
            
            this.defaultWaterCoolers.forEach(waterCooler => {
                const option = document.createElement('div');
                option.className = 'radio-option';
                option.innerHTML = `
                    <input type="radio" name="waterCooler" id="${waterCooler.id}" value="${waterCooler.id}">
                    <label for="${waterCooler.id}">
                        <div class="checkbox-label-wrapper">
                            <span>${waterCooler.name}</span>
                            <span class="accessory-price">¥${waterCooler.price.toFixed(2)}</span>
                        </div>
                    </label>
                `;
                waterCoolerOptions.appendChild(option);
            });
        }
    },
    
    /**
     * 更新配件选项
     */
    updateAccessoryOptions: function() {
        const accessoryOptions = document.getElementById('accessoryOptions');
        if (accessoryOptions) {
            accessoryOptions.innerHTML = '';
            
            this.defaultAccessories.forEach(accessory => {
                const option = document.createElement('div');
                option.className = 'checkbox-option';
                option.innerHTML = `
                    <input type="checkbox" name="accessory" id="${accessory.id}" value="${accessory.id}">
                    <label for="${accessory.id}">
                        <div class="checkbox-label-wrapper">
                            <span>${accessory.name}</span>
                            <span class="accessory-price">¥${accessory.price.toFixed(2)}</span>
                        </div>
                    </label>
                `;
                accessoryOptions.appendChild(option);
            });
        }
        
        // 更新其他配件选项
        this.updateOtherAccessoryOptions();
    },
    
    /**
     * 更新其他配件选项
     */
    updateOtherAccessoryOptions: function() {
        const otherAccessoryOptions = document.getElementById('otherAccessoryOptions');
        if (otherAccessoryOptions) {
            otherAccessoryOptions.innerHTML = '';
            
            this.defaultOtherAccessories.forEach(accessory => {
                const option = document.createElement('div');
                option.className = 'checkbox-option';
                option.innerHTML = `
                    <input type="checkbox" name="otherAccessory" id="${accessory.id}" value="${accessory.id}">
                    <label for="${accessory.id}">
                        <div class="checkbox-label-wrapper">
                            <span>${accessory.name}</span>
                            <span class="accessory-price">¥${accessory.price.toFixed(2)}</span>
                        </div>
                    </label>
                `;
                otherAccessoryOptions.appendChild(option);
            });
        }
    },
    
    /**
     * 选择机器
     * @param {string} power - 功率
     */
    selectMachine: function(power) {
        const seriesSelect = document.getElementById('seriesSelect');
        const modelSelect = document.getElementById('modelSelect');
        
        const series = seriesSelect.value;
        const model = modelSelect.value;
        
        if (series && model && power) {
            this.selectedMachine = this.defaultMachines.find(machine => 
                machine.series === series && 
                machine.model === model && 
                machine.power === power
            );
            
            if (this.selectedMachine) {
                // 更新机器信息显示
                if (window.ui && window.ui.module && window.ui.module.updateMachineInfo) {
                    window.ui.module.updateMachineInfo(this.selectedMachine);
                }
            }
        }
    },
    
    /**
     * 更新选中的配件
     */
    updateSelectedAccessories: function() {
        const checkboxes = document.querySelectorAll('input[name="accessory"]:checked');
        this.selectedAccessories = Array.from(checkboxes).map(checkbox => checkbox.value);
    },
    
    /**
     * 更新选中的其他配件
     */
    updateSelectedOtherAccessories: function() {
        const checkboxes = document.querySelectorAll('input[name="otherAccessory"]:checked');
        this.selectedOtherAccessories = Array.from(checkboxes).map(checkbox => checkbox.value);
    },
    
    /**
     * 计算价格
     */
    calculatePrice: function() {
        let machinePrice = 0;
        let waterCoolerPrice = 0;
        let accessoriesPrice = 0;
        let otherAccessoriesPrice = 0;
        
        // 计算机器价格
        if (this.selectedMachine) {
            const price = this.selectedMachine.priceTiers.find(tier => 
                this.quantity >= tier.min && (tier.max === null || this.quantity <= tier.max)
            )?.price || this.selectedMachine.priceTiers[0].price;
            machinePrice = price * this.quantity;
        }
        
        // 计算水冷机价格
        if (this.selectedWaterCooler) {
            const waterCooler = this.defaultWaterCoolers.find(wc => wc.id === this.selectedWaterCooler);
            if (waterCooler) {
                waterCoolerPrice = waterCooler.price * this.quantity;
            }
        }
        
        // 计算配件价格
        this.selectedAccessories.forEach(accessoryId => {
            const accessory = this.defaultAccessories.find(acc => acc.id === accessoryId);
            if (accessory) {
                accessoriesPrice += accessory.price;
            }
        });
        
        // 计算其他配件价格
        this.selectedOtherAccessories.forEach(accessoryId => {
            const accessory = this.defaultOtherAccessories.find(acc => acc.id === accessoryId);
            if (accessory) {
                otherAccessoriesPrice += accessory.price;
            }
        });
        
        // 计算总价格
        const totalPrice = machinePrice + waterCoolerPrice + accessoriesPrice + otherAccessoriesPrice + 
                          this.internationalShipping + this.domesticShipping + this.otherFees;
        
        // 计算美元价格
        const usdPrice = totalPrice / this.exchangeRate;
        
        // 更新价格显示
        if (window.ui && window.ui.module && window.ui.module.updatePriceDisplay) {
            window.ui.module.updatePriceDisplay(totalPrice, usdPrice);
        }
        
        // 更新费用明细
        if (window.ui && window.ui.module && window.ui.module.updatePriceDetails) {
            window.ui.module.updatePriceDetails({
                machinePrice,
                waterCoolerPrice,
                accessoriesPrice,
                otherAccessoriesPrice,
                internationalShipping: this.internationalShipping,
                domesticShipping: this.domesticShipping,
                otherFees: this.otherFees,
                quantity: this.quantity,
                total: totalPrice
            });
        }
        
        return totalPrice;
    },
    
    /**
     * 保存历史记录
     */
    saveHistory: function() {
        if (window.utils && window.utils.saveToLocalStorage) {
            window.utils.saveToLocalStorage('quoteHistory', this.history);
        }
    },
    
    /**
     * 加载历史记录
     */
    loadHistory: function() {
        if (window.utils && window.utils.getFromLocalStorage) {
            this.history = window.utils.getFromLocalStorage('quoteHistory', []);
        }
        
        // 更新历史记录显示
        if (window.ui && window.ui.module && window.ui.module.updateHistoryList) {
            window.ui.module.updateHistoryList(this.history);
        }
    },
    
    /**
     * 添加历史记录
     */
    addHistory: function() {
        if (!this.selectedMachine) {
            return;
        }
        
        const historyItem = {
            id: window.utils && window.utils.generateUniqueId ? window.utils.generateUniqueId() : Date.now().toString(),
            date: window.utils && window.utils.formatDateTime ? window.utils.formatDateTime(new Date()) : new Date().toLocaleString(),
            total: `¥${this.calculatePrice().toFixed(2)}`,
            details: `${this.selectedMachine.series} ${this.selectedMachine.model} ${this.selectedMachine.power} × ${this.quantity}`
        };
        
        this.history.unshift(historyItem);
        this.saveHistory();
        
        // 更新历史记录显示
        if (window.ui && window.ui.module && window.ui.module.updateHistoryList) {
            window.ui.module.updateHistoryList(this.history);
        }
    },
    
    /**
     * 清空历史记录
     */
    clearHistory: function() {
        this.history = [];
        this.saveHistory();
        
        // 更新历史记录显示
        if (window.ui && window.ui.module && window.ui.module.updateHistoryList) {
            window.ui.module.updateHistoryList(this.history);
        }
        
        // 显示通知
        if (window.ui && window.ui.notification) {
            window.ui.notification.show('历史记录已清空', 'success');
        }
    },
    
    /**
     * 保存模板
     */
    saveTemplates: function() {
        if (window.utils && window.utils.saveToLocalStorage) {
            window.utils.saveToLocalStorage('quoteTemplates', this.templates);
        }
    },
    
    /**
     * 加载模板
     */
    loadTemplates: function() {
        if (window.utils && window.utils.getFromLocalStorage) {
            this.templates = window.utils.getFromLocalStorage('quoteTemplates', []);
        }
    }
};

/**
 * 导出应用模块
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appModule;
} else if (typeof window !== 'undefined') {
    window.app = appModule;
}
