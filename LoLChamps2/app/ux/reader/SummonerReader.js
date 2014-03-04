Ext.define('LoLChamps.ux.reader.SummonerReader', {
	extend: 'Ext.data.reader.Json',
	alias: 'reader.summonerreader',
	
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
        
        // Custom Restructuring for Summoner
        var summonerData = data;
        var items = [];
        for (var id in summonerData) {
        	items.push(summonerData[id]);
        }
        
        data = items;

        return data;
	}
});