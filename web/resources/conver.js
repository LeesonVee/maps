/**
 * Created by weilishan on 2019/8/1.
 */
(function(){

    var map, converLayer;
    var jsonAreaCode = {
        upAreaCode:'440000',
        areaCode:'440100',
    }
    function initMap() {
        // var baselayer = new ol.layer.Tile({
        //     source: new ol.source.XYZ({
        //         // url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
        //         url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
        //     })
        // });

        var layers = [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                })
            }),
            new ol.layer.Vector({
                title: 'add Layer',
                source: new ol.source.Vector({
                    projection: 'EPSG:4326',
                    url: "data/"+jsonAreaCode.areaCode+'.json', //GeoJSON的文件路径，用户可以根据需求而改变
                    format: new ol.format.GeoJSON()
                }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: '#011659'
                    }),
                })
            })
        ];

        map = new ol.Map({
            target: 'map',
            layers: layers,
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [113.569354,23.23516],//113.415546,23.108909  113.272723,23.117751
                zoom: 9
            })
        });

        var mystyle = new ol.style.Style({
            fill: new ol.style.Fill({
                // color:"rgba(72,61,139, 0.4)"
                color:"#080107",
            }),
            stroke: new ol.style.Stroke({
                color:"#BDBDBD",
                width:2
            })
        });
        converLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: mystyle
        });
        map.addLayer(converLayer);
    }

    //todo
    //添加遮罩
    function addconver(data) {
        $.getJSON(data, function(data) {
            debugger;
            var fts = new ol.format.GeoJSON().readFeatures(data);
            var index = getAreaGeoJSON(data);
            var ft = fts[index];
            var converGeom = erase(ft.getGeometry());
            var convertFt = new ol.Feature({
                geometry: converGeom
            })
            converLayer.getSource().addFeature(convertFt);
        })
    }
    //获取当前行政区域序号
    function getAreaGeoJSON(data){
        var index=0;
        for(var i=0;i<data.length;i++){
            if(data[i].properties.adcode == jsonAreaCode.areaCode){
                index = i;
                break;
            }
        }
        return index;
    }
    // 擦除操作,生产遮罩范围
    function erase(geom) {
        var extent = [-180,-90,180,90];
        var polygonRing = ol.geom.Polygon.fromExtent(extent);
        var coords = geom.getCoordinates();
        coords.forEach(coord =>{
            var linearRing = new ol.geom.LinearRing(coord[0]);
            polygonRing.appendLinearRing(linearRing);
        })
        return polygonRing;
    }


    initMap();
    var dataURL = './data/'+jsonAreaCode.upAreaCode+'.json'
    addconver(dataURL);
})();
