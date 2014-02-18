Ext.define('LoLChamps.controller.TitleBarController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'titlebarcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar',
			ChampInfoBackBtn: '#champinfoback'
		},
		control: {
			ChampListView: {
				show: 'onChampInfoHide'
			},
			ChampInfoView: {
				show: 'onChampInfoShow',
				hide: 'onChampInfoHide'
			},
			ChampInfoBackBtn: {
				tap: 'onChampBackBtnTap'
			}
		}
	},
	
	onChampInfoShow: function() {
		this.getChampInfoBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPION_SEL_TXT);
	},
	
	onChampInfoHide: function() {
		this.getChampInfoBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPIONS_TXT);
	},
	
	onChampBackBtnTap: function() {
		LoLChamps.app.showView('champlistview');
		LoLChamps.app.removeUrl();
	}
	
	
});