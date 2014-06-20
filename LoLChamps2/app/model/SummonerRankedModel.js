Ext.define('LoLChamps.model.SummonerRankedModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
		    {
		    	name: 'queue'
		    }, {
		    	name: 'name'
		    }, {
		    	name: 'entries'
		    }, {
		    	name: 'tier'
		    }
		]
	}
});