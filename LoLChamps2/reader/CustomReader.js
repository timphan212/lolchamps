Ext.define('CustomReader', {
	extend: 'Ext.data.reader.Json',
	alias: 'reader.customreader',
	
	getResponseData : function(response) {
		var data = this.callParent([response]);
		
		console.log(data);
		
		return data;
	}
});