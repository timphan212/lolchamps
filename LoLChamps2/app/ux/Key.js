Ext.define('LoLChamps.ux.Key', {
	singleton: true,
	alternateClassName: 'KeyObject',
	
	apiKey: "e5dc0d96-15eb-4b34-bb2b-c33dd248bed7",
	
	getApiKey: function() {
		return this.apiKey;
	},

	setApiKey: function(newKey) {
		this.apiKey = newKey;
	}
});