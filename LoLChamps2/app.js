Ext.application({
    name: 'LoLChamps',

    requires: [
        'Ext.MessageBox'
    ],
    controllers: [
        'ChampListController', 'NavigationBarController', 'TitleBarController'
    ],
    models: [
        'ChampListModel'
    ],
    stores: [
        'ChampListStore'
    ],
    views: [
        'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
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
    champViewOrder: ['champlistview', 'champinfoview'],
    champRoute: 'champlistview',
    summonerRoute: 'summonerview',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        
        // Add Views
        this.addViews();
        this.setUrl('champlistview');
    },
    
    setUrl: function(newUrl) {
    	if (newUrl != this.getCurrentView()) {
    		this.routes.push(newUrl);
        	this.getApplication().getHistory().add(new Ext.app.Action({
        		url: newUrl
        	}), true);
        	this.updateLastSpecificRoute(newUrl);
    	}
    	this.showView(newUrl);
    },
    
    addViews: function() {
    	var viewNames = this.views;
    	for (var index in viewNames) {
    		Ext.Viewport.add(Ext.create(viewNames[index]));
    	}
    },
    
    removeUrl: function() {
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
    	//TODO: check menus when we put menus in
    	if (view == this.getCurrentView) {
    		return;
    	}
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
    	this.routes = new Array();
    	if (view.search('champ') > -1) {
    		for (var index in this.champViewOrder) {
    			this.routes.push(this.champViewOrder[index]);
    			if (view == this.champViewOrder[index]) {
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
    
    // Global Variable Strings
    CHAMPIONS_TXT: "Champions",
    CHAMPION_SEL_TXT: ""
    
});
