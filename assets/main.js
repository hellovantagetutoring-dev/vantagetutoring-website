(function(){
  'use strict';

  // Mobile nav
  var toggle=document.getElementById('navtoggle');
  var links=document.getElementById('navlinks');
  if(toggle&&links){
    toggle.addEventListener('click',function(){links.classList.toggle('open');});
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){links.classList.remove('open');});
    });
  }

  // Typing animation (home)
  var typed=document.getElementById('typed'), cursor=document.getElementById('cursor');
  if(typed){
    var words=(typed.getAttribute('data-words')||'QCE.,ATAR.,future.,A+.').split(',');
    var w=0,c=0,deleting=false;
    (function tick(){
      var word=words[w];
      typed.textContent=deleting?word.substring(0,c--):word.substring(0,c++);
      var delay=deleting?55:110;
      if(!deleting&&c===word.length+1){deleting=true;delay=1500;}
      else if(deleting&&c<0){deleting=false;w=(w+1)%words.length;c=0;delay=350;}
      setTimeout(tick,delay);
    })();
  }

  // Tutor marquee
  var marquee=document.getElementById('marquee');
  if(marquee){
    var names=['Benjamin','Zara','Sam','Poppy','Maddie','Charli','Patrick','Kiran','Olivia','Daniel','Rebecca','Joshua','Alexander','Anna','Harry','Rhys','Isaiah','Kai'];
    var scores=['99.95','99.90','99.85','99.75','99.70','99.65','99.55','99.45','99.40','99.30'];
    var html='';
    for(var i=0;i<names.length;i++){
      html+='<span class="chip"><b>'+names[i]+'</b><span class="score">'+scores[i%scores.length]+' ATAR</span></span>';
    }
    marquee.innerHTML=html+html;
  }

  // Animated counters
  var counters=document.querySelectorAll('.num[data-count]');
  if(counters.length){
    var counted=false;
    function run(){
      if(counted)return;counted=true;
      counters.forEach(function(el){
        var target=parseFloat(el.getAttribute('data-count'));
        var dec=parseInt(el.getAttribute('data-decimals')||'0',10);
        var suffix=el.getAttribute('data-suffix')||'';
        var start=null,dur=1600;
        function step(ts){
          if(!start)start=ts;
          var p=Math.min((ts-start)/dur,1);
          var eased=1-Math.pow(1-p,3);
          var val=(target*eased).toFixed(dec);
          el.textContent=Number(val).toLocaleString('en-AU',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suffix;
          if(p<1)requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var anchor=document.querySelector('.stats')||counters[0];
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){run();io.disconnect();}});
    },{threshold:.4});
    io.observe(anchor);
  }

  // Scroll reveal
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var rio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}});
    },{threshold:.12});
    reveals.forEach(function(el,i){el.style.transitionDelay=(i%4*70)+'ms';rio.observe(el);});
  }

  // Other subject field toggle
  var otherCb=document.getElementById('subjectOther');
  var otherWrap=document.getElementById('otherSubjectWrap');
  var otherInput=document.getElementById('other_subject');
  if(otherCb&&otherWrap){
    function syncOther(){
      var on=otherCb.checked;
      otherWrap.hidden=!on;
      if(otherInput){
        otherInput.required=on;
        if(!on)otherInput.value='';
      }
    }
    otherCb.addEventListener('change',syncOther);
    syncOther();
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.faq-item');
      var open=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
      if(!open)item.classList.add('open');
    });
  });

  // Formspree AJAX
  var form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=form.querySelector('button[type=submit]');
      var original=btn.innerHTML;
      btn.textContent='Sending…';btn.disabled=true;
      fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){
            form.style.display='none';
            var ok=document.getElementById('formSuccess');
            if(ok)ok.classList.add('show');
          }else{
            r.json().then(function(d){
              alert(d.errors?d.errors.map(function(x){return x.message;}).join(', '):'Oops, something went wrong. Please email us instead.');
              btn.innerHTML=original;btn.disabled=false;
            });
          }
        })
        .catch(function(){
          alert('Network error, please email hello@vantagetutoring.com.au instead.');
          btn.innerHTML=original;btn.disabled=false;
        });
    });
  }
})();
