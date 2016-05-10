
var masterDelay = new Tone.FeedbackDelay("8n", 0.32).toMaster();
masterDelay.delayTime.value=0.14;
masterDelay.feedback.value=0.14;
var effects=new Tone.Volume(-6).connect(masterDelay);
