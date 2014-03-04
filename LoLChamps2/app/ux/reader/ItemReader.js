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
        var enchantments = ['3255', '3256', '3257', '3258', '3259', '3260', '3261', '3262', '3263',
                            '3264', '3265', '3266', '3267', '3268', '3269', '3270', '3271', '3272',
                            '3273', '3274', '3275', '3276', '3277', '3278', '3279', '3280', '3281',
                            '3282', '3283', '3284'];
        for (var id in itemData) {
        	if(enchantments.indexOf(id) != -1) {
        		continue;
        	}
        	itemData[id].id = id;
        	if(id == '3043' || id == '3048' || id == '3290') {
        		itemData[id].name = itemData[id].name + ' (Crystal Scar)';
        	}
        	if(id == '3009' || id == '3020' || id == '3047' || id == '3111' ||
        	   id == '3117' || id == '3158') {
        		itemData[id].into = ['3254', '3253', '3252', '3251', '3250']
        	}
        	items.push(itemData[id]);
        }
        data.data = items;

        return data;
	}
});