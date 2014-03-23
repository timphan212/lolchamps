Ext.define('LoLChamps.view.Settings', {
	extend: 'Ext.Panel',
	requires: [
	   	    'Ext.tab.Panel'
	   	],
	xtype: 'settingsview',
	id: 'settingsview',
	config: {
		layout: 'vbox',
		items: [
		    {
		        xtype: 'fieldset',
		        itemId: 'fieldselect',
		        items: [
		        	{
		        		xtype: 'selectfield',
		        		label: 'Season',
		        		itemId: 'seasonselect',
		        		options: [
		        		          {text: '4', value: 'SEASON4'},
		        		          {text: '3', value: 'SEASON3'}
		        		]
		        	}, 
		        	{
		        		xtype: 'selectfield',
		        		label: 'Region',
		        		itemId: 'regionselect',
		        		options: [
		        		          {text: 'NA', value: 'na'},
		        		          {text: 'BR', value: 'br'},
		        		          {text: 'EUNE', value: 'eune'},
		        		          {text: 'EUW', value: 'euw'},
		        		          {text: 'KR', value: 'kr'},
		        		          {text: 'LAN', value: 'lan'},
		        		          {text: 'LAS', value: 'las'},
		        		          {text: 'OCE', value: 'oce'},
		        		          {text: 'RU', value: 'ru'},
		        		          {text: 'TR', value: 'tr'}
		        		]
		        	},
		        	{
		        		xtype: 'selectfield',
		        		label: 'Locale',
		        		itemId: 'localeselect',
		        		options: [
		        		          {text: 'English', value: 'en_US'},
		        		          {text: 'Spanish', value: 'es_ES'},
		        		          {text: 'French', value: 'fr_FR'},
		        		          {text: 'German', value: 'de_DE'},
		        		          {text: 'Italian', value: 'it_IT'},
		        		          {text: 'Polish', value: 'pl_PL'},
		        		          {text: 'Korean', value: 'ko_KR'},
		        		          {text: 'Russian', value: 'ro_RO'},
		        		          {text: 'Greek', value: 'el_GR'},
		        		          {text: 'Portugese', value: 'pt_BR'}
		        		]
		        	}
		        ]
			}
		]
	}
});