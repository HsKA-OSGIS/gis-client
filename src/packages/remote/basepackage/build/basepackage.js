Ext.define("Basepackage.util.ConfigParser",{statics:{setupLayers:function(c){var a=[],b;if(!c||!c.data||!c.data.merge||!c.data.merge.mapLayers){Ext.log.warn("Invalid context given to configParser!");return}Ext.log("generating layers...");b=c.data.merge.mapLayers;Ext.each(b,function(f){var h,g,e;if(f.type==="WMS"||f.type==="ImageWMS"){g="Image";e="ImageWMS"}else{if(f.type==="TileWMS"){g="Tile";e="TileWMS"}else{if(f.type==="XYZ"){g="Tile";e="XYZ"}}}var d={name:f.name||"No Name given",topic:f.topic||false,legendUrl:f.legendUrl||null,legendHeight:f.legendHeight||128,minResolution:f.minResolution||undefined,maxResolution:f.maxResolution||undefined,opacity:f.opacity||1,visible:(f.visibility===false)?false:true,source:new ol.source[e]({url:f.url,attributions:f.attribution?[new ol.Attribution({html:f.attribution})]:undefined,crossOrigin:f.crossOrigin,params:{LAYERS:f.layers,TILED:g==="Tile"?true:false}})};if(f.customParams){Ext.applyIf(d,f.customParams)}h=new ol.layer[g](d);if(!Ext.isEmpty(h)){a.push(h)}});return a},setupMap:function(c){var d,e,b,a;if(!c||!c.data||!c.data.merge||!c.data.merge.mapConfig){Ext.log.warn("Invalid context given to configParser!");return}a=c.data.merge;b=this.setupLayers(c);Ext.log("generating the map...");d=new ol.Map({layers:b,controls:[new ol.control.ScaleLine()],view:new ol.View({center:this.convertStringToIntArray(a.startCenter),zoom:a.startZoom||2,maxResolution:a.maxResolution,minResolution:a.minResolution,projection:a.mapConfig.projection||"EPSG:3857",units:"m",resolutions:this.convertStringToIntArray(a.mapConfig.resolutions)})});return d},convertStringToIntArray:function(b){if(Ext.isEmpty(b)||Ext.isArray(b)){return b}var a=[];Ext.each(b.split(","),function(c){a.push(parseInt(c,10))});return a}}});Ext.define("Basepackage.view.form.AddWms",{extend:"Ext.form.Panel",xtype:"base-form-addwms",requires:["Ext.button.Button"],viewModel:{data:{errorIncompatibleWMS:"Der angefragte WMS ist nicht kompatibel zur Anwendung",errorRequestFailedS:"Die angegebene URL konte nicht abgefragt werden",errorCouldntParseResponse:"Die erhaltene Antwort konnte nicht erfolgreich geparst werden",addCheckedLayers:"Ausgewählte Layer hinzufügen"}},padding:5,layout:"anchor",defaults:{anchor:"100%"},scrollable:true,items:[{xtype:"fieldset",layout:"anchor",defaults:{anchor:"100%"},title:"Anfrageparameter",items:[{xtype:"textfield",fieldLabel:"WMS-URL",name:"url",allowBlank:false,value:"http://ows.terrestris.de/osm/service"},{xtype:"fieldcontainer",fieldLabel:"Version",defaultType:"radiofield",defaults:{flex:1},layout:"hbox",items:[{boxLabel:"v1.1.1",name:"version",inputValue:"1.1.1",id:"v111-radio"},{boxLabel:"v1.3.0",name:"version",inputValue:"1.3.0",id:"v130-radio",checked:true}]},{xtype:"hiddenfield",name:"request",value:"GetCapabilities"},{xtype:"hiddenfield",name:"service",value:"WMS"}]},{xtype:"fieldset",name:"fs-available-layers",layout:"anchor",defaults:{anchor:"100%"},title:"Verfügbare Layer"}],buttons:[{text:"Zurücksetzen",handler:function(b,c){var a=b.up("base-form-addwms");a.getForm().reset();a.emptyAvailableLayersFieldset()}},"->",{text:"Verfügbare Layer abfragen",formBind:true,disabled:true,handler:function(f,h){var a=f.up("base-form-addwms");var d=a.getViewModel();var g=a.getForm();if(g.isValid()){a.emptyAvailableLayersFieldset();var b=g.getValues();var c=b.url;delete b.url;Ext.Ajax.request({url:c,method:"GET",params:b,success:function(k,l){var n=new ol.format.WMSCapabilities();var i;try{i=n.read(k.responseText)}catch(m){a.showWarning(d.get("errorCouldntParseResponse"));return}var j=a.isCompatibleCapabilityResponse(i);if(!j){a.showWarning(d.get("errorIncompatibleWMS"));return}a.fillAvailableLayersFieldset(j)},failure:function(e,i){a.showWarning(d.get("errorRequestFailedS"))}})}}}],emptyAvailableLayersFieldset:function(){var a=this.down('[name="fs-available-layers"]');a.removeAll()},showWarning:function(a){Ext.Msg.show({title:"Warnung",message:"Ein Fehler trat auf: "+a,width:300,buttons:Ext.Msg.OK,icon:Ext.Msg.WARNING})},isCompatibleCapabilityResponse:function(a){if(!a){return false}var b=a.version;if(b!=="1.1.1"&&b!=="1.3.0"){return false}var c=[];var g=Ext.ComponentQuery.query("gx_map")[0].getMap();var e=g.getView().getProjection().getCode();var f=a.Capability.Layer.Layer;var d=a.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource;Ext.each(f,function(i){if(b==="1.3.0"&&!Ext.Array.contains(i.CRS,e)){return}var h=new ol.source.TileWMS({url:d,params:{LAYERS:i.Name,STYLES:i.Style[0].Name,VERSION:b}});var j=new ol.layer.Tile({topic:true,name:i.Title,source:h,legendUrl:i.Style[0].LegendURL[0].OnlineResource});c.push(j)});return c.length>0?c:false},fillAvailableLayersFieldset:function(d){this.emptyAvailableLayersFieldset();var b=this;var a=b.down('[name="fs-available-layers"]');var c=this.getViewModel();Ext.each(d,function(e){a.add({xtype:"checkbox",boxLabel:e.get("name"),checked:true,olLayer:e})});a.add({xtype:"button",text:c.get("addCheckedLayers"),margin:10,handler:this.addCheckedLayers,scope:this})},addCheckedLayers:function(){var a=this.down('[name="fs-available-layers"]');var b=a.query("checkbox[checked=true][disabled=false]");var c=Ext.ComponentQuery.query("gx_map")[0].getMap();Ext.each(b,function(d){c.addLayer(d.olLayer);d.setDisabled(true)})}});Ext.define("Basepackage.view.button.AddWms",{extend:"Ext.button.Button",xtype:"base-button-addwms",requires:["Ext.window.Window","Basepackage.view.form.AddWms"],bind:{text:"{text}",tooltip:"{tooltip}"},handler:function(){Ext.create("Ext.window.Window",{title:"WMS hinzufügen",width:500,height:400,layout:"fit",items:[{xtype:"base-form-addwms"}]}).show()},viewModel:{data:{tooltip:"WMS hinzufügen\u2026",text:'WMS <span style="font-size: 1.7em; font-weight: normal;">⊕</span>'}}});Ext.define("Basepackage.view.component.Map",{extend:"GeoExt.component.Map",xtype:"base-component-map",requires:["Basepackage.util.ConfigParser"],statics:{guess:function(){return Ext.ComponentQuery.query("base-component-map")[0]}},appContext:null,appContextPath:"resources/appContext.json",fallbackAppContext:{data:{merge:{startCenter:[1163261,6648489],startZoom:5,mapLayers:[{name:"OSM WMS",type:"TileWMS",url:"http://ows.terrestris.de/osm/service?",layers:"OSM-WMS",topic:false}],mapConfig:{projection:"EPSG:3857",resolutions:[156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],zoom:0}}}},pendingRequest:null,defaultListenerScope:true,config:{pointerRest:true,pointerRestInterval:500,pointerRestPixelTolerance:5,hoverVectorLayerSource:null,hoverVectorLayer:null,hoverVectorLayerInteraction:null},listeners:{pointerrest:"onPointerRest"},constructor:function(a){var c=this;if(!c.getMap()){Ext.Ajax.request({url:a.appContextPath||c.appContextPath,async:false,success:function(d){if(Ext.isString(d.responseText)){c.appContext=Ext.decode(d.responseText)}else{if(Ext.isObject(d.responseText)){c.appContext=d.responseText}else{Ext.log.error("Error! Could not parse appContext!")}}},failure:function(d){Ext.log.error("Error! No application context found, example loaded");c.appContext=c.fallbackAppContext}});var b=Basepackage.util.ConfigParser.setupMap(c.appContext);c.setMap(b)}c.callParent([a])},initComponent:function(){var a=this;a.addHoverVectorLayerSource();a.addHoverVectorLayer();a.addHoverVectorLayerInteraction();a.callParent()},addHoverVectorLayerInteraction:function(){var c=this;if(!c.getHoverVectorLayerInteraction()){var b=new ol.interaction.Select({layers:[c.getHoverVectorLayer()]});var a=b.getFeatures();a.on("add",this.onFeatureClicked,this);c.getMap().addInteraction(b);c.setHoverVectorLayerInteraction(b)}},onFeatureClicked:function(c){var b=this;var a=c.target.getArray()[0];b.fireEvent("hoverfeatureclick",a)},addHoverVectorLayerSource:function(){var a=this;if(!a.getHoverVectorLayerSource()){a.setHoverVectorLayerSource(new ol.source.Vector())}},addHoverVectorLayer:function(){var a=this;var b=a.getMap();var c=a.getHoverVectorLayer();if(!c){c=new ol.layer.Vector({name:"hoverVectorLayer",source:a.getHoverVectorLayerSource()});b.addLayer(c);a.setHoverVectorLayer(c)}},clearPendingRequests:function(){var a=this;if(a.pendingRequest){Ext.Ajax.abort(a.pendingRequest)}},requestAsynchronously:function(b,a){var c=this;c.pendingRequest=Ext.Ajax.request({url:b,callback:function(){c.pendingRequest=null},success:a,failure:function(d){Ext.log.error("Couldn't get FeatureInfo")}})},onPointerRest:function(a){this.clearPendingRequests();var e=this;var g=e.getMap();var d=g.getView();var c=a.pixel;var b=e.maxTolerance;var f=[];var h=[];e.getHoverVectorLayerSource().clear();g.getOverlays().forEach(function(i){g.removeOverlay(i)});g.forEachLayerAtPixel(c,function(k){var n=k.getSource();var j=d.getResolution();var m=d.getProjection().getCode();var i=n.getGetFeatureInfoUrl(a.coordinate,j,m,{INFO_FORMAT:"application/json"});var l=k.get("hoverable");if(l!==false){e.requestAsynchronously(i,function(p){var o=(new ol.format.GeoJSON()).readFeatures(p.responseText);e.showHoverFeature(k,o);f.push(k);h.push(o[0]);e.showHoverToolTip(a,f,h);e.on("hoverfeatureclick",e.onHoverFeatureClick,e)})}},this,function(i){var j=i.get("topic");return j})},showHoverFeature:function(a,b){var c=this;Ext.each(b,function(d){d.set("layer",a);var e=d.getGeometry();if(e){e.transform("EPSG:4326",c.getMap().getView().getProjection())}c.getHoverVectorLayerSource().addFeature(d)})},showHoverToolTip:function(a,g,c){var d=this;var f=d.getMap();var e=a.coordinate;f.getOverlays().forEach(function(i){f.removeOverlay(i)});var h=document.createElement("div");h.className="feature-hover-popup";h.innerHTML=this.getToolTipHtml(g,c);var b=new ol.Overlay({position:e,offset:[10,-30],element:h});f.addOverlay(b)},getToolTipHtml:function(c,b){var a="";Ext.each(c,function(f,d,g){var e=f.get("hoverfield");if(!e){e="id"}a+="<b>"+f.get("name")+"</b>";Ext.each(b,function(i){if(i){var h=i.get(e);if(i.get("layer")===f){a+="<br />"+h+"<br />"}}});if(d+1!==g.length){a+="<br />"}});return a},onHoverFeatureClick:function(a){}});Ext.define("Basepackage.view.form.Print",{extend:"Ext.form.Panel",xtype:"base-form-print",requires:["Ext.window.Toast","Ext.form.action.StandardSubmit","GeoExt.data.MapfishPrintProvider"],defaultListenerScope:true,viewModel:{data:{title:"Drucken",labelDpi:"DPI",printButtonSuffix:"anfordern",printFormat:"pdf",genericFieldSetTitle:"Einstellungen"}},bind:{title:"{title}"},maxHeight:250,autoScroll:true,config:{url:null,store:null},borderColors:["#FF5050","#00CCFF","#FFFF99","#CCFF66"],layout:"anchor",defaults:{anchor:"100%"},bodyPadding:"0 5px 0 0",extentLayer:null,provider:null,defaultType:"textfield",initComponent:function(){var a;var b=this.getUrl();if(!b){this.html="No Url provided!";this.callParent();return}this.callParent();var c=Ext.create("Ext.data.Store",{autoLoad:true,proxy:{type:"jsonp",url:b+"apps.json",callbackKey:"jsonp"},listeners:{load:function(e,d){var f=[];Ext.each(d,function(g){f.push(g.raw)});this.down("combo[name=appCombo]").setStore(f)},scope:this}});this.add({xtype:"combo",name:"appCombo",allowBlank:false,forceSelection:true,store:c,listeners:{select:"onAppSelected",scope:this}});this.on("afterrender",this.addExtentLayer,this);this.on("afterrender",this.addParentCollapseExpandListeners,this)},bbar:[{xtype:"button",name:"createPrint",bind:{text:"{printFormat:uppercase} {printButtonSuffix}"},formBind:true,handler:function(){var n={};var l=this.up("base-form-print");var p=l.getMapComponent();var f=p.getMap().getView();var h=l.down('combo[name="layout"]').getValue();var m=l.down('combo[name="format"]').getValue();var g={};var i=f.getProjection().getCode();var o=f.getRotation();var j=Ext.Array.filter(p.getLayers().getArray(),function(q){if(q.checked&&q.get("name")&&q.get("name")!=="hoverVectorLayer"){return true}else{return false}});var k=GeoExt.data.MapfishPrintProvider.getSerializedLayers(j);var c=l.query('fieldset[name!="generic-fieldset"] fieldset');Ext.each(c,function(q){var r=q.name;var t=q.extentFeature.getGeometry().getExtent();var s=q.down('[name="dpi"]').getValue();g[r]={bbox:t,dpi:s,layers:k.reverse(),projection:i,rotation:o}},this);var a=l.query('fieldset[name!="generic-fieldset"]>field[name!=dpi]');Ext.each(a,function(q){if(q.getName()==="legend"){g.legend=l.getLegendObject()}else{if(q.getName()==="scalebar"){g.scalebar=l.getScaleBarObject()}else{if(q.getName()==="northArrow"){g.scalebar=l.getNorthArrowObject()}else{g[q.getName()]=q.getValue()}}}},this);var b=l.getUrl();var e=l.down("combo[name=appCombo]").getValue();n.attributes=g;n.layout=h;var d=Ext.create("Ext.form.Panel",{standardSubmit:true,url:b+e+"/buildreport."+m,method:"POST",items:[{xtype:"textfield",name:"spec",value:Ext.encode(n)}]});d.submit()},disabled:true}],listeners:{collapse:"cleanupPrintExtent",resize:"renderAllClientInfos"},addParentCollapseExpandListeners:function(){var a=this.up();a.on({collapse:"cleanupPrintExtent",expand:"renderAllClientInfos",scope:this})},addExtentLayer:function(){var a=new ol.layer.Vector({source:new ol.source.Vector()});Ext.ComponentQuery.query("gx_map")[0].addLayer(a);this.extentLayer=a},getMapComponent:function(){return Ext.ComponentQuery.query("gx_component_map")[0]},onPrintProviderReady:function(b){var a=this;this.addGenericFieldset(b)},onAppSelected:function(a){this.provider=Ext.create("GeoExt.data.MapfishPrintProvider",{url:this.getUrl()+a.getValue()+"/capabilities.json",listeners:{ready:"onPrintProviderReady",scope:this}})},removeGenericFieldset:function(){var b=this;var a=b.down('[name="generic-fieldset"]');if(a){b.remove(a)}},addGenericFieldset:function(c){var b=this;var a=b.down('[name="generic-fieldset"]');if(a){a.removeAll()}else{b.add({xtype:"fieldset",bind:{title:"{genericFieldSetTitle}"},name:"generic-fieldset",layout:"anchor",defaults:{anchor:"100%"}})}this.addLayoutCombo(c);this.addFormatCombo(c)},addFormatCombo:function(d){var a=this.down("fieldset[name=generic-fieldset]");var c=d.capabilityRec.get("formats");var b={xtype:"combo",name:"format",displayField:"name",editable:false,forceSelection:true,queryMode:"local",valueField:"name",store:c,bind:{value:"{printFormat}"}};a.add(b)},addLayoutCombo:function(c){var a=this.down("fieldset[name=generic-fieldset]");var d=c.capabilityRec.layouts();var b={xtype:"combo",name:"layout",displayField:"name",editable:false,forceSelection:true,queryMode:"local",valueField:"name",store:d,listeners:{change:this.onLayoutSelect,scope:this}};b=a.add(b);b.select(d.getAt(0))},onLayoutSelect:function(e,d){var c=this,b=c.down("fieldset[name=attributes]"),f=e.findRecordByValue(d),a;c.remove(b);a=c.add({xtype:"fieldset",title:"Eigenschaften",name:"attributes",layout:"anchor",defaults:{anchor:"100%"}});f.attributes().each(function(h,g){this.addAttributeFields(h,a)},this);this.renderAllClientInfos();c.down('button[name="createPrint"]').enable()},getMapAttributeFields:function(b){var d=b.get("clientInfo");var c=b.get("name")+" ("+d.width+" × "+d.height+")";var a={xtype:"fieldset",clientInfo:Ext.clone(d),title:c,name:b.get("name"),items:{xtype:"combo",name:"dpi",editable:false,forceSelection:true,bind:{fieldLabel:"{labelDpi}"},queryMode:"local",labelWidth:40,grow:true,value:d.dpiSuggestions[0],store:d.dpiSuggestions}};return a},getCheckBoxAttributeFields:function(a){return{xtype:"checkbox",name:a.get("name"),checked:true,fieldLabel:a.get("name"),boxLabel:"\u2026verwenden?"}},getNorthArrowAttributeFields:function(a){return this.getCheckBoxAttributeFields(a)},getLegendAttributeFields:function(a){return this.getCheckBoxAttributeFields(a)},getScalebarAttributeFields:function(a){return this.getCheckBoxAttributeFields(a)},getStringField:function(a){return{xtype:"textfield",name:a.get("name"),fieldLabel:a.get("name"),allowBlank:false}},addAttributeFields:function(c,a){var b=this;var e=this.getMapComponent().getMap().getView();var d;switch(c.get("type")){case"MapAttributeValues":d=this.getMapAttributeFields(c);e.on("propertychange",this.renderAllClientInfos,this);break;case"NorthArrowAttributeValues":d=this.getNorthArrowAttributeFields(c);break;case"ScalebarAttributeValues":d=this.getScalebarAttributeFields(c);break;case"LegendAttributeValue":d=this.getLegendAttributeFields(c);break;case"String":d=this.getStringField(c);break;case"DataSourceAttributeValue":Ext.toast("Data Source not ye supported");d=this.getStringField(c);break;default:break}if(d){a.add(d)}},renderAllClientInfos:function(){var a=this;if(a._renderingClientExtents||a.getCollapsed()!==false){return}a._renderingClientExtents=true;a.extentLayer.getSource().clear();var b=a.query('fieldset[name!="generic-fieldset"] fieldset');Ext.each(b,function(c){var d=GeoExt.data.MapfishPrintProvider.renderPrintExtent(this.getMapComponent(),a.extentLayer,c.clientInfo);c.extentFeature=d},this);delete a._renderingClientExtents},cleanupPrintExtent:function(){var a=this;a.extentLayer.getSource().clear()},getLegendObject:function(){var a=this;var b=this.getMapComponent().getStore();var c=[];b.each(function(j){var g=j.get("text");var h=j.getOlLayer();var i=h.getSource();if(i instanceof ol.source.TileWMS){var f=i.getUrls()[0];var e=f+"?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&FORMAT=image%2Fgif&SCALE=6933504.262556662&LAYER=";e+=i.getParams().LAYERS;c.push({icons:[e],name:g})}},this);var d={classes:c,name:""};return d},getNorthArrowObject:function(){var a={};return a},getScaleBarObject:function(){var a={};return a},getLayoutRec:function(){var b=this.down('combo[name="layout"]');var a=b.getValue();var c=b.findRecordByValue(a);return c}});Ext.define("Basepackage.view.panel.Header",{extend:"Ext.panel.Panel",xtype:"base-panel-header",requires:["Ext.Img"],config:{addLogo:true,logoUrl:"resources/images/logo.png",logoAltText:"Logo",logoHeight:80,logoWidth:200,additionalItems:[]},layout:{type:"hbox",align:"stretch"},padding:5,cls:"basepackage-header",items:[],initComponent:function(){var a=this;if(a.getAddLogo()===true){a.addLogoItem()}var b=a.getAdditionalItems();if(!Ext.isEmpty(b)&&Ext.isArray(b)){Ext.each(b,function(c){a.items.push(c)})}a.callParent()},addLogoItem:function(){var a=this;var b={xtype:"image",margin:"0 50px",alt:a.getLogoAltText(),src:a.getLogoUrl(),height:a.getLogoHeight(),width:a.getLogoWidth()};a.items.push(b)}});Ext.define("Basepackage.view.panel.LegendTree",{extend:"GeoExt.tree.Panel",xtype:"base-panel-legendtree",requires:[],viewModel:{data:{}},layout:"fit",width:250,height:300,collapsible:true,collapsed:true,hideCollapseTool:true,collapseDirection:"bottom",titleCollapse:true,titleAlign:"center",rootVisible:false,allowDeselect:true,selModel:{mode:"MULTI"},cls:"base-legend-panel",initiallyCollapsed:null,initComponent:function(){var a=this;if(a.collapsed&&a.hideCollapseTool){a.collapsed=false;a.initiallyCollapsed=true;Ext.log.info('Ignoring configuration "collapsed" and instead setup a one-time afterlayout listener that will collapse the panel (this is possibly due to a bug in ExtJS 6)')}a.hideHeaders=true;a.lines=false;a.features=[{ftype:"rowbody",setupRowData:function(g,i,l){var e=this.view.headerCt,d=e.getColumnCount(),f=g.get("checked"),h=g.data,k=f&&!(h instanceof ol.layer.Group),b=k&&h.get&&h.get("legendUrl"),c="",j;j=h.get("legendHeight");if(!b){b="http://geoext.github.io/geoext2/website-resources/img/GeoExt-logo.png"}c='<img class="base-legend" src="'+b+'"';if(j){c+=' height="'+j+'"'}c+=" />";Ext.apply(l,{rowBody:k?c:"",rowBodyCls:"my-body-class",rowBodyColspan:d})}}];a.callParent();if(a.initiallyCollapsed){a.on("afterlayout",function(){this.collapse()},a,{single:true,delay:100});a.initiallyCollapsed=null}}});Ext.define("Basepackage.view.panel.Menu",{extend:"Ext.panel.Panel",xtype:"base-panel-menu",requires:["Ext.layout.container.Accordion","Basepackage.view.form.Print","Basepackage.view.button.AddWms"],viewModel:{data:{closedMenuTitle:"Menu schließen",openedMenuTitle:"Menu anzeigen"}},defaultListenerScope:true,headerPosition:"bottom",collapsible:true,hideCollapseTool:true,titleCollapse:true,titleAlign:"center",activeItem:1,defaults:{hideCollapseTool:true,titleCollapse:true},layout:{type:"accordion",titleCollapse:false,animate:true},items:[],listeners:{collapse:"setTitleAccordingToCollapsedState",expand:"setTitleAccordingToCollapsedState",afterrender:"setTitleAccordingToCollapsedState"},setTitleAccordingToCollapsedState:function(a){if(a.getCollapsed()===false){a.setBind({title:"{closedMenuTitle}"})}else{a.setBind({title:"{openedMenuTitle}"})}}});Ext.define("Basepackage.view.panel.MapContainer",{extend:"Ext.panel.Panel",xtype:"base-panel-mapcontainer",requires:["Ext.dom.Query","GeoExt.data.TreeStore","GeoExt.component.OverviewMap","Basepackage.view.component.Map","Basepackage.view.panel.LegendTree","Basepackage.view.panel.Menu"],viewModel:{data:{titleLegendPanel:"Legende"}},layout:"absolute",header:false,mapPanel:null,config:{mapComponentConfig:{xtype:"base-component-map",anchor:"100% 100%"},menuConfig:{xtype:"base-panel-menu",width:300,items:[]},toolbarConfig:{xtype:"toolbar",vertical:true,width:50,cls:"base-map-tools",x:0,y:0,defaults:{scale:"large"}},overviewMapConfig:{xtype:"gx_overviewmap",magnification:10,width:400,height:150,padding:5,cls:"base-overview-map",hidden:true,layers:[new ol.layer.Tile({source:new ol.source.MapQuest({layer:"sat"})})]},overviewMapToggleButtonConfig:{xtype:"button",scale:"large",cls:"base-overview-map-button",glyph:"xf0ac@FontAwesome",enableToggle:true},legendPanelConfig:{xtype:"base-panel-legendtree",width:250,height:300,layout:"fit",collapsible:true,collapsed:true,hideCollapseTool:true,collapseDirection:"bottom",titleCollapse:true,titleAlign:"center",rootVisible:false,bind:{title:"{titleLegendPanel}"}},additionalItems:[]},initComponent:function(){var a=this;a.callParent();a.addMapComponent();a.addMenu();a.addToolbar();a.addOverviewMap();a.addOverviewMapToggleButton();a.addAdditionalItems();a.on("afterrender",a.addLegendPanel,a,{single:true})},addMapComponent:function(){var a=this;var b=a.getMapComponentConfig();a.add(b);a.mapPanel=a.down(b.xtype)},addMenu:function(){var a=this;var b=a.getMenuConfig();a.add(b)},addToolbar:function(){var b=this;var a=b.getToolbarConfig();a.items=b.buildToolbarItems();b.add(a)},addOverviewMap:function(){var b=this;var a=b.getOverviewMapConfig();if(!a.parentMap&&b.mapPanel){a.parentMap=b.mapPanel.getMap()}b.add(a)},addOverviewMapToggleButton:function(){var a=this;var b=a.getOverviewMapToggleButtonConfig();if(!b.toggleHander&&a.toggleOverviewMap){b.toggleHandler=a.toggleOverviewMap}if(!b.scope){b.scope=a}a.add(b)},addAdditionalItems:function(){var a=this;var b=a.getAdditionalItems();a.add(b)},addLegendPanel:function(){var b=this;var a=b.getLegendPanelConfig();if(!a.store&&b.mapPanel){var c=Ext.create("GeoExt.data.TreeStore",{layerGroup:b.mapPanel.getMap().getLayerGroup(),showLayerGroupNode:false,filters:[function(d){if(d.data instanceof ol.layer.Vector){return false}return true}]});a.store=c}b.add(a)},buildToolbarItems:function(){var c=this;var e=[];var f={glyph:"xf00e@FontAwesome",handler:c.zoomIn};var d={glyph:"xf010@FontAwesome",handler:c.zoomOut};var b={glyph:"xf0b2@FontAwesome",handler:c.zoomToExtent};var a={glyph:"xf022@FontAwesome",handler:c.toggleLegendPanel};e.push(f);e.push(d);e.push(b);e.push(a);return e},toggleLegendPanel:function(b){var a=b.up("base-panel-mapcontainer").down("base-panel-legendtree");if(a.getCollapsed()){a.expand()}else{a.collapse()}b.blur()},toggleOverviewMap:function(b,c){var a=b.up("base-panel-mapcontainer").down("gx_overviewmap");if(c){a.show()}else{a.hide()}b.blur();this.toggleScalineAdjustment()},toggleScalineAdjustment:function(){var a=Ext.get(Ext.dom.Query.select(".ol-scale-line")[0]);a.toggleCls("base-scaline-adjusted")},zoomIn:function(a){var b=a.up("base-panel-mapcontainer").down("gx_map").getMap();var d=a.up("base-panel-mapcontainer").down("gx_map").getView();var c=ol.animation.zoom({resolution:d.getResolution(),duration:500});b.beforeRender(c);d.setResolution(d.getResolution()/2)},zoomOut:function(a){var b=a.up("base-panel-mapcontainer").down("gx_map").getMap();var d=a.up("base-panel-mapcontainer").down("gx_map").getView();var c=ol.animation.zoom({resolution:d.getResolution(),duration:500});b.beforeRender(c);d.setResolution(d.getResolution()*2)},zoomToExtent:function(c){var d=c.up("base-panel-mapcontainer").down("gx_map").getMap();var g=c.up("base-panel-mapcontainer").down("gx_map").getView();var b=[1234075.4566814213,6706481.04685707];var a=2445.98490512564;var f=ol.animation.pan({source:g.getCenter()});var e=ol.animation.zoom({resolution:g.getResolution()});d.beforeRender(f);d.beforeRender(e);g.setCenter(b);g.setResolution(a)}});