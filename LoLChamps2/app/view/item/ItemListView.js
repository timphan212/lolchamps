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
				id: 'itemlistsearch',
				placeHolder: 'Search',
				flex: '1'
			}, {
					xtype: 'selectfield',
					itemId: 'itemtagselect',
					ui: 'action',
					flex: '1',
					defaultPhonePickerConfig: {
						listeners: {
							delegate: 'button',
							tap: function() {
								Ext.getCmp('navigationbar').show();
							}
						}
					},
					options: [
					     {text: 'All', value: 'all'},
					     {text: 'Ability Power', value: 'SpellDamage'},
					     {text: 'Armor', value: 'Armor'},
					     {text: 'Attack Speed', value: 'AttackSpeed'},
					     {text: 'Boots', value: 'Boots'},
					     {text: 'Consumable', value: 'Consumable'},
					     {text: 'Cooldown Reduction', value: 'CooldownReduction'},
					     {text: 'Critical Strike', value: 'CriticalStrike'},
					     {text: 'Damage', value: 'Damage'},
					     {text: 'Gold Income', value: 'GoldPer'},
					     {text: 'Health', value: 'Health'},
					     {text: 'Health Regen', value: 'HealthRegen'},
					     {text: 'Life Steal', value: 'LifeSteal'},
					     {text: 'Magic Resist', value: 'SpellBlock'},
					     {text: 'Mana', value: 'Mana'},
					     {text: 'Mana Regen', value: 'ManaRegen'},
					     {text: 'Other Movement', value: 'NonbootsMovement'},
					     {text: 'Spell Vamp', value: 'SpellVamp'},
					     {text: 'Tenacity', value: 'Tenacity'},
					     {text: 'Vision & Trinkets', value: 'Vision'}
					]
				}]
		}, {
			xtype: 'panel',
			itemId: 'itemlistpanel',
			flex: 1,
			scrollable: 'vertical'
		}]
	}
});