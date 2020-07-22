Ext.define('App.view.pvsolicitacaoalteracao.SolicitacoesGridPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pvsolicitacaoalteracaoalteracoesgridpanel',

    control: {
        'pvsolicitacaoalteracaosolicitacoesgridpanel': {
            select: 'onSelect'
        }
    },

    acl: {
        btnAnalisar: false
    },

    listen: {
        global: {
            pvsolicitacaoalteracaosolicitacaoenviada: function(values){
                this.getView().getStore().reload()
            },
            pvsolicitacaoalteracaoconcluida: function(values){
                this.getView().getStore().reload();
            },
        }
    },

    init: function (view) {
        var me = this,
            toolbar = view.down('toolbar');

        // Libera acessos
        var aclBtnAnalisar = ['EVERTON'];
        if(aclBtnAnalisar.indexOf(USUARIO.usuario_sistema) !== -1)
        me.acl.btnAnalisar = true;   

        // Remove os botões
        if(!me.acl.btnAnalisar)
        toolbar.down('#analise').destroy();
    },

    // Item selecionado
    onSelect: function(grid, selected){
        var main = grid.view.up('pvsolicitacaoalteracaomain'),
            gridToolbar = main.down('toolbar'),
            btnAnalise = gridToolbar.down('#analise'),
            comentariosGriPanel = main.down('pvsolicitacaoalteracaosolicitacaocomentariosgridpanel');
        
        // habilita o botão de análise da solicitação
        if(btnAnalise)
        btnAnalise.enable();

        // // Recarrega o grid
        var store = comentariosGriPanel.getStore(),
            solicitacao = selected.get('idSolicitacao');
        
        store.proxy.extraParams.solicitacao = solicitacao;
        store.reload();
    },

    onBtnNovaSolicitacaoClick: function(btn){
        var comboEmpresa = btn.up('toolbar').down('combobox[name=empresa]');
        
        Ext.create('App.view.pvsolicitacaoalteracao.NovaSolicitacaoWindow',{
            empresa: comboEmpresa.getValue()
        }).show();
    },

    onBtnAnaliseClick: function(btn){
        var me = this,
            grid = btn.up('grid');

        // Busca a linha selecionada
        var selection = grid.getSelection();

        if(selection[0])
        Ext.create('App.view.pvsolicitacaoalteracao.AnaliseWindow',{
            solicitacao: selection[0]
        }).show();

    }
    
});
