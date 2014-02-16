Ext.define('LoLChamps.model.ChampListModel', {
	extend: 'Ext.data.Model',
	config: {
		belongsTo: 'Champions',
		fields: [
			{
				name: 'botMmEnabled',
				type: 'boolean'
			}, {
				name: 'defenseRank',
				type: 'int'
			}, {
				name: 'attackRank',
				type: 'int'
			}, {
				name: 'id',
				type: 'long'
			}, {
				name: 'rankedPlayEnabled',
				type: 'boolean'
			}, {
				name: 'name',
				type: 'string'
			}, {
				name: 'botEnabled',
				type: 'boolean'
			}, {
				name: 'difficultyRank',
				type: 'int'
			}, {
				name: 'active',
				type: 'boolean'
			}, {
				name: 'freeToPlay',
				type: 'boolean'
			}, {
				name: 'magicRank',
				type: 'int'
			}
		]
	}
});