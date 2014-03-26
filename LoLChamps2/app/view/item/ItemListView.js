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
				placeHolder: 'Search',
				flex: '4'
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