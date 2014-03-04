Ext.define('LoLChamps.model.SummonerIDModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [			
		    {
				name: 'id'
			}, {
				name: 'name'
			}, {
				name: 'profileIconId'
			}, {
				name: 'revisionDate'
			}, {
				name: 'summonerLevel'
			}
		]
	}
});