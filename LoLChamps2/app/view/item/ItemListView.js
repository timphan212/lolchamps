Ext.define('LoLChamps.view.item.ItemListView', {
	extend: 'Ext.Container',
	requires: [
	    'Ext.form.FieldSet', 'Ext.field.Search', 'Ext.field.Select'
	],
	xtype: 'itemlistview',
	id: 'itemlistview',
	config: {
		layout: 'vbox',
		items: [{
			xtype: 'fieldset',
			layout: 'hbox',
			height: '48px',
			items: [{
				xtype: 'searchfield',
				itemId: 'itemlistsearch',
				placeHolder: LoLChamps.app.SEARCH,
				flex: '4',
				listeners: {
					keyup: function(field, e, eOpts) {
						if (Ext.getStore('itemliststore')) {
							Ext.getStore('itemliststore').clearFilter();
							var regex = new RegExp(this.getValue(), 'i');
							Ext.getStore('itemliststore').filter('name', regex);
						}
					}
				}
			}, {
					xtype: 'selectfield',
					itemId: 'itemtagselect',
					flex: '1',
					ui: 'action',
					options: [
					     {text: 'All', value: 'all'},
					     {text: 'Consumable', value: 'Consumable'},
					     {text: 'Gold Income', value: 'GoldPer'},
					     {text: 'Vision & Trinkets', value: 'Vision'},
					     {text: 'Health', value: 'Health'},
					     {text: 'Armor', value: 'Armor'},
					     {text: 'Magic Resist', value: 'SpellBlock'},
					     {text: 'Health Regen', value: 'HealthRegen'},
					     {text: 'Tenacity', value: 'Tenacity'},
					     {text: 'Damage', value: 'Damage'},
					     {text: 'Critical Strike', value: 'CriticalStrike'},
					     {text: 'Attack Speed', value: 'AttackSpeed'},
					     {text: 'Life Steal', value: 'LifeSteal'},
					     {text: 'Ability Power', value: 'SpellDamage'},
					     {text: 'Cooldown Reduction', value: 'CooldownReduction'},
					     {text: 'Spell Vamp', value: 'SpellVamp'},
					     {text: 'Mana', value: 'Mana'},
					     {text: 'Mana Regen', value: 'ManaRegen'},
					     {text: 'Boots', value: 'Boots'},
					     {text: 'Other Movement', value: 'NonbootsMovement'}
					],
					listeners: {
						change: function(field, newValue, oldValue, eOpts) {
							if(this.getValue() === 'all') {
								Ext.getStore('itemliststore').clearFilter();
							}
							else {
							    if(Ext.getStore('itemliststore')) {
							    	var itemStore = Ext.getStore('itemliststore').getData();
							    	var count = 0;
							    	var nameArr = [];
							    	Ext.getStore('itemliststore').clearFilter();
							    	while(itemStore.getAt(count) != null) {
							    		if(itemStore.getAt(count).getData().tags != null) {
							    			for(var i = 0; i < itemStore.getAt(count).getData().tags.length; i++) {
							    				if(itemStore.getAt(count).getData().tags[i] == this.getValue()) {
							    					nameArr.push(itemStore.getAt(count).getData().name);
							    				}
							    			}
							    		}
							    		count++;
							    	}
							    	Ext.getStore('itemliststore').filter(Ext.create('Ext.util.Filter', {
							    		filterFn: function(item) {
							    			return nameArr.some(function(name) { return name === item.get('name')});
							    			}
							    	}));
							    }
							}
						}
					}
				}]
		}, {
			xtype: 'panel',
			itemId: 'itemlistpanel',
			flex: 1
		}]
	}
});