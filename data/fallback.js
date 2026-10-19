export const fallbackPosts=[
{
 id:'demo-healing',slug:'you-do-not-have-to-heal-all-at-once',title:'You do not have to heal all at once.',category:'Healing',excerpt:'A difficult day does not erase the quiet work you have already done. Healing is rarely a straight line.',emotion_tags:['healing','heartbreak'],featured:true,status:'published',published_at:'2026-08-25T00:00:00Z',
 content_blocks:[
  {id:'1',type:'paragraph',text:'Some days, healing feels obvious. You wake up lighter. You think about what happened a little less.'},
  {id:'2',type:'paragraph',text:'And then suddenly, one song, one photograph, one familiar place brings everything back. You wonder whether you were ever really healing. You were.'},
  {id:'3',type:'h2',text:'Some Days Will Still Feel Heavy'},
  {id:'4',type:'paragraph',text:'A difficult day does not erase all the quiet work you have already done. Missing someone again does not mean you need to return.'},
  {id:'5',type:'quote',text:'A painful moment is not proof that you have lost your progress.'},
  {id:'6',type:'h2',text:'Healing Often Happens Quietly'},
  {id:'7',type:'paragraph',text:'Not every form of healing feels dramatic. Sometimes it looks like not sending the message, choosing silence instead of another argument, or setting a boundary without explaining it ten times.'},
  {id:'8',type:'callout',title:'Carry This With You',text:'You do not have to become completely healed before you are allowed to live again. You only have to keep choosing yourself—one quiet decision at a time.'}
 ],
 content:''
},
{
 id:'demo-midnight',slug:'not-every-thought-needs-an-answer-tonight',title:'Not every thought needs an answer tonight.',category:'Midnight Thoughts',excerpt:'Some questions become clearer after rest, not after another hour of thinking.',emotion_tags:['overthinking','anxiety'],featured:false,status:'published',published_at:'2026-08-23T00:00:00Z',
 content_blocks:[{id:'1',type:'paragraph',text:'The mind often searches for certainty when the heart feels unsafe.'},{id:'2',type:'paragraph',text:'At night, small doubts can sound like emergencies. But urgency is not always truth.'},{id:'3',type:'h2',text:'Your Mind Is Trying To Protect You'},{id:'4',type:'paragraph',text:'Overthinking is often an attempt to prevent pain by predicting every possible outcome.'},{id:'5',type:'quote',text:'Rest is not avoidance. Sometimes distance is what lets clarity arrive.'}],content:''
},
{
 id:'demo-letting',slug:'missing-them-does-not-mean-you-should-return',title:'Missing them does not mean you should return.',category:'Letting Go',excerpt:'Nostalgia remembers warmth more easily than the reasons you had to leave.',emotion_tags:['missing-someone','letting-go'],featured:false,status:'published',published_at:'2026-08-20T00:00:00Z',
 content_blocks:[{id:'1',type:'paragraph',text:'Sometimes what you miss is not the relationship itself, but the familiarity, the memories, or the version of you that still believed everything would work out.'},{id:'2',type:'h2',text:'Sometimes You Miss the Memories'},{id:'3',type:'paragraph',text:'The mind has a strange way of softening the past.'},{id:'4',type:'quote',text:'Missing them proves they mattered. It does not prove they still belong in your life.'}],content:''
}
];

export const fallbackTopics={
'healing':{title:'Healing',symbol:'♡',headline:'You do not have to heal all at once.',intro:'Healing is not a race back to who you were. It is the slow work of becoming someone who can carry the past without living inside it.',quote:'A difficult day does not erase your progress.',prompts:['Missing them is not the same as needing them back.','You are allowed to have tender days.','Small peaceful decisions still count as healing.']},
'relationships':{title:'Relationships',symbol:'∞',headline:'Some relationships change us even after they end.',intro:'Love, attachment, distance, boundaries and endings can leave questions that take time to understand.',quote:'Not every relationship is meant to last forever to have mattered deeply.',prompts:['Notice what you keep excusing.','Love should not require self-abandonment.','Boundaries can be an act of love too.']},
'self-worth':{title:'Self-Worth',symbol:'◇',headline:'Your worth was never waiting for someone else to confirm it.',intro:"Rejection, distance, silence and endings can make you question yourself. But another person's choices are not a measurement of your value.",quote:'Someone not choosing you did not make you less worthy of being chosen.',prompts:['You do not need to earn basic care.','Comparison is not clarity.','Your value survives someone else’s absence.']},
'midnight-thoughts':{title:'Midnight Thoughts',symbol:'…',headline:'Not every thought needs an answer tonight.',intro:'The mind often searches for certainty when the heart feels unsafe. But not every question becomes clearer just because you think about it one more time.',quote:'Some thoughts can wait until morning. Rest is not avoidance.',prompts:['Name what is actually true.','Do not mistake anxiety for intuition.','Give tomorrow a chance to answer.']},
'letting-go':{title:'Letting Go',symbol:'↘',headline:'Missing them does not mean you should return.',intro:'Sometimes what you miss is not the relationship itself, but the familiarity, the memories, or the version of you that still believed everything would work out.',quote:'You can remember something with love and still know that returning would cost your peace.',prompts:['Nostalgia rarely remembers the full story.','Missing is not the same as belonging.','You can close a door without hating what was behind it.']},
'starting-again':{title:'Starting Again',symbol:'↻',headline:'Starting over is not starting from nothing.',intro:'You are entering the next chapter with lessons, boundaries, memories, clearer instincts and a deeper understanding of what you need.',quote:'The next chapter does not need to look like the last one to be meaningful.',prompts:['Take what you learned with you.','New does not mean empty.','You are allowed to begin differently.']}
};

export const fallbackHomepage={
 sections:[
  {slug:'hero',title:'Mood Hero',eyebrow:'HOW DOES YOUR HEART FEEL TODAY?',enabled:true,sort_order:10,settings:{}},
  {slug:'read_this_when',title:'Read This When',eyebrow:'FOR WHEREVER YOUR HEART IS TODAY',intro:'Choose a path based on what you are feeling.',enabled:true,sort_order:20,settings:{heading:'Read This When...'}},
  {slug:'tap_reveal',title:'Tap To Reveal',eyebrow:'PAUSE HERE',intro:'Tap a card to reveal the words waiting underneath.',enabled:true,sort_order:30,settings:{heading:'Which thought has been following you lately?'}},
  {slug:'give_words',title:'Give Me Words',eyebrow:'NEED SOMETHING TO HOLD ONTO?',enabled:true,sort_order:40,settings:{heading:'Give me words.'}},
  {slug:'letters',title:'Letters Never Sent',eyebrow:'LETTERS NEVER SENT',intro:'Private words that were folded in thought, carried for too long, and never delivered.',enabled:true,sort_order:50,settings:{heading:'Some things are easier to write than to say.'}},
  {slug:'community',title:'Community CTA',eyebrow:'UNTENANTED HEART COMMUNITY',intro:'Read community reflections, or leave a short note that another heart may need to find.',enabled:true,sort_order:60,settings:{heading:'Some stories become lighter when they are finally spoken.'}},
  {slug:'latest',title:'Latest Stories',eyebrow:'FROM THE HEART',intro:'Quiet stories, honest reflections, and words for feelings that are difficult to explain.',enabled:true,sort_order:70,settings:{heading:'Latest stories & reflections'}},
  {slug:'submit_story',title:'Submit Story CTA',eyebrow:'YOUR STORY',intro:'If you have lived through something that changed you, your experience may become the words another person has been searching for.',enabled:true,sort_order:80,settings:{heading:'Some stories become lighter when they are finally spoken.'}}
 ],
 items:[
  {id:'hm1',section_slug:'hero',item_type:'mood',label:'Healing',title:'You do not have to heal all at once.',body:'Some healing happens quietly — in the boundaries you finally keep, the messages you no longer send, and the peace you begin choosing.',link_label:'Read what your heart needs →',link_url:'/healing',accent:'#f1dfe0',enabled:true,sort_order:10},
  {id:'hm2',section_slug:'hero',item_type:'mood',label:'Missing Someone',title:'Missing them does not mean you should return.',body:'You can remember what was beautiful without forgetting what made you leave.',link_label:'Read about letting go →',link_url:'/letting-go',accent:'#eadde8',enabled:true,sort_order:20},
  {id:'hm3',section_slug:'hero',item_type:'mood',label:'Overthinking',title:'Not every thought needs an answer tonight.',body:'Some questions become clearer after rest, not after another hour of thinking.',link_label:'Read midnight thoughts →',link_url:'/midnight-thoughts',accent:'#dde5eb',enabled:true,sort_order:30},
  {id:'hm4',section_slug:'hero',item_type:'mood',label:'Lonely',title:'Being alone does not mean you are unwanted.',body:'Loneliness is a feeling — not a measurement of your worth.',link_label:'Read for your self-worth →',link_url:'/self-worth',accent:'#e8dfd6',enabled:true,sort_order:40},
  {id:'hm5',section_slug:'hero',item_type:'mood',label:'Starting Again',title:'Starting over is not starting from nothing.',body:'You are entering the next chapter with lessons, boundaries and clearer instincts.',link_label:'Read about starting again →',link_url:'/starting-again',accent:'#dfe8dc',enabled:true,sort_order:50},
  {id:'r1',section_slug:'read_this_when',item_type:'card',label:'01',title:'You miss someone you know you should not return to.',body:'For the nights when nostalgia begins rewriting the truth.',link_label:'Letting Go →',link_url:'/letting-go',enabled:true,sort_order:10},
  {id:'r2',section_slug:'read_this_when',item_type:'card',label:'02',title:'You are wondering whether you were ever enough.',body:'A reminder that another person does not get to define your value.',link_label:'Self-Worth →',link_url:'/self-worth',enabled:true,sort_order:20},
  {id:'t1',section_slug:'tap_reveal',item_type:'reveal',label:'01',title:'What if I never completely get over them?',body:'You do not have to erase someone to move forward without them. Healing is not forgetting.',enabled:true,sort_order:10},
  {id:'t2',section_slug:'tap_reveal',item_type:'reveal',label:'02',title:'Why was I never enough?',body:"Someone's inability to love you properly was never evidence that you were difficult to love.",enabled:true,sort_order:20},
  {id:'w1',section_slug:'give_words',item_type:'prompt',body:'Maybe today is not about fixing everything. Maybe it is simply about making it through gently.',enabled:true,sort_order:10},
  {id:'w2',section_slug:'give_words',item_type:'prompt',body:'You are allowed to miss what mattered without reopening what hurt you.',enabled:true,sort_order:20},
  {id:'tk1',section_slug:'hero',item_type:'ticker',body:'Healing takes its own time',enabled:true,sort_order:110},
  {id:'tk2',section_slug:'hero',item_type:'ticker',body:'You are allowed to choose yourself',enabled:true,sort_order:120},
  {id:'tk3',section_slug:'hero',item_type:'ticker',body:'Some endings are beginnings in disguise',enabled:true,sort_order:130},
  {id:'tk4',section_slug:'hero',item_type:'ticker',body:'Your feelings deserve space',enabled:true,sort_order:140}
 ]
};
