Ext.define('LoLChamps.ux.reader.ItemReader', {
	extend: 'Ext.data.reader.Json',
	alias: 'reader.itemreader',
	
	getResponseData : function(response) {
		var responseText = response;

        // Handle an XMLHttpRequest object
        if (response && response.responseText) {
            responseText = response.responseText;
        }

        // Handle the case where data has already been decoded
        if (typeof responseText !== 'string') {
            return responseText;
        }

        var data;
        try {
            data = Ext.decode(responseText);
        }
        catch (ex) {
            /**
             * @event exception Fires whenever the reader is unable to parse a response.
             * @param {Ext.data.reader.Xml} reader A reference to this reader.
             * @param {XMLHttpRequest} response The XMLHttpRequest response object.
             * @param {String} error The error message.
             */
            this.fireEvent('exception', this, response, 'Unable to parse the JSON returned by the server: ' + ex.toString());
            Ext.Logger.warn('Unable to parse the JSON returned by the server: ' + ex.toString());
        }
        //<debug>
        if (!data) {
            this.fireEvent('exception', this, response, 'JSON object not found');

            Ext.Logger.warn('JSON object not found');
        }
        //</debug>
        
        // Custom Restructuring for Item List
        var itemData = data.data;
        var items = [];
        
        for (var id in itemData) {
        	itemData[id].id = id;
        	
        	//Help differentiate between crystal scar/summoner rift items
        	if(id == '3043' || id == '3048' || id == '3290' || id == '3450') {
        		itemData[id].name += ' (Dominion)';
        	}
        	//Format bonetooth stuff
        	if(id == '3166') {
        		itemData[id].into = ['3167', '3168', '3169', '3171', '3175'];
        	}
        	else if(id == '3169') {
        		itemData[id].into = [];
        	}
        	else if(id == '3175') {
        		itemData[id].from = [];
        	}
        	else if(id == '3405') {
        		itemData[id].into = ['3406', '3407', '3408', '3409', '3410'];
        	}
        	else if(id == '3411') {
        		itemData[id].into = ['3412', '3413', '3414', '3415', '3416'];
        	}
        	else if(id == '3417') {
        		itemData[id].into = ['3418', '3419', '3420', '3421', '3422'];
        	}
        	else if(id == '3450') {
        		itemData[id].into = ['3451', '3452', '3453', '3454', '3455'];
        	}
        	//Format boots stuff
        	else if(id == '3006') {
        		itemData[id].into = ['3250', '3251', '3252', '3253', '3254'];
        	}
        	else if(id == '3020') {
        		itemData[id].into = ['3255', '3256', '3257', '3258', '3259'];
        	}
        	else if(id == '3047') {
        		itemData[id].into = ['3260', '3261', '3262', '3263', '3264'];
        	}
        	else if(id == '3111') {
        		itemData[id].into = ['3265', '3266', '3267', '3268', '3269'];
        	}
        	else if(id == '3117') {
        		itemData[id].into = ['3270', '3271', '3272', '3273', '3274'];
        	}
        	else if(id == '3158') {
        		itemData[id].into = ['3275', '3276', '3277', '3278', '3279'];
        	}
        	else if(id == '3009') {
        		itemData[id].into = ['3280', '3281', '3282', '3283', '3284'];
        	}
        	items.push(itemData[id]);
        }
        data.data = items;

        return data;
	}
});