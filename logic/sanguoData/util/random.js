/////////////////////////////////////////////////////////////////////////////////////////
//															Random																						
/////////////////////////////////////////////////////////////////////////////////////////

var Random = function(seed) {
	this.seed = seed;
	this.refresh();
};

var handler = Random.prototype;

handler.mask = 0xffffffff;

handler.get = function() {
	var mask = this.mask;
	this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & mask;
	this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & mask;
	var result = ((this.m_z << 16) + this.m_w) & mask;
	result /= 4294967296;
	return result + 0.5;
};

handler.refresh = function() {
	this.m_w = this.seed || 123456789;
	this.m_z = 987654321;
};

handler.getByRange = function(range) {
	var min = range[0],
		max = range[1];
	return parseInt(this.get() * (max - min + 1)) + min;
};

module.exports = Random;