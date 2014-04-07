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
		        title: 'Settings',
		        itemId: 'fieldselect',
		        items: [
		        	{
		        		xtype: 'selectfield',
		        		label: 'Region',
		        		itemId: 'regionselect',
		        		options: [
		        		          {text: 'NA', value: 'na'},
		        		          {text: 'BR', value: 'br'},
		        		          {text: 'KR', value: 'kr'},
		        		          {text: 'EUNE', value: 'eune'},
		        		          {text: 'EUW', value: 'euw'},
		        		          {text: 'LAN', value: 'lan'},
		        		          {text: 'LAS', value: 'las'},
		        		          {text: 'OCE', value: 'oce'}
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