// var sampleLib=$.getJSON("audio/database.json");
var channels=sampleDatabase;

for(sample in sampleDatabase){
  sampleDatabase[sample]=new InstrumentSelectorItem(sampleDatabase[sample]);
}

for(c in channels){
  channels[c].id=c;
}
chanexp=function(){
  return JSON.stringify(channels);
}

function createSamplers(){
  for(chan in channels){
    thiscontainer=$('<div class="color_'+chan+' mixerPanel" id="editorPanel_'+chan+'"></div>');
    editorContainer=$('<div class="color_'+chan+' editorPanel"></div>');
    (function(){
      var mychan=chan;
      thiscontainer.on("mousedown",function(){
        focusChannel(mychan);
      });
    }());
    $("#pane").append(thiscontainer);
    $(thiscontainer).append(editorContainer);
    nx.add( "button" ,{name:"trigger"+chan, parent:thiscontainer, class:"trhee"});
    nx.add( "slider" ,{name:"vol"+chan, parent:thiscontainer,val:0.25});
    $("#trigger"+chan).css({width:"30px",height:"30px",display:"block"});
    nx.add( "waveform" ,{name:"cuep"+chan,parent:editorContainer,width:200,height:30});
    nx.widgets["cuep"+chan].mode="edge";
    nx.add( "number" ,{hslider:true,name:"rate"+chan, parent:editorContainer});
    nx.widgets["rate"+chan].step=0.005;
    nx.widgets["rate"+chan].height=30;
    channels[chan].engine=new Tone.Player({
      url:channels[chan].source,
      retrigger:true
    }).connect(effects);
  }

  Tone.Buffer.on("load",function(){
    // player.start();
    console.log("tone buffer ready");
    for(chan in channels){
      function a(){
        var thisChan=chan;
        nx.widgets["trigger"+thisChan].on("*",function(data){
          if(data.press==1){
            channels[thisChan].engine.start(0,channels[thisChan].startOffset,channels[thisChan].endTime);
            // console.log(thisChan);
          }
        });
        nx.widgets["vol"+thisChan].sendsTo(function(data){
          // console.log(data);
          channels[thisChan].engine.volume.value=data.value*70-60;
        })
        initval=0.75;
        nx.widgets["vol"+thisChan].set({
          value:initval
        });

        channels[thisChan].engine.volume.value=initval*70-60;
        // channels[thisChan].engine.volume=0.5*70-60;

        nx.widgets["cuep"+thisChan].setBuffer( channels[thisChan].engine._buffer._buffer );
        nx.widgets["cuep"+thisChan].select(channels[thisChan].startOffset*1000,(channels[thisChan].endTime+channels[thisChan].startOffset)*1000)
        // $("#cuep"+thisChan).css({width:"390px",height:"100px"});
        nx.widgets["rate"+thisChan].sendsTo(function(data){
          console.log("adj playrtate "+channels[thisChan].bpm/Tone.Transport.bpm.value );
          channels[thisChan].engine.playbackRate=data.value;
        });
        if(channels[thisChan].hasOwnProperty("bpm")){
          nx.widgets["rate"+chan].set({value:(Tone.Transport.bpm.value/channels[thisChan].bpm)},true);
        }else{
          nx.widgets["rate"+chan].set({value:1});
        }

        nx.widgets["cuep"+thisChan].on("*",function(data){
          // if(data.press==1){
          //pendiente:endoffset??
            channels[thisChan].startOffset=data.starttime/1000;
            channels[thisChan].endTime=(data.stoptime-data.starttime)/1000;
            // channels[thisChan].engine.start(0,channels[thisChan].startOffset,channels[thisChan].endTime);
            // console.log(data);
          // }
        });

      };
      a();
    }
  });
}