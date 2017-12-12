
function isType(obj) {
    return toString.call(obj) == '[object Number]'
  }
  
  function randIntBetween(start, end) {
      return Math.floor(Math.random() * end) + start  
  }
  
  function randFloatBetween(start, end) {
      return (Math.random() * end) + start  
  }
  
  function formatBytes(bytes) {
      if(bytes < 1024) return {value: bytes, unit: 'b'}
      else if(bytes < 1048576) return {value: bytesToKb(bytes), unit: 'kb'}
      else if(bytes < 1073741824) return {value: bytesToMb(bytes), unit: 'mb'}
      else return {value: bytesToGb(bytes), unit: 'gb'}
  }
  
  function bytesToKb(bytes) {
      return (bytes / 1024).toFixed(3)
  }
  
  function bytesToMb(bytes) {
      return (bytes / 1048576).toFixed(3)
  }
  
  function bytesToGb(bytes) {
      return (bytes / 1073741824).toFixed(3)
  }
  
  var utils = {};
  utils.isType = isType
  utils.randIntBetween = randIntBetween;
  utils.randFloatBetween = randFloatBetween
  utils.formatBytes = formatBytes
  utils.bytesToKb = bytesToKb
  utils.bytesToMb = bytesToMb
  utils.bytesToGb = bytesToGb
  
  module.exports = utils;