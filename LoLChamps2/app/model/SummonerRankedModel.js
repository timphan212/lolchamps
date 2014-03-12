Ext.define('LoLChamps.model.SummonerRankedModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [			
		    {
				name: 'isFreshBlood'
			}, {
				name: 'isHotStreak'
			}, {
				name: 'isInactive'
			}, {
				name: 'isVeteran'
			}, {
				name: 'lastPlayed'
			}, {
				name: 'leagueName'
			}, {
				name: 'leaguePoints'
			}, {
				name: 'miniSeries'
			}, {
				name: 'playerOrTeamId'
			}, {
				name: 'playerOrTeamName'
			}, {
				name: 'queueType'
			}, {
				name: 'rank'
			}, {
				name: 'tier'
			}, {
				name: 'wins'
			}
		]
	}
});