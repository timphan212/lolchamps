Ext.define('LoLChamps.model.SummonerSummaryModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [			
		    {
				name: 'aggregatedStats'
			}, {
				name: 'losses'
			}, {
				name: 'modifyDate'
			}, {
				name: 'playerStatSummaryType'
			}, {
				name: 'wins'
			}
		]
	}
});