
/**
 * Represents the structure of an item in the API response.
 * @typedef {Object} ApiResponseItem
 * @property {string} key - The key of the item.
 * @property {string} name - The name of the item.
 * @property {number} level - The level of the item.
 * @property {?string} parent - The parent of the item (optional).
 * @property {string} source - The source of the item.
 */


/**
 * Represents a category in the API response.
 * @typedef {Object} ApiResponseCategory
 * @property {string} category - The category of the response.
 * @property {string} icon - The icon associated with the category.
 * @property {ApiResponseItem[]} items - The list of items in the category.
 * @property {string} type - The type of the response.
 */
