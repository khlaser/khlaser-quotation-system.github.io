/**
 * utils.js - 工具函数模块
 * 
 * 功能：
 * - 提供各种实用工具函数，支持应用的核心功能
 * - 包含价格格式化、数字解析、日期处理等通用功能
 * - 提供本地存储操作、表单验证等辅助功能
 * - 实现防抖、节流等性能优化函数
 * 
 * 主要函数：
 * - formatPrice：价格格式化
 * - calculatePriceByTier：根据数量和价格阶梯计算价格
 * - parseNumber：数字解析
 * - extractPowerFromString：从字符串中提取功率数值
 * - generateUniqueId：生成唯一ID
 * - formatDateTime：格式化日期时间
 * - deepClone：深拷贝对象
 * - calculateVolumeWeight：计算体积重量
 * - calculateCBM：计算CBM（立方米）
 * - validateEmail：验证邮箱格式
 * - validatePhone：验证手机号格式
 * - validateZipCode：验证邮编格式
 * - getFromLocalStorage：从本地存储获取数据
 * - saveToLocalStorage：存储数据到本地存储
 * - removeFromLocalStorage：从本地存储删除数据
 * - clearLocalStorage：清空本地存储
 * - debounce：防抖函数
 * - throttle：节流函数
 */

/**
 * 格式化价格为货币格式
 * @param {number} price - 价格数值
 * @param {string} currency - 货币类型，默认为CNY
 * @returns {string} 格式化后的价格字符串
 */
const formatPrice = (price, currency = 'CNY') => {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    
    if (currency === 'USD') {
        return `$${price.toFixed(2)}`;
    } else {
        return `¥${price.toFixed(2)}`;
    }
};

/**
 * 根据数量和价格阶梯计算价格
 * @param {number} quantity - 数量
 * @param {Array} priceTiers - 价格阶梯数组，格式为[{min: 1, max: 9, price: 100}, {min: 10, max: 99, price: 90}, {min: 100, max: null, price: 80}]
 * @returns {number} 计算后的价格
 */
const calculatePriceByTier = (quantity, priceTiers) => {
    if (!Array.isArray(priceTiers) || priceTiers.length === 0) {
        return 0;
    }
    
    quantity = parseInt(quantity) || 1;
    
    // 找到匹配的价格阶梯
    for (const tier of priceTiers) {
        if (quantity >= tier.min && (tier.max === null || quantity <= tier.max)) {
            return tier.price;
        }
    }
    
    // 如果没有找到匹配的阶梯，返回最低价格
    return priceTiers[priceTiers.length - 1].price;
};

/**
 * 解析数字，处理空值和非数字情况
 * @param {string|number} value - 要解析的值
 * @param {number} defaultValue - 默认值，默认为0
 * @returns {number} 解析后的数字
 */
const parseNumber = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * 从字符串中提取功率数值
 * @param {string} powerString - 功率字符串，例如"50W"、"100W"
 * @returns {number} 提取的功率数值
 */
const extractPowerFromString = (powerString) => {
    if (!powerString || typeof powerString !== 'string') {
        return 0;
    }
    
    const match = powerString.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
};

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期时间字符串
 */
const formatDateTime = (date) => {
    if (!(date instanceof Date)) {
        date = new Date();
    }
    
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    
    return clonedObj;
};

/**
 * 计算体积重量
 * @param {number} length - 长度（cm）
 * @param {number} width - 宽度（cm）
 * @param {number} height - 高度（cm）
 * @returns {number} 体积重量（kg）
 */
const calculateVolumeWeight = (length, width, height) => {
    if (!length || !width || !height) {
        return 0;
    }
    
    // 体积重量计算公式：长×宽×高÷5000
    return (length * width * height) / 5000;
};

/**
 * 计算CBM（立方米）
 * @param {number} length - 长度（cm）
 * @param {number} width - 宽度（cm）
 * @param {number} height - 高度（cm）
 * @returns {number} CBM值
 */
const calculateCBM = (length, width, height) => {
    if (!length || !width || !height) {
        return 0;
    }
    
    // 转换为立方米：长×宽×高÷1000000
    return (length * width * height) / 1000000;
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效的邮箱格式
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 验证手机号格式
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否为有效的手机号格式
 */
const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * 验证邮编格式
 * @param {string} zipCode - 邮编
 * @returns {boolean} 是否为有效的邮编格式
 */
const validateZipCode = (zipCode) => {
    if (!zipCode || typeof zipCode !== 'string') {
        return false;
    }
    
    // 简单的邮编验证，不同国家格式不同
    return zipCode.length >= 4 && zipCode.length <= 10;
};

/**
 * 从本地存储获取数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 获取的数据或默认值
 */
const getFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error getting data from localStorage:', error);
        return defaultValue;
    }
};

/**
 * 存储数据到本地存储
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值
 * @returns {boolean} 是否存储成功
 */
const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        return false;
    }
};

/**
 * 从本地存储删除数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否删除成功
 */
const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data from localStorage:', error);
        return false;
    }
};

/**
 * 清空本地存储
 * @returns {boolean} 是否清空成功
 */
const clearLocalStorage = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * 工具函数模块
 */
const utils = {
    formatPrice,
    calculatePriceByTier,
    parseNumber,
    extractPowerFromString,
    generateUniqueId,
    formatDateTime,
    deepClone,
    calculateVolumeWeight,
    calculateCBM,
    validateEmail,
    validatePhone,
    validateZipCode,
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
    clearLocalStorage,
    debounce,
    throttle
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
} else if (typeof window !== 'undefined') {
    window.utils = utils;
}
