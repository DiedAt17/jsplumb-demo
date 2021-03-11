
function create(tagProp){
  // 获取uuid
  var uuid = getUuid();
  // 创建一个div
  let div = document.createElement('div'),
  tempDiv = document.createElement('div'),
  Top=document.getElementById(tagProp.id).offsetTop,//获取元素的top值
  Left=document.getElementById(tagProp.id).offsetLeft,//获取元素的left值
  event = window.event,// 监听鼠标位置
  X=event.clientX,//获取鼠标点击时的位置
  Y=event.clientY;//获取鼠标点击时的位置

  // 创建临时标签
  tempDiv.innerHTML = '<div id="temp" style="top:'+Top+'px;left:'+Left+'px;" class="'+tagProp.className+'"></div>'

  // 获取body对象.
  var bo = document.body; 
  // 动态插入到body中
  bo.insertBefore(tempDiv, bo.lastChild);

  document.onmousemove=function(e){//鼠标移动事件
    var temp=document.getElementById("temp");
    var top=e.clientY-Y+Top+"px";
    var left=e.clientX-X+Left+"px";
    temp.style.top=e.clientY-Y+Top+"px";
    temp.style.left=e.clientX-X+Left+"px"

    // 生成div
    div.innerHTML = '<div id="'+uuid+'" class="'+tagProp.className+'" oncontextmenu="menu(this)" style="top:'+top+';left:'+left+'"></div>'
    console.log(uuid)

    //鼠标松开事件
    document.onmouseup=function(){

      document.onmousemove=null;
      
      // 动态插入到body中
      bo.insertBefore(div, bo.lastChild);
      temp.remove();
      // 加载
      window.jsPlumb.ready(function () {

        var jsPlumb = window.jsPlumb
        
        var common = {
            isSource: true,
            isTarget: true,
            connector: 'Flowchart'
          }
        
          // jsPlumb.connect(uuid, {
          //   overlays: [ [ {
          //     events:{
          //       dblclick:function(diamondOverlay, originalEvent) { 
          //         console.log("double click on diamond overlay for : " + diamondOverlay.component); 
          //       }
          //     }
          //   }] ]
          // })  

        jsPlumb.addEndpoint(uuid,{
          anchor: 'Bottom'
        },common);

        
        if(tagProp.id != 'A'){
          jsPlumb.addEndpoint(uuid, {
            anchor: 'Left',
          },common)
  
          jsPlumb.addEndpoint(uuid,{
            anchor: 'Top'
          },common)
  
          jsPlumb.addEndpoint(uuid,{
            anchor: 'Right'
          },common)
        }
        jsPlumb.draggable(uuid)
      })
    }
  }
}

// 设置全局默认属性
jsPlumb.importDefaults({
	ConnectionOverlays: [
    ['Arrow', { width: 15, length: 18, location: 0.5 },{
      events:{
        dblclick:function(diamondOverlay, originalEvent) { 
          console.log("double click on diamond overlay for : " + diamondOverlay.component); 
        }
      }
    } ]
	]
});


// 生成uuid
function getUuid(){
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function compile(element){
  element.querySelector("div").remove()
  element.innerHTML = "<input id='text' type='text'>";
  document.onkeydown = function (e) { // 回车提交表单
    // 兼容FF和IE和Opera
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
          var text = document.getElementById('text')
          // console.log(text.value)
          element.innerHTML = text.value
          text.remove;
        }
    }
}

function dleItem(id){
  console.log(id)
  if(confirm("确认要删除吗？")){
    var dle = document.getElementById(id)
    jsPlumb.remove(dle);
    dle.remove();
  }
}


// 右键弹出菜单
function menu(tagProp){
  //取消默认的浏览器自带右键
  document.oncontextmenu = function(){
    return false;
  }
  
  //获取我们自定义的右键菜单
  var menu=document.getElementById(tagProp.id)
  
  // 生成自定义菜单
  menu.innerHTML = '<div class="select"><button class="menu" onclick="compile(this.parentElement.parentElement)" >编辑</button><button class="menu" onclick="dleItem(this.parentElement.parentElement.id)" >删除</button></div>'

  // 删除自定义菜单
  window.setTimeout(function() {
    if(menu.querySelector("div")){
      menu.querySelector("div").remove()
    }
  },3000)
}


function saveFlowchart(){
  var nodes = []
  var circles = document.getElementsByClassName('circle')
  for (let i = 0; i < circles.length; i++) {
    var circle = circles[i]
    //var endpoints = jsPlumb.getEndpoints(circle.id);
    console.log(endpoints)
    if(circle.id != 'A'){
      nodes.push({
        //endpoints: endpoints,
        id: circle.id,
        text: circle.innerText,
        claas: 'circle',
        left: circle.style.left,
        top: circle.style.top,
      })
    }
  }

  var items = document.getElementsByClassName('item')
  for (let i = 0; i < items.length; i++) {
    var item = items[i]
    var endpoints = jsPlumb.getEndpoints(item.id);
    if(item.id != 'B'){
      nodes.push({
        //endpoints: endpoints,
        id: item.id,
        text: item.innerText,
        claas: 'item',
        left: item.style.left,
        top: item.style.top
      })
    }
  }

  var rhombuses = document.getElementsByClassName('rhombus')
  for (let i = 0; i < rhombuses.length; i++) {
    var rhombus = rhombuses[i]
    var endpoints = jsPlumb.getEndpoints(rhombus.id);
    if(rhombus.id != 'C'){
      nodes.push({

        id: rhombus.id,
        text: rhombus.innerText,
        claas: 'rhombus',
        left: rhombus.style.left,
        top: rhombus.style.top
      })
    }
  }


  var connections = [];
  var connects = jsPlumb.getConnections();
  connects.forEach(connect => {

    connections.push({
      pageSourceId: connect.sourceId,
      pageTargetId: connect.targetId
    })
  });

  var flowChart = {};
  flowChart.nodes = nodes;
  flowChart.connections = connections;

  var flowChartJson = JSON.stringify(flowChart);

  localStorage.setItem('flowChartJson',flowChartJson);
}

function loadFlowchart(){
  var flowChartJson = localStorage.getItem('flowChartJson');
  var flowChart = JSON.parse(flowChartJson);
  var nodes = flowChart.nodes;
  nodes.forEach(node =>{
      loadElem(node.id, node.claas, node.top, node.left,node.text);
  })

  var connections = flowChart.connections;
  connections.forEach(connect => {

    jsPlumb.ready(function () {
      jsPlumb.connect({
        isSource: true,
        isTarget: true,
        connector: 'Flowchart',
        source: connect.pageSourceId,
        target: connect.pageTargetId,
        overlays: [ ['Arrow', { width: 15, length: 18, location: 0.5 }] ]
      });
    });
  })
}


function loadElem(id,claas,top,left,text){
  // 创建一个div
  var div = document.createElement('div');

  // 生成div
  div.innerHTML = '<div id="'+id+'" class="'+claas+'" oncontextmenu="menu(this)" ondblclick="compile(this)" style="top:'+top+';left:'+left+'">'+text+'</div>'
  // 获取body对象
  var bo = document.body;
  // 动态插入到body中
  bo.insertBefore(div, bo.lastChild);
  // 加载
  window.jsPlumb.ready(function () {

    var jsPlumb = window.jsPlumb
    
    var common = {
        isSource: true,
        isTarget: true,
        connector: 'Flowchart',
      }
    if(claas === 'circle'){
      jsPlumb.addEndpoint(id,{
        anchor: 'Bottom'
      },common);
    }else{
      jsPlumb.addEndpoint(id,{
        anchor: 'Bottom'
      },common);
      jsPlumb.addEndpoint(id, {
        anchor: 'Left',
      },common);
  
      jsPlumb.addEndpoint(id,{
          anchor: 'Right'
      },common);
  
      jsPlumb.addEndpoint(id,{
        anchor: 'Top'
      },common);
    }
    jsPlumb.draggable(id);
  })
}