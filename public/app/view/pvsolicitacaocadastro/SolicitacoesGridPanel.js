Ext.define('App.view.pvsolicitacaocadastro.SolicitacoesGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'pvsolicitacaocadastrogridpanel',
    controller: 'pvsolicitacaocadastrosolicitacoes',

    title: 'Cadastro de Preço',

    tbar: {
        items: [
            {
                disabled: true,
                tooltip: 'Nova Solicitação',
                iconCls: 'fa fa-plus',
                itemId: 'novasolicitacao',
                handler: 'onBtnNovaSolicitacaoClick'
            },
            {
                disabled: true,
                itemId: 'concluir',
                tooltip: 'Concluir',
                iconCls: 'fa fa-check',
                handler: 'onBtnConcluirClick'
            },
            {
                disabled: true,
                itemId: 'cancelar',
                tooltip: 'Cancelar',
                iconCls: 'fa fa-times',
                handler: 'onBtnCancelarClick'
            },
            '->',
            {
                width: 70,
                xtype: 'combobox',
                name: 'empresa',
                itemId: 'comboempresa',
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
                    select: 'onEmpresaSelect'
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

        Ext.define('App.model.pvsolicitacaocadastro.Solicitacao', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'idSolicitacao',  type: 'integer' },
                { name: 'emp',  type: 'string' },
                { name: 'codItem',  type: 'string' },
                { name: 'descricao',  type: 'string' },
                { name: 'marca',  type: 'string' },
                { name: 'custo',  type: 'number' },
                { name: 'precoSugerido',  type: 'number' },
                { name: 'precoConfirmado',  type: 'number' },
                { name: 'idSolicitacaoStatus',  type: 'integer' },
                { name: 'idStatus',  type: 'integer' },
                { name: 'descricaoStatus',  type: 'string' },
                { name: 'usuarioSolicitacao',  type: 'string' },
                { name: 'comentarioSolicitacao',  type: 'string' },
                { name: 'dataSolicitacao', type: 'date', dateFormat: 'd/m/Y H:i:s' }
            ]
        });
    
        Ext.applyIf(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'App.model.pvsolicitacaocadastro.Solicitacao',
                pageSize: 50,
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    url: BASEURL + '/api/pvsolicitacaocadastro/listarsolicitacoes',
                    timeout: 120000,
                    reader: { type: 'json', root: 'data' }
                }
            }),

            listeners: {
                select: function(grid, selected){
                    var toolbar = grid.view.up('pvsolicitacaocadastromain').down('toolbar');
                    
                    var btnConcluir = toolbar.down('#concluir');
                    
                    if(btnConcluir)
                    btnConcluir.enable();

                    var btnCancelar = toolbar.down('#cancelar');

                    if(btnCancelar)
                    btnCancelar.enable();

                    var comentarioSolicitacao = selected.get('comentarioSolicitacao');
                    grid.view.up('pvsolicitacaocadastromain')
                             .down('#comentario')
                             .down('displayfield')
                             .setValue(comentarioSolicitacao);
                }
            },
        
            columns: [
                {
                    text: 'Emp',
                    width: 52,
                    dataIndex: 'emp'
                }, 
        
                {
                    text: 'Código',
                    width: 120,
                    dataIndex: 'codItem'
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
                    text: 'Usuário',
                    width: 125,
                    align: 'center',
                    dataIndex: 'usuarioSolicitacao'
                },
                
                {
                    text: 'Custo',
                    align: 'right',
                    width: 110,
                    dataIndex: 'custo',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v); 
                    }
                },

                {
                    text: 'Preço Sugerido',
                    align: 'right',
                    width: 150,
                    dataIndex: 'precoSugerido',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v); 
                    }
                },

                {
                    text: 'Preço Confirmado',
                    align: 'right',
                    width: 150,
                    dataIndex: 'precoConfirmado',
                    renderer: function (v) { 
                        if(v)
                        return utilFormat.Value(v);     
                    }
                },

                {
                    text: 'Status',
                    width: 86,
                    dataIndex: 'descricaoStatus',
                    renderer: function (value, metaData, record) {
                        var idStatus = record.get('idStatus');

                        if (idStatus === 1)
                            metaData.tdCls = 'x-grid-cell-green-border';

                        if (idStatus === 2)
                            metaData.tdCls = 'x-grid-cell-red-border';    
                            
                        return value;
                    }
                },

                {
                    width: 42,
                    dataIndex: 'comentarioSolicitacao',
                    sortable: false,
                    menuDisabled: true,
                    align: 'center',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="'+record.get('comentarioSolicitacao')+'"';

                        if(record.get('comentarioSolicitacao'))
                        return '<span class="x-action-col-icon far fa-comment action-icon"></span>';
                    }
                }

                // {
                //     xtype: 'actioncolumn',
                //     width: 42,
                //     // menuDisabled: true,
                //     sortable: false,
                //     align: 'center',
                //     items: [{
                //         // tooltip: 'Sugerir preço de venda',
                //         iconCls: 'far fa-comment action-icon',
                //         getTip: function (value,metadata,record,rowIndex,colIndex,store) {
                //             return record.get('comentarioSolicitacao');
                //         },
                //         handler: function(view, rowIndex, colIndex, item, e, record, row){  
                          
                //         },
                //         renderer: function (value, metaData, record) {
                //             console.log( value )
                //         }
                //     }]
                // }
            ]

            // features: [{
            //     ftype: 'rowbody',
            //     getAdditionalData: function (data, idx, record, orig) {
            //         return {
            //             rowBody: '<span>' + record.get("comentarioSolicitacao") + '</span>',
            //             rowBodyCls: "grid-body-cls"
            //         };
            //     }
            // }]

            
        });

        me.callParent(arguments);
    }
});