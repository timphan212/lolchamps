Ext.application({
    name: 'LoLChamps',

    requires: [
        'Ext.MessageBox', 'LoLChamps.ux.reader.ItemReader', 'LoLChamps.ux.reader.SummonerReader', 'LoLChamps.ux.reader.ChampReader'
    ],
    controllers: [
        'ChampController', 'NavigationController', 'TitleBarController', 'ItemListController', 'SummonerController'
    ],
    models: [
        'ChampListModel', 'ChampInfoModel', 'ItemIDModel', 'SummonerIDModel', 'SummonerSummaryModel', 'SummonerRankedModel'
    ],
    stores: [
        'ChampListStore', 'ChampInfoStore', 'ItemListStore', 'SummonerIDStore', 'SummonerSummaryStore', 'SummonerRankedStore'
    ],
    views: [
        'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView',
        'summoner.SummonerInfoView', 'summoner.SummonerTapView', 'Settings'
    ],
    
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },
    
    //for future url routing with hardware back
    routes: new Array(),
    
    champRoute: 'champlistview',
    champViewOrder: ['champlistview', 'champinfoview'],
    
    itemRoute: 'itemlistview',
    itemViewOrder: ['itemlistview', 'iteminfoview'],
    
    summonerRoute: 'summonerinfoview',
    summonerViewOrder: ['summonerinfoview', 'summonertapview'],

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        
        // Add Views
        this.addViews();
        this.setUrl('champlistview');
        this.getController('NavigationController').onChampListBtnTap();
    },
    
    setUrl: function(newUrl) {
    	this.showView(newUrl);
    	if (newUrl != this.getCurrentView()) {
    		this.routes.push(newUrl);
        	this.getApplication().getHistory().add(new Ext.app.Action({
        		url: newUrl
        	}), true);
        	this.updateLastSpecificRoute(newUrl);
    	}
    },
    
    addViews: function() {
    	var viewNames = this.views;
    	for (var index in viewNames) {
    		Ext.Viewport.add(Ext.create(viewNames[index]));
    	}
    },
    
    removeUrl: function() {
    	if (!Ext.Msg.isHidden()) {
    		Ext.Msg.hide();
    		return;
    	}
    	if (this.routes.length > 1) {
    		var viewObj = Ext.getCmp(this.getCurrentView());
    		if (viewObj) {
    			viewObj.hide();
    		}
    		this.routes.pop();
    		this.updateLastSpecificRoute(this.getCurrentView());
    	}
    	this.showView(this.getCurrentView());
    },
    
    showView: function(view) {
    	var curView = Ext.getCmp(this.getCurrentView());
    	if (curView) {
    		curView.hide();
    	}
    	var newView = Ext.getCmp(view);
    	if (newView) {
    		newView.show();
    	}
    },
    
    getCurrentView: function() {
    	return this.routes[this.routes.length-1];
    },
    
    resetRoute: function(view) {
    	if (Ext.getCmp(this.getCurrentView())) {
    		Ext.getCmp(this.getCurrentView()).hide();
    	}
    	this.routes = new Array();
    	if (view.search('champ') > -1) {
    		for (var index in this.champViewOrder) {
    			this.routes.push(this.champViewOrder[index]);
    			if (view == this.champViewOrder[index]) {
    				this.showView(view);
    				break;
    			}
    		}
    	} else if (view.search('item') > -1) {
    		for (var index in this.itemViewOrder) {
    			this.routes.push(this.itemViewOrder[index]);
    			if (view == this.itemViewOrder[index]) {
    				break;
    			}
    		}
    	} else if (view.search('summoner') > -1) {
    		for (var index in this.summonerViewOrder) {
    			this.routes.push(this.summonerViewOrder[index]);
    			if (view == this.summonerViewOrder[index]) {
    				break;
    			}
    		}
    	}
    },
    
    updateLastSpecificRoute: function(view) {
    	if (view.search('champ') > -1) {
    		this.champRoute = view;
    	} else if (view.search('summoner') > -1) {
    		this.summonerRoute = view;
    	} else if (view.search('item') > -1) {
    		this.itemRoute = view;
    	}
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },
    
//	DictionaryMapNames: function(text) {
//		var dictionary = {
//			'FiddleSticks': 'Fiddlesticks',
//			'DrMundo': 'Dr. Mundo',
//			'MonkeyKing': 'Wukong',
//			'JarvanIV': 'Jarvan IV',
//			'KogMaw': "Kog'Maw",
//			'LeeSin': 'Lee Sin',
//			'MasterYi': 'Master Yi',
//			'MissFortune': 'Miss Fortune',
//			'TwistedFate': 'Twisted Fate',
//			'XinZhao': 'Xin Zhao',
//			'Velkoz': "Vel'Koz"
//		};
//		if (dictionary[text]) {
//			return dictionary[text];
//		} else {
//			return text;
//		}
//	},
    
    // Global Application Variable Strings
	API_URL: "https://prod.api.pvp.net/api/lol/",
	CHAMPION_DATA: "",
    CHAMPION_ID: "",
    CHAMPION_SEL_TXT: "",
    CHAMPIONS_TXT: "Champions",
    ENTER_NAME: 'Summoner Name',
    ITEM_ID: "",
    ITEM_SEL_TXT: "",
    ITEMS_TXT: "Items",
    LOCALE: "en_US",
    MODE_TXT: "",
    SUBMIT_TXT: 'Submit',
    SUMMONER_ID: "",
    SUMMONER_NAME: "",
    SUMMONER_TXT: 'Summoner',
    SEASON: 'SEASON4',
    REGION: 'na',
    SEARCH: 'Search',
    VERSION: '4.5.4'
    
});
