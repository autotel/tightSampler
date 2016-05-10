InstrumentSelectorItem=function(databaseItem){
  this.jq=$('<div class="sampleItem"></div>');
  this.appendTo=$("#sampleManager");
  this.databaseItem=databaseItem;
  this.setContent(this.databaseItem);
  this.appendTo.append(this.jq);
}
InstrumentSelectorItem.prototype.setContent=function(databaseItem){
  this.jq.html(this.databaseItem.name+"<small>"+(this.databaseItem.bpm||"x")+"</small>");
}