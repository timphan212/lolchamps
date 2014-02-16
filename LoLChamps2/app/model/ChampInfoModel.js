Ext.define('LoLChamps.model.ChampInfoModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [ {
				name: 'id'
			}, {
				name: 'tags'
			}, {
				name: 'stats'
			}, {
				name: 'enemytips'
			}, {
				name: 'recommended'
			}, {
				name: 'image'
			}, {
				name: 'spells'
			}, {
				name: 'blurb'
			}, {
				name: 'allytips'
			}, {
				name: 'lore'
			}, {
				name: 'info'
			}, {
				name: 'title'
			}, {
				name: 'passive'
			}, {
				name: 'partype'
			}, {
				name: 'key'
			}, {
				name: 'skins'
			}
		]
	}
});