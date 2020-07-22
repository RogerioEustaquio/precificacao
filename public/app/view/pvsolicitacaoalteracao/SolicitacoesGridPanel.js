Ext.define('App.view.pvsolicitacaoalteracao.SolicitacoesGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaoalteracaosolicitacoesgridpanel',
    controller: 'pvsolicitacaoalteracaoalteracoesgridpanel',

    title: 'Alteração de Preço',

    tbar: {
        items: [
            {
                disabled: true,
                tooltip: 'Nova Solicitação',
                iconCls: 'fa fa-plus',
                itemId: 'novasolicitacao',
                handler: 'onBtnNovaSolicitacaoClick'
                // handler: function(btn){
                //     var empresa = btn.up('grid').down('toolbar').down('combobox[name=empresa]').getValue();
                    
                //     var win = Ext.create('App.view.pvsolicitacao.AlteracaoWindow', {
                //         empresa: empresa,
                //         btnRef: btn
                //     });

                //     win.show();
                // }
            },

            {
                disabled: true,
                itemId: 'analise',
                tooltip: 'Analisar Solicitação',
                iconCls: 'fa fa-wrench',
                handler: 'onBtnAnaliseClick'
            },
            
            '->',
            {
                width: 70,
                xtype: 'combobox',
                name: 'empresa',
                store: Ext.data.Store({
                    fields: [{ name: 'coditem' }, { name: 'descricao' }],
                    proxy: {
                        type: 'ajax',
                        url: BASEURL + '/api/pvsolicitacaoalteracao/listarempresas',
                        reader: { type: 'json', root: 'data' }
                    }
                }),
                queryParam: 'codigo',
                queryMode: 'remote',
                displayField: 'nome',
                valueField: 'nome',
                emptyText: 'Emp',
                forceSelection: true,
                listeners: {
                    select: function ( combo, record ) {
                        var value = combo.getValue(),
                            toolbar = combo.up('toolbar'),
                            btnNovaSolicitacao = toolbar.down('#novasolicitacao');

                        // Ativa o botao de nova solicitacao
                        if(value !== 'EC')
                        btnNovaSolicitacao.enable();

                        // Não ativa para o ec
                        if(value === 'EC')
                        btnNovaSolicitacao.disable();

                        // Filtra os itens da filial
                        var grid = this.up('grid'),
                            store = grid.getStore();


                        store.proxy.extraParams.emp = combo.getValue();
                        store.reload();
                    }
                }
            }
        ]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        displayMsg: 'Exibindo solicitações {0} - {1} de {2}',
        emptyMsg: "Não há solicitações a serem exibidos"
    },

    constructor: function(config) {
        var me = this,
            utilFormat = Ext.create('Ext.ux.util.Format');

        Ext.define('App.model.pvsolicitacaoalteracao.Solicitacao', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'idSolicitacao',  type: 'integer' },
                { name: 'emp',  type: 'string' },
                { name: 'codigo',  type: 'string' },
                { name: 'descricao',  type: 'string' },
                { name: 'marca',  type: 'string' },
                { name: 'precoDe',  type: 'number' },
                { name: 'precoPara',  type: 'number' },
                { name: 'precoConfirmado',  type: 'number' },
                { name: 'idSolicitacaoStatus',  type: 'integer' },
                { name: 'status',  type: 'string' },
                { name: 'usuarioSolicitacao',  type: 'string' },
                { name: 'dataSolicitacao', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaoalteracao.Solicitacao',
                pageSize: 50,
                // remoteSort: true,
                // sorters: [{ property: 'vendaM6', direction: 'DESC' }],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaoalteracao/listarsolicitacoes',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' }
                }
            }),
        
            columns: [
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'emp'
                }, 
        
                {
                    text: 'Código',
                    width: 120,
                    dataIndex: 'codigo'
                }, 
        
                {
                    text: 'Descrição',
                    minWidth: 320,
                    flex: 1,
                    dataIndex: 'descricao'
                }, 
        
                {
                    text: 'Marca',
                    width: 180,
                    dataIndex: 'marca'
                }, 
        
                {
                    text: 'Data',
                    width: 125,
                    align: 'center',
                    dataIndex: 'dataSolicitacao',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i')
                },
        
                {
                    text: 'De',
                    align: 'right',
                    width: 110,
                    dataIndex: 'precoDe',
                    renderer: function (v) { return utilFormat.Value(v); }
                },
        
                {
                    text: 'Para',
                    align: 'right',
                    width: 110,
                    dataIndex: 'precoPara',
                    renderer: function (v) { return utilFormat.Value(v); }
                },

                {
                    text: 'Final',
                    align: 'right',
                    width: 110,
                    dataIndex: 'precoConfirmado',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v); 
                    }
                },
        
                {
                    text: 'Status',
                    width: 86,
                    dataIndex: 'status',
                    renderer: function (value, metaData, record) {
                        var idSolicitacaoStatus = record.get('idSolicitacaoStatus');

                            if (idSolicitacaoStatus === 2)
                                metaData.tdCls = 'x-grid-cell-green-border';
                            if (idSolicitacaoStatus === 3)
                                metaData.tdCls = 'x-grid-cell-yellow-border';
                            if (idSolicitacaoStatus === 4)
                                metaData.tdCls = 'x-grid-cell-red-border';

                        return value;
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});