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
		        		          {text: 'Chinese (China)', value: 'zh_CN'},
		        		          {text: 'Chinese (Taiwan)', value: 'zh_TW'},
		        		          {text: 'French', value: 'fr_FR'},
		        		          {text: 'German', value: 'de_DE'},
		        		          {text: 'Greek', value: 'el_GR'},
		        		          {text: 'Indonesian', value: 'id_ID'},
		        		          {text: 'Italian', value: 'it_IT'},
		        		          {text: 'Korean', value: 'ko_KR'},
		        		          {text: 'Polish', value: 'pl_PL'},
		        		          {text: 'Portugese', value: 'pt_BR'},
		        		          {text: 'Romanian', value: 'ro_RO'},
		        		          {text: 'Russian', value: 'ro_RO'},
		        		          {text: 'Spanish', value: 'es_ES'},
		        		          {text: 'Thai', value: 'th_TH'},
		        		          {text: 'Turkish', value: 'tr_TR'},
		        		          {text: 'Vietnamese', value: 'vn_VN'}
		        		]
		        	}
		        ]
			}
		]
	}
});