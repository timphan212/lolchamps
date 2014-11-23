Ext.define('LoLChamps.ux.Key', {
	singleton: true,
	alternateClassName: 'KeyObject',
	
	apiKey: "26700744-69e8-499f-88ad-02d6f17bbdac",
	
	getApiKey: function() {
		return this.apiKey;
	},

	setApiKey: function(newKey) {
		this.apiKey = newKey;
	}
});