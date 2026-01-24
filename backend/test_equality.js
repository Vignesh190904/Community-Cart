
const mongoose = require('mongoose');

const idStr = '507f1f77bcf86cd799439011';
const objId = new mongoose.Types.ObjectId(idStr);

console.log('Strict equality (objId === idStr):', objId === idStr);
console.log('Loose equality (objId == idStr):', objId == idStr);
console.log('String convert strict equality (objId.toString() === idStr):', objId.toString() === idStr);
console.log('String wrapper strict equality (String(objId) === idStr):', String(objId) === idStr);
