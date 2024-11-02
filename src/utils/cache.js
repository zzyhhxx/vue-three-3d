export function setLocalCache(key, data, exdays) {
  var expire = '';//过期时间
	var timestamp = +new Date;
	if(exdays && Number(exdays)){//设置过期时间(天)，不设置则为永久
		expire = timestamp + Number(exdays) * 24 * 60 * 60 * 1000;
	}
	var value = {
		expire : expire,
		data : data
	}
	localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalCache(key) {
  var timestamp = +new Date;//当前时间戳
	var result = localStorage.getItem(key);
	if(!result) return '';
	result = JSON.parse(result);

	//有设置过期时间，并且已过期
	if(result['expire'] && timestamp > result['expire']){
		removeLocalCache(key);
		return '';
	}
	if(!result['data']) return '';
	return result['data'];
}

export function removeLocalCache(key) {
  localStorage.removeItem(key);
}
