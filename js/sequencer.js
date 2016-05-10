Button=function(n,parent,props={}){
  this.momentary=false;
  if(props.hasOwnProperty("momentary")){
    this.momentary=props.momentary;
  }
  this.jq=$('<div class="seqbutton"></div>');
  parent.jq.append(this.jq);
  this.data=0;
  var me=this;
  this.onTweak=function(data){}
  this.setData=function(to){
    this.onTweak(to);
    if(to==1){
      this.data=1;
      this.jq.addClass("on");
      parent.aliveChild++;
    }
    if(to==0){
      this.data=0;
      this.jq.removeClass("on");
      parent.aliveChild--;
    }
  }
  if(this.momentary){
    this.jq.on("mouseup",function(event){
      me.setData(0);
    });
  }
  this.jq.on("mousedown",function(event){
    event.preventDefault();
    if(this.momentary){
      me.setData(1);
    }else{
      me.setData(Math.abs(me.data-1));
    }
    // me.data=;
    if(me.data==1){
       mouse.switching=true;
    }else{
    //   $(this).removeClass("on");
    //   parent.aliveChild--;
       mouse.switching=false;
     }
  });
  this.jq.on("mouseenter",function(){
    if(mouse.buttonDown){
      if(mouse.switching){
        if(me.data==0){
          me.setData(1);
        }
      }else{
        if(me.data==1){
          me.setData(0);
        }
      }
    }
  });
  this.eval=function(){
    var jq=this.jq;
    jq.addClass("turn");
    window.setTimeout(function(){
      jq.removeClass("turn");
    },200);
    return this.data;
  }
}
ChannelSelector=function(n,parent){
  this.jq=$('<select id="ChannelSelector_'+n+'">controls</div>');
  this.Option=function(n,parent){
    this.parent=parent;
    this.jq=$('<option value="'+n+'">a'+channels[n].name+'</div>');
    console.log(n);
    if(channels[n].hasOwnProperty("bpm")){
      this.jq.append(" ["+channels[n].bpm+"]");
    }
    parent.jq.append(this.jq);
  }
  this.options=[];
  this.refreshOptions=function(){
    for(a in channels){
      this.options[a]=new Option(a,parent);
    }
    new Option(n,this)
  }
  this.refreshOptions();
  // this.jq.addClass("color_1");
  parent.jq.append(this.jq);
  this.parent=parent;
  this.restartButton=new ControllerButton(n,this,{momentary:true});
  this.restartButton.onTweak=function(to){
    console.log(this);
    if(to==1){
      parent.pos=0;
    }
  }
}
ControllerButton=Button;
SequencerButton=Button;

Controller=function(n,parent){
  this.jq=$(' <div id="SCont_'+n+'" class="seqController">controls</div>');
  // this.jq.addClass("color_1");
  parent.jq.append(this.jq);
  this.parent=parent;
  this.restartButton=new ControllerButton(n,this,{momentary:true});
  this.chanSel=new ChannelSelector(n,this);
  this.restartButton.onTweak=function(to){
    console.log(this);
    if(to==1){
      parent.pos=0;
    }
  }
}
Sequencer=function(n){
  $("#sequencers").append('<div class="sequencer" id="seq_'+n+'"></div>');
  this.alive=false;
  this.jq=$('#seq_'+n);
  this.controller=new Controller(n,this);
  this.pos=0;
  this.data=[];
  this.len=Math.pow(2,(n%5)+1);
  this.evry=Math.pow(2,(n%4)+1);
  //must count an [every] amount of beats for each pos increment.
  this.subpos=0;
  // this.jq.css({width:16*Math.ceil(this.len/4)+"px"});
  this.jq.css({width:"128px"});
  this.jq.addClass("color_"+n%channels.length);
  this.disp=0;
  this.id=n;
  var me=this;
  this.channel=channels[this.id%channels.length];
  for(bn=0; bn<this.len; bn++){
    this.data[bn]=new SequencerButton(bn,this)
  }
  this.aliveChild=0;
  this.step=function(){
    this.alive=this.aliveChild>0;
    if(this.alive){
      if(this.subpos%this.evry==0){
        if(this.data[this.pos].eval()==1){
          this.channel.engine.start(0,this.channel.startOffset,this.channel.endTime);
        }
        this.pos=(this.pos+1)%this.len;
      }else{
      }
    }
    this.subpos++;
  }
  // this.onStepTrigger=function(data){
  //   // console.log(data);
  // }
  this.jq.on("mouseenter",function(){
    focusChannel(me.channel.id);
  });
}