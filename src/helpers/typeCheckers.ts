export const isFunction = (func: any) => func && {}.toString.call(func) === '[object Function]'
export const isString = (string: any) => typeof string === 'string'
