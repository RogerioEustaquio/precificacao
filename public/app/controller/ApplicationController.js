Ext.define('App.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    requires: [
        
    ],

    control: {
        // '#mastermenu > menuitem': {
        //     click: function(item){
        //         console.log(item)
        //     }
        // }
    },

    routes: {
        'home': { action: 'homeAction' },
        'pvsolicitacaoalteracao': { action: 'pvsolicitacaoalteracaoAction' },
        'pvsolicitacaocadastro': { action: 'pvsolicitacaocadastroAction' }
    },
    
    getViewport: function(){
        return App.getApplication().getMainView();
    },
    
    addOrActiveCard: function(xtype){
        var viewport = this.getViewport(),
            viewportCard = viewport.down('#applicationcard');
        
        var page = viewportCard.down(xtype);
        if(!page){
            page = viewportCard.add({ xtype: xtype });
        }
        
        viewportCard.setActiveItem(page);
    },
    
    init: function() {
        var me = this;

        App.app.on('menumasterclick', function(item){
            me.redirectTo(item);
        });

        // Se não tiver logado
        me.mainAction();
    },
    
    mainAction: function(){
        var me = this,
            viewport = me.getViewport();
        
        if(viewport){
            viewport.add({
                itemId: 'applicationtabs',
                region: 'center',
                xtype: 'tabpanel',
                layout: 'fit'
            });
        }
    },

    homeAction: function(){
        var me = this,
            viewport = me.getViewport();

            
    },
    
    pvsolicitacaoalteracaoAction: function(){
        var me = this;
        me.addMasterTab('pvsolicitacaoalteracaomain');
    },

    pvsolicitacaocadastroAction: function(){
        var me = this;
        me.addMasterTab('pvsolicitacaocadastromain');
    },

    addMasterTab: function(xtype){
        var me = this,
            viewport = me.getViewport(),
            viewportTabs = viewport.down('#applicationtabs'),
            tab = viewportTabs.down(xtype);

        if(!tab){
            tab = viewportTabs.add({
                closable: true,
                xtype: xtype,
                listeners: {
                    destroy: function(){
                        me.redirectTo('home');
                    }
                }
            });
        };
        
        viewportTabs.setActiveItem(tab);
    }
    
});
