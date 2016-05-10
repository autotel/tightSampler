InstrumentItem=function(content){
  this.jq=$('<div class="sampleItem"></div>');
  this.appendTo=$("#samplersManager");
  this.sampleItem=content;
  this.setSample(this.content);
  this.appendTo.append(this.jq);
  this.toneSampler;
  this.color=content.color;
  this.unique=content.unique;
}
InstrumentItem.prototype.setSample=function(content){
  var parent=this;
  this.sampleItem=content;
  this.jq.html(this.sampleItem.name);

  nx.add( "button" ,{name:"trigger"+this.unique, parent:this.jq, class:"trhee"});
  nx.add( "slider" ,{name:"vol"+this.unique, parent:this.jq,val:0.25});
  nx.add( "waveform" ,{name:"cuep"+this.unique,parent:editorContainer,width:200,height:30});
  nx.add( "number" ,{hslider:true,name:"rate"+this.unique, parent:editorContainer});

  $("#trigger"+this.unique).css({width:"30px",height:"30px",display:"block"});

  nx.widgets["cuep"+this.unique].mode="edge";
  nx.widgets["rate"+this.unique].step=0.005;
  nx.widgets["rate"+this.unique].height=30;

  this.toneSampler=new Tone.Sampler(this.sampleItem.source).on("load",function(){
    parent.jq.css({"background-color":parent.color});
    nx.widgets["cuep"+parent.unique].setBuffer( parent.toneSampler._buffer._buffer );
    nx.widgets["cuep"+parent.unique].select(channels[parent.unique].startOffset*1000,(channels[parent.unique].endTime+channels[parent.unique].startOffset)*1000);
    nx.widgets["trigger"+parent.unique].on("*",function(data){
      console.log("this is not working: I need to hack the Tone library to enable sampler cuepoints.");
      if(data.press==1){
        parent.toneSampler.start(0,channels[parent.unique].startOffset,channels[parent.unique].endTime);
        // console.log(parent.unique);
      }
    });
    nx.widgets["vol"+parent.unique].sendsTo(function(data){
      // console.log(data);
      parent.toneSampler.volume.value=data.value*70-60;
    })
    initval=0.75;
    nx.widgets["vol"+parent.unique].set({
      value:initval
    });

    parent.toneSampler.volume.value=initval*70-60;
  }).toMaster();
}