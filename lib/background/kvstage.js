/*
* KValidator Bulk data staging module
* author: erric rapsing
*/
module.exports = KVStage

const fs = require('fs')
const path = require('path')
/*
* init: Stage
* @param file_path String absolute path of bulk file
* @param szchunk Number array index limit per chunk, default 1M data per chunk
* @param separator String separator for each data in bulk file, default ','
*/
function KVStage(szchunk, separator) {
	this.chunk = szchunk || 1000000
	this.separator = separator || ','
}

KVStage.prototype.read = function(filePath) {
	this.chunkName = path.parse(filePath).name + '-'
	this.filePath = path.resolve(filePath)
};