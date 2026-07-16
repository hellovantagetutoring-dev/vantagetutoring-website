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
    var tutors=[
      {name:'Jason',atar:'99.85'},
      {name:'Yun',atar:'99.90'},
      {name:'Keeran',atar:'99.50'},
      {name:'Brooklyn',atar:'99.75'},
      {name:'Jize',atar:'99.85'},
      {name:'Ken',atar:'99.85'},
      {name:'Lincoln',atar:'99.80'}
    ];
    var html='';
    for(var i=0;i<tutors.length;i++){
      html+='<span class="chip"><b>'+tutors[i].name+'</b><span class="score">'+tutors[i].atar+' ATAR</span></span>';
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

  // Enquiry form routing (1-on-1 / masterclass / assignment review)
  (function(){
    var form = document.getElementById('contactForm');
    if(!form) return;

    var finish = document.getElementById('formFinish');
    var typeGrid = document.getElementById('enquiryTypeGrid');
    var routeMap = {
      '1-on-1 tutoring': 'routeTutoring',
      'Weekly subject masterclass': 'routeMasterclass',
      'Assignment review': 'routeAssignment'
    };

    function showPanel(el, on){
      if(!el) return;
      var visible = !el.hasAttribute('hidden');
      if(on){
        if(visible) return;
        el.removeAttribute('hidden');
        el.classList.add('is-in');
      }else if(visible){
        el.classList.remove('is-in');
        el.setAttribute('hidden','');
      }
    }

    function syncHomeAddress(){
      var wrap = document.getElementById('homeAddressWrap');
      var input = document.getElementById('address');
      if(!wrap) return;
      var homeOn = !!form.querySelector('input[name="location[]"][value="In person (student\'s home)"]:checked');
      var tutoringOn = !!form.querySelector('input[name="enquiry_type"][value="1-on-1 tutoring"]:checked');
      var show = tutoringOn && homeOn;
      wrap.hidden = !show;
      if(input){
        input.disabled = !show;
        if(!show) input.value = '';
      }
    }

    function syncAvailabilitySummary(){
      var hidden = document.getElementById('availabilitySelected');
      if(!hidden) return;
      var picks = [].map.call(
        form.querySelectorAll('input[name="availability[]"]:checked:not(:disabled)'),
        function(el){ return el.value; }
      );
      hidden.value = picks.join(', ');
    }

    function setRoute(value){
      Object.keys(routeMap).forEach(function(key){
        var panel = document.getElementById(routeMap[key]);
        if(!panel) return;
        var on = !!value && key === value;
        showPanel(panel, on);

        [].forEach.call(panel.querySelectorAll('input, select, textarea'), function(el){
          el.disabled = !on;
          var needsRequired = el.hasAttribute('data-route-required');
          if(needsRequired){
            if(on) el.setAttribute('required','required');
            else el.removeAttribute('required');
          }
        });
      });

      showPanel(finish, !!value);
      if(finish){
        [].forEach.call(finish.querySelectorAll('input, select, textarea, button'), function(el){
          el.disabled = !value;
        });
      }
      syncHomeAddress();
      syncAvailabilitySummary();
    }

    function selectedType(){
      var checked = form.querySelector('input[name="enquiry_type"]:checked');
      return checked ? checked.value : null;
    }

    function applySelected(){
      // Keep "What are you after?" fixed in the viewport while panels open below
      var before = typeGrid ? typeGrid.getBoundingClientRect().top : null;
      setRoute(selectedType());
      if(typeGrid && before != null){
        var delta = typeGrid.getBoundingClientRect().top - before;
        if(Math.abs(delta) > 0.5) window.scrollBy(0, delta);
      }
    }

    [].forEach.call(form.querySelectorAll('input[name="enquiry_type"]'), function(r){
      r.addEventListener('change', applySelected);
    });

    [].forEach.call(form.querySelectorAll('.enquiry-type'), function(label){
      label.addEventListener('click', function(e){
        var input = label.querySelector('input[name="enquiry_type"]');
        if(!input) return;
        if(input.checked){
          e.preventDefault();
          applySelected();
          return;
        }
        input.checked = true;
        applySelected();
        e.preventDefault();
      });
    });

    [].forEach.call(form.querySelectorAll('input[name="location[]"]'), function(el){
      el.addEventListener('change', syncHomeAddress);
    });

    form.addEventListener('change', function(e){
      if(e.target && e.target.name === 'availability[]') syncAvailabilitySummary();
    });

    [].forEach.call(form.querySelectorAll('[data-avail-expand]'), function(btn){
      btn.addEventListener('click', function(){
        var id = btn.getAttribute('data-avail-expand');
        var panel = document.getElementById(id);
        if(!panel) return;
        var open = panel.hasAttribute('hidden');
        if(open) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden','');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var show = btn.querySelector('.avail-expand-show');
        var hide = btn.querySelector('.avail-expand-hide');
        if(show) show.hidden = open;
        if(hide) hide.hidden = !open;
      });
    });

    applySelected();

    [].forEach.call(document.querySelectorAll('[data-enquiry]'), function(a){
      a.addEventListener('click', function(){
        var map = {masterclass:'Weekly subject masterclass', assignment:'Assignment review'};
        var val = map[a.getAttribute('data-enquiry')];
        if(!val) return;
        var input = form.querySelector('input[name="enquiry_type"][value="'+val+'"]');
        if(input){
          input.checked = true;
          applySelected();
        }
      });
    });
  })();



})();
