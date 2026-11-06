/* Ingryd’s Workspace — scripts */

/* ===== Áreas, listas e preferências ===== */
(function(){

  (function(){
    var CH="progresso-semana", est={};
    try{ est=JSON.parse(localStorage.getItem(CH)||"{}")||{}; }catch(e){ est={}; }
    function salva(){ try{ localStorage.setItem(CH,JSON.stringify(est)); }catch(e){} }
    function pinta(g){
      var bs=g.querySelectorAll(".marca-passo"), f=0;
      bs.forEach(function(b){
        var on=!!est[b.dataset.k]; if(on) f++;
        b.setAttribute("aria-pressed",on?"true":"false");
        b.parentNode.classList.toggle("feito",on);
      });
      g.querySelector(".cont").textContent=f+"/"+bs.length;
    }
    document.querySelectorAll(".grupo").forEach(function(g){
      pinta(g); g._pinta=pinta;
      g.addEventListener("click",function(e){
        var b=e.target.closest(".marca-passo");
        if(b){ est[b.dataset.k]=!est[b.dataset.k]; salva(); pinta(g); return; }
        if(e.target.closest(".limpar")){
          g.querySelectorAll(".marca-passo").forEach(function(x){ delete est[x.dataset.k]; });
          salva(); pinta(g);
        }
      });
    });
  })();

  (function(){
    var t=document.getElementById("metas-texto"); if(!t) return;
    function ajusta(){ t.style.height="auto"; t.style.height=Math.max(t.scrollHeight,0)+"px"; }
    try{ t.value=localStorage.getItem("metas")||""; }catch(e){}
    ajusta();
    t.addEventListener("input",function(){ ajusta(); try{ localStorage.setItem("metas",t.value); }catch(e){} });
    window.addEventListener("resize",ajusta);
    document.addEventListener("click",function(){ setTimeout(ajusta,0); });
  })();

  document.addEventListener("click",function(e){
    var b=e.target.closest(".info");if(!b)return;
    var p=b.parentNode.querySelector(".painel");if(!p)return;
    var abrir=p.hidden;p.hidden=!abrir;b.setAttribute("aria-expanded",abrir?"true":"false");
  });
  (function(){
    var CH="pessoal-afazeres", N=5, est={t:[],c:[]};
    try{ var x=JSON.parse(localStorage.getItem(CH)||"null"); if(x&&x.t&&x.c) est=x; }catch(e){}
    var li=document.querySelectorAll(".af"), cont=document.getElementById("cont-af");
    function salva(){ try{ localStorage.setItem(CH,JSON.stringify(est)); }catch(e){} }
    function pinta(){
      var f=0;
      li.forEach(function(el,i){
        var on=!!est.c[i]; if(on) f++;
        el.classList.toggle("feito",on);
        el.querySelector(".marca-af").setAttribute("aria-pressed",on?"true":"false");
      });
      cont.textContent=f+"/"+N;
    }
    li.forEach(function(el,i){
      var inp=el.querySelector(".txt-af");
      inp.value=est.t[i]||"";
      inp.addEventListener("input",function(){ est.t[i]=inp.value; salva(); });
      el.querySelector(".marca-af").addEventListener("click",function(){ est.c[i]=!est.c[i]; salva(); pinta(); });
    });
    document.getElementById("limpar-af").addEventListener("click",function(){
      li.forEach(function(el,i){
        if(est.c[i]){ est.c[i]=false; est.t[i]=""; el.querySelector(".txt-af").value=""; }
      });
      salva(); pinta();
    });
    pinta();
  })();

  (function(){
    var t=document.getElementById("notas-pessoal"); if(!t) return;
    function ajusta(){ t.style.height="auto"; t.style.height=t.scrollHeight+"px"; }
    try{ t.value=localStorage.getItem("notas-pessoal")||""; }catch(e){}
    ajusta();
    t.addEventListener("input",function(){ ajusta(); try{ localStorage.setItem("notas-pessoal",t.value); }catch(e){} });
    window.addEventListener("resize",ajusta);
    window.addEventListener("hashchange",function(){ setTimeout(ajusta,0); });
  })();

  (function(){
    var DADOS=[];
    try{ DADOS=JSON.parse(localStorage.getItem("informacoes")||"[]")||[]; }catch(e){ DADOS=[]; }
    var cab=document.getElementById("abrir-senhas"), lista=document.getElementById("painel-senhas");
    if(!cab||!lista) return;
    var MASCARA="••••••••";
    var OLHO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    var OLHO_RISCADO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/></svg>';
    function el(tag,cls,txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
    function estado(v,b,nome,visivel,senha){
      v.textContent=visivel?senha:MASCARA;
      b.innerHTML=visivel?OLHO:OLHO_RISCADO;
      b.setAttribute("aria-pressed",visivel?"true":"false");
      b.setAttribute("aria-label",(visivel?"Ocultar":"Mostrar")+" senha de "+nome);
    }
    var reset=[];
    function salvarDados(){ try{ localStorage.setItem("informacoes",JSON.stringify(DADOS)); }catch(e){} }
    function desenha(){
      lista.innerHTML=""; reset.length=0;
      var ant="";
      DADOS.forEach(function(d,idx){
        var seq=(d[0]===ant); ant=d[0];
        var linha=el("div","cred"+(seq?" seq":""));
        linha.appendChild(el("span","cred-nome",d[0]));
        var c1=el("div","cred-campo");
        c1.appendChild(el("span","cred-val",d[1]));
        var c2=el("div","cred-campo");
        var v=el("span","cred-val senha");
        var b=el("button","olho"); b.type="button";
        var visivel=false;
        estado(v,b,d[0],false,d[2]);
        b.addEventListener("click",function(){ visivel=!visivel; estado(v,b,d[0],visivel,d[2]); });
        reset.push(function(){ visivel=false; estado(v,b,d[0],false,d[2]); });
        var x=el("button","rem","×"); x.type="button"; x.setAttribute("aria-label","Remover "+d[0]+" ("+d[1]+")");
        x.addEventListener("click",function(){ if(confirm("Remover "+d[0]+" ("+d[1]+")?")){ DADOS.splice(idx,1); salvarDados(); desenha(); } });
        c2.appendChild(v); c2.appendChild(b); c2.appendChild(x);
        linha.appendChild(c1); linha.appendChild(c2);
        lista.appendChild(linha);
      });
      var rod=el("div","imp-rod");
      if(!DADOS.length) rod.appendChild(el("p","imp-msg","Nenhuma informação salva ainda."));
      var form=el("div","add-form"); form.hidden=true;
      function campo(ph,tipo){ var i=document.createElement("input"); i.type=tipo||"text"; i.placeholder=ph; i.setAttribute("aria-label",ph); i.autocomplete="off"; i.maxLength=200; return i; }
      var fn=campo("Nome (ex.: Estácio)"), fu=campo("Usuário ou e-mail"), fs=campo("Senha","password"); fs.autocomplete="new-password";
      var ok=el("button","btn","Salvar"); ok.type="button";
      function grava(){
        var n=fn.value.trim(), u=fu.value.trim(), sn=fs.value;
        if(!n||!u&&!sn) return;
        DADOS.push([n,u,sn]); salvarDados(); desenha();
              }
      ok.addEventListener("click",grava);
      [fn,fu,fs].forEach(function(i){ i.addEventListener("keydown",function(e){ if(e.key==="Enter") grava(); }); });
      form.appendChild(fn); form.appendChild(fu); form.appendChild(fs); form.appendChild(ok);
      var abre=el("button","imp-btn","Adicionar"); abre.type="button";
      abre.addEventListener("click",function(){ form.hidden=!form.hidden; if(!form.hidden) fn.focus(); });
      rod.appendChild(abre); rod.appendChild(form); lista.appendChild(rod);
    }
    desenha();
    function fecha(){
      lista.hidden=true; cab.setAttribute("aria-expanded","false");
      reset.forEach(function(f){ f(); });
    }
    cab.addEventListener("click",function(){
      if(lista.hidden){ lista.hidden=false; cab.setAttribute("aria-expanded","true"); } else fecha();
    });
    window.addEventListener("hashchange",fecha);
    document.addEventListener("visibilitychange",function(){ if(document.hidden) fecha(); });
  })();

  (function(){
    document.querySelectorAll(".filtro").forEach(function(f){
      var alvo=document.getElementById(f.dataset.alvo);
      var cont=document.getElementById(f.dataset.alvo==="tab-ideias"?"ct-ideias":"ct-fav");
      function conta(){ var n=alvo.querySelectorAll(".tab-lin:not([hidden])").length; if(cont) cont.textContent=n; }
      f.addEventListener("click",function(e){
        var b=e.target.closest(".chip"); if(!b) return;
        f.querySelectorAll(".chip").forEach(function(c){ c.setAttribute("aria-pressed",c===b?"true":"false"); });
        alvo.querySelectorAll(".tab-lin").forEach(function(l){ l.hidden=!!b.dataset.tema && l.dataset.tema!==b.dataset.tema; });
        conta();
      });
      conta();
    });
    document.querySelectorAll(".cmp .marca-af").forEach(function(b){
      b.addEventListener("click",function(){
        var on=b.getAttribute("aria-pressed")!=="true";
        b.setAttribute("aria-pressed",on?"true":"false");
        b.parentNode.classList.toggle("feito",on);
      });
    });
  })();

  (function(){
    document.querySelectorAll(".acc-btn").forEach(function(b){
      b.addEventListener("click",function(){
        var c=document.getElementById(b.getAttribute("aria-controls")); if(!c) return;
        var abre=c.hidden; c.hidden=!abre;
        b.setAttribute("aria-expanded",abre?"true":"false");
      });
    });
  })();

  (function(){
    var CH="wishlist", rows=document.querySelectorAll(".lista-compras .cmp"), est=null;
    try{ est=JSON.parse(localStorage.getItem(CH)||"null"); }catch(e){}
    if(!Array.isArray(est)) est=null;
    function ler(){ return Array.prototype.map.call(rows,function(r){ return {t:r.querySelector(".txt-af").value,c:r.querySelector(".marca-af").getAttribute("aria-pressed")==="true"}; }); }
    function salva(){ try{ localStorage.setItem(CH,JSON.stringify(ler())); }catch(e){} }
    rows.forEach(function(r,i){
      var inp=r.querySelector(".txt-af"), b=r.querySelector(".marca-af");
      if(est&&est[i]){ inp.value=est[i].t||""; b.setAttribute("aria-pressed",est[i].c?"true":"false"); r.classList.toggle("feito",!!est[i].c); }
      inp.addEventListener("input",salva);
      b.addEventListener("click",function(){ setTimeout(salva,0); });
    });
  })();

  (function(){
    var COR={Escrita:"var(--turquesa)",Projeto:"var(--oliva)",Maquiagem:"var(--azul)",Pele:"var(--turquesa)",Corpo:"var(--oliva)",Perfume:"#d8c47a"};
    var editTipo=(function(){ var t=document.createElement("span"); try{ t.contentEditable="plaintext-only"; }catch(e){} return t.contentEditable==="plaintext-only"?"plaintext-only":"true"; })();
    var PAL=["#6fa3b0","#7d8b5c","#d8c47a","#d9a9a1","#b58fc4","#e0955f","#5fae9b","#c77d8a"];
    function corDe(t){ if(COR[t]) return COR[t]; var h=0; for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return PAL[h%PAL.length]; }
    function todosExtras(){ try{ return JSON.parse(localStorage.getItem("temas-extra")||"{}")||{}; }catch(e){ return {}; } }
    function hoje(){ var d=new Date(); return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2); }
    function cfg(o){
      var est=[]; try{ est=JSON.parse(localStorage.getItem(o.chave)||"[]")||[]; }catch(e){ est=[]; }
      if(!Array.isArray(est)) est=[];
      var tab=document.getElementById(o.tab), cont=document.getElementById(o.cont), filtro=document.querySelector('.filtro[data-alvo="'+o.tab+'"]'), novo=document.getElementById(o.novo);
      function salva(){ try{ localStorage.setItem(o.chave,JSON.stringify(est)); }catch(e){} }
      var extras=todosExtras()[o.chave]; if(!Array.isArray(extras)) extras=[];
      function temasAtuais(){ return o.temas.concat(extras); }
      function gravaExtras(){ var all=todosExtras(); all[o.chave]=extras; try{ localStorage.setItem("temas-extra",JSON.stringify(all)); }catch(e){} }
      function chipNovo(n){
        var g=document.createElement("span"); g.className="chip-g";
        var c=document.createElement("button"); c.type="button"; c.className="chip"; c.dataset.tema=n; c.setAttribute("aria-pressed","false"); c.textContent=n;
        var x=document.createElement("button"); x.type="button"; x.className="chip-x"; x.textContent="×"; x.setAttribute("aria-label","Excluir categoria "+n);
        x.addEventListener("click",function(){
          if(est.some(function(it){ return it.t===n; })){ alert("Ainda há itens na categoria \""+n+"\". Remova esses itens antes de excluí-la."); return; }
          if(!confirm("Excluir a categoria \""+n+"\"?")) return;
          if(c.getAttribute("aria-pressed")==="true"){ var td=filtro.querySelector('.chip[data-tema=""]'); if(td) td.setAttribute("aria-pressed","true"); }
          extras=extras.filter(function(t){ return t!==n; }); gravaExtras(); g.remove(); aplica();
        });
        g.appendChild(c); g.appendChild(x); filtro.appendChild(g);
      }
      function novaTema(n){
        n=(n||"").replace(/\s+/g," ").trim(); if(!n) return "";
        var ex=temasAtuais().filter(function(t){ return t.toLowerCase()===n.toLowerCase(); })[0]; if(ex) return ex;
        extras.push(n); gravaExtras(); chipNovo(n); return n;
      }
      extras.forEach(chipNovo);
      function aplica(){
        var ch=filtro.querySelector('.chip[aria-pressed="true"]'), tema=ch?ch.dataset.tema:"", n=0;
        tab.querySelectorAll(".tab-lin").forEach(function(l){ var h=!!tema&&l.dataset.tema!==tema; l.hidden=h; if(!h) n++; });
        if(cont) cont.textContent=n;
      }
      function el(t,c,x){ var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e; }
      function desenha(){
        tab.querySelectorAll(".tab-lin").forEach(function(l){ l.remove(); });
        est.forEach(function(it,idx){
          var l=el("div","tab-lin"); l.dataset.tema=it.t;
          if(o.data) l.appendChild(el("span","dt",it.d||""));
          var tg=el("span","tag",it.t); tg.style.setProperty("--tag",corDe(it.t)); l.appendChild(tg);
          var tx=el("span","vaz",it.x||""); tx.contentEditable=editTipo; tx.spellcheck=false; tx.dataset.ph=o.ph;
          tx.addEventListener("input",function(){ it.x=tx.textContent; salva(); });
          tx.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); tx.blur(); } });
          l.appendChild(tx);
          var r=el("button","rem","×"); r.type="button"; r.setAttribute("aria-label","Remover");
          r.addEventListener("click",function(){ if(confirm("Remover este item?")){ est.splice(idx,1); salva(); desenha(); } });
          l.appendChild(r);
          tab.appendChild(l);
        });
        aplica();
      }
      var form=null;
      function abreForm(){
        if(form){ form.querySelector("input").focus(); return; }
        form=el("div","add-form");
        var sel=document.createElement("select"); sel.setAttribute("aria-label","Tema");
        temasAtuais().concat(["__nova"]).forEach(function(t){ var op=document.createElement("option"); op.value=t; op.textContent=t==="__nova"?"+ Nova categoria…":t; sel.appendChild(op); });
        var inp=document.createElement("input"); inp.type="text"; inp.className="txt-nova"; inp.placeholder=o.ph; inp.setAttribute("aria-label",o.ph); inp.maxLength=300; inp.autocomplete="off";
        var ok=el("button","btn","Adicionar"); ok.type="button";
        var cat=document.createElement("input"); cat.type="text"; cat.className="txt-nova"; cat.placeholder="Nome da nova categoria…"; cat.maxLength=24; cat.hidden=true; cat.autocomplete="off"; cat.setAttribute("aria-label","Nome da nova categoria");
        sel.addEventListener("change",function(){ cat.hidden=sel.value!=="__nova"; if(!cat.hidden) cat.focus(); });
        function fecha(){ form.remove(); form=null; }
        function grava(){
          var v=inp.value.trim(); if(!v) return;
          var tema=sel.value;
          if(tema==="__nova"){ tema=novaTema(cat.value); if(!tema){ cat.focus(); return; } }
          var it={t:tema,x:v}; if(o.data) it.d=hoje();
          est.unshift(it); salva(); desenha(); fecha();
        }
        ok.addEventListener("click",grava);
        inp.addEventListener("keydown",function(e){ if(e.key==="Enter") grava(); else if(e.key==="Escape") fecha(); });
        cat.addEventListener("keydown",function(e){ if(e.key==="Enter") grava(); else if(e.key==="Escape") fecha(); });
        form.appendChild(sel); form.appendChild(cat); form.appendChild(inp); form.appendChild(ok);
        novo.parentNode.insertBefore(form,novo);
        inp.focus();
      }
      novo.addEventListener("click",abreForm);
      novo.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); abreForm(); } });
      filtro.addEventListener("click",function(){ setTimeout(aplica,0); });
      desenha();
    }
    cfg({chave:"ideias",tab:"tab-ideias",cont:"ct-ideias",novo:"novo-ideia",temas:["Escrita","Projeto"],data:true,ph:"Escreva a ideia…"});
    cfg({chave:"favoritos",tab:"tab-fav",cont:"ct-fav",novo:"novo-fav",temas:["Maquiagem","Pele","Corpo","Perfume"],data:false,ph:"Nome do produto…"});
  })();

  var AREAS={
    trabalho:{t:"Trabalho",d:"Tudo o que depende de mim: entregas, pendências e prazos."},
    pessoal:{t:"Pessoal",d:"Minhas ideias, projetos e interesses."},
    projetos:{t:"Projetos",d:"Meus projetos de programação, do código à entrega."},
    estudos:{t:"Estudos",d:"Meus cursos, leituras e metas de aprendizado."}
  };
  var botoes=document.querySelectorAll("nav button");
  function mostrar(id){
    if(!AREAS[id]) id="trabalho";
    document.getElementById("titulo").textContent=AREAS[id].t;
    document.getElementById("descricao").textContent=AREAS[id].d;
    document.getElementById("vazio-titulo").textContent="Nenhum módulo em "+AREAS[id].t;
    document.getElementById("area-trabalho").hidden=(id!=="trabalho");
    document.getElementById("area-pessoal").hidden=(id!=="pessoal");
    document.getElementById("area-vazio").hidden=(id==="trabalho"||id==="pessoal");
    if(window.__edAreas) window.__edAreas(id);
    botoes.forEach(function(b){
      if(b.dataset.area===id) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
    });
  }
  botoes.forEach(function(b){
    b.addEventListener("click",function(){ location.hash=b.dataset.area; });
  });
  window.addEventListener("hashchange",function(){ mostrar(location.hash.slice(1)); });
  mostrar(location.hash.slice(1));
  var CHAVE="higienizacao_link",PADRAO="";
  var lh=document.getElementById("link-higienizacao"),cx=document.getElementById("caixa-hig"),inp=document.getElementById("input-hig"),er=document.getElementById("erro-hig");
  var _l=""; try{ _l=localStorage.getItem(CHAVE)||PADRAO; }catch(e){ _l=PADRAO; }
  if(_l) lh.href=_l; else lh.removeAttribute("href");
  document.getElementById("editar-hig").addEventListener("click",function(){
    cx.hidden=!cx.hidden;
    if(!cx.hidden){ inp.value=lh.getAttribute("href")||""; inp.focus(); inp.select(); }
  });
  function salvarHig(){
    var v=inp.value.trim();
    if(!/^https:\/\//i.test(v)){ inp.setAttribute("aria-invalid","true"); er.hidden=false; return; }
    inp.removeAttribute("aria-invalid"); er.hidden=true;
    lh.href=v;
    try{ localStorage.setItem(CHAVE,v); }catch(e){}
    cx.hidden=true;
  }
  document.getElementById("salvar-hig").addEventListener("click",salvarHig);
  inp.addEventListener("keydown",function(e){ if(e.key==="Enter") salvarHig(); });
  var raiz=document.documentElement;
  try{ var salvo=localStorage.getItem("tema"); if(salvo) raiz.setAttribute("data-theme",salvo); }catch(e){}
  var bt=document.getElementById("tema");
  function ehEscuro(){ return raiz.getAttribute("data-theme")==="dark"||(!raiz.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches); }
  function sincronizar(){ bt.setAttribute("aria-pressed",ehEscuro()?"true":"false"); }
  sincronizar();
  bt.addEventListener("click",function(){
    var novo=ehEscuro()?"light":"dark";
    raiz.setAttribute("data-theme",novo);
    try{ localStorage.setItem("tema",novo); }catch(e){}
    sincronizar();
  });
})();

/* ===== Modo edição ===== */
(function(){
  var CH="edicoes", ed={t:{},l:{},listas:{},a:{}};
  try{ var j=JSON.parse(localStorage.getItem(CH)||"{}")||{}; ed.t=j.t||{}; ed.l=j.l||{}; ed.listas=j.listas||{}; ed.a=j.a||{}; }catch(e){}
  function salva(){ try{ localStorage.setItem(CH,JSON.stringify(ed)); }catch(e){} }
  var body=document.body;
  var AREAS_ID=["trabalho","pessoal","estudos","projetos"];

  /* --- marca todos os textos editáveis (em todas as abas) --- */
  function embrulha(el){
    Array.prototype.slice.call(el.childNodes).forEach(function(n){
      if(n.nodeType===3 && n.textContent.trim()){
        var sp=document.createElement("span"); sp.textContent=n.textContent; sp.className="ed-t ed-w"; el.replaceChild(sp,n);
      }
    });
  }
  document.querySelectorAll("a.pilula, .grupo h3, #tit-planilhas, label[for=notas-pessoal], label[for=metas-texto], .grupo-topo h3, .cartao-topo h2").forEach(embrulha);
  var base=Array.prototype.slice.call(document.querySelectorAll("a.pilula > .ed-t, .grupo h3 .ed-t, .grupo h3 > span, #tit-planilhas .ed-t, #tit-planilhas > span, a.item-link .nome, a.celula .nome"));
  var extra=Array.prototype.slice.call(document.querySelectorAll(".grupo-topo h3 > .ed-t, .cartao-topo h2 > .ed-t, label[for=notas-pessoal] > .ed-t, label[for=metas-texto] > .ed-t, .senhas-cab .nome, .acc-btn > span:not(.cont):not(.chev), .fav-sep > span:not(.cont), .novo > span"));
  var textos=[];
  base.concat(extra).forEach(function(e){ if(textos.indexOf(e)<0) textos.push(e); });
  textos.forEach(function(e,i){
    e.classList.add("ed-t"); e.dataset.o=e.textContent; e.dataset.i=i;
    if(ed.t[i]!=null && ed.t[i]!=="") e.textContent=ed.t[i];
  });

  /* --- links --- */
  var links=Array.prototype.slice.call(document.querySelectorAll("a.pilula, a.item-link, a.celula"));
  links.forEach(function(a,i){
    a.dataset.h=a.getAttribute("href")||""; a.dataset.i=i;
    if(ed.l[i] && a.id!=="link-higienizacao") a.setAttribute("href",ed.l[i]);
  });

  /* --- nomes das abas (título e descrição de cada área) --- */
  var tEl=document.getElementById("titulo"), dEl=document.getElementById("descricao"), vEl=document.getElementById("vazio-titulo");
  tEl.setAttribute("data-ea","t"); dEl.setAttribute("data-ea","d");
  function areaAtual(){ var h=location.hash.slice(1); return AREAS_ID.indexOf(h)>=0?h:"trabalho"; }
  window.__edAreas=function(id){
    var o=ed.a[id]; if(!o) return;
    if(o.t){ tEl.textContent=o.t; vEl.textContent="Nenhum módulo em "+o.t; }
    if(o.d) dEl.textContent=o.d;
  };
  window.__edAreas(areaAtual());

  /* --- listas de Trabalho --- */
  var grupos={}, padrao={};
  document.querySelectorAll(".grupo[data-g]").forEach(function(g){
    var id=g.dataset.g; grupos[id]=g;
    padrao[id]=Array.prototype.map.call(g.querySelectorAll(".marca-passo"),function(b){ return {k:b.dataset.k,l:b.querySelector(".rot").textContent}; });
  });
  var CHECK='<span class="bolinha"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>';
  function lista(id){ return ed.listas[id] || (ed.listas[id]=JSON.parse(JSON.stringify(padrao[id]))); }
  function desenhaTrilha(id){
    var g=grupos[id], ol=g.querySelector(".trilha"), l=ed.listas[id]; if(!l) return;
    ol.innerHTML=""; ol.style.setProperty("--n",l.length);
    l.forEach(function(it){
      var li=document.createElement("li"); li.className="passo";
      var b=document.createElement("button"); b.type="button"; b.className="marca-passo"; b.dataset.k=it.k; b.setAttribute("aria-pressed","false");
      b.innerHTML=CHECK; var r=document.createElement("span"); r.className="rot"; r.textContent=it.l; b.appendChild(r);
      li.appendChild(b); ol.appendChild(li);
    });
    if(g._pinta) g._pinta(g);
  }
  Object.keys(grupos).forEach(function(id){ if(ed.listas[id]) desenhaTrilha(id); });

  function montaEditor(id){
    var g=grupos[id], old=g.querySelector(".trilha-ed"); if(old) old.remove();
    var box=document.createElement("div"); box.className="trilha-ed";
    var l=lista(id);
    l.forEach(function(it,i){
      var lin=document.createElement("div"); lin.className="lin";
      var n=document.createElement("span"); n.className="n"; n.textContent=(i+1)+".";
      var inp=document.createElement("input"); inp.type="text"; inp.value=it.l; inp.maxLength=120; inp.setAttribute("aria-label","Item "+(i+1)); inp.autocomplete="off";
      inp.addEventListener("input",function(){ it.l=inp.value; salva(); });
      inp.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); adiciona(id,i+1); } });
      var x=document.createElement("button"); x.type="button"; x.className="x"; x.textContent="×"; x.setAttribute("aria-label","Remover item "+(i+1));
      x.addEventListener("click",function(){ l.splice(i,1); salva(); montaEditor(id); });
      lin.appendChild(n); lin.appendChild(inp); lin.appendChild(x); box.appendChild(lin);
    });
    var add=document.createElement("button"); add.type="button"; add.className="add"; add.textContent="+ Adicionar item";
    add.addEventListener("click",function(){ adiciona(id,l.length); });
    box.appendChild(add);
    g.querySelector(".trilha").insertAdjacentElement("afterend",box);
  }
  function adiciona(id,pos){
    var l=lista(id); l.splice(pos,0,{k:id+"-n"+Date.now().toString(36)+Math.floor(Math.random()*99),l:""});
    salva(); montaEditor(id);
    var ins=grupos[id].querySelectorAll(".trilha-ed input"); if(ins[pos]) ins[pos].focus();
  }

  /* --- modo edição --- */
  var bt=document.getElementById("paleta");
  var barra=document.createElement("div"); barra.className="barra-ed"; barra.hidden=true; barra.setAttribute("role","status");
  barra.innerHTML='<span>Modo edição: clique em qualquer título, botão ou link para editar. Dá pra trocar de aba normalmente.</span><button type="button" class="ok">Concluir</button>';
  body.appendChild(barra);

  function setEdit(on){
    body.classList.toggle("editando",on);
    bt.setAttribute("aria-pressed",on?"true":"false");
    barra.hidden=!on;
    Object.keys(grupos).forEach(function(id){
      if(on) montaEditor(id);
      else {
        var b=grupos[id].querySelector(".trilha-ed"); if(b) b.remove();
        if(ed.listas[id]){ ed.listas[id]=ed.listas[id].filter(function(it){ return it.l.trim(); }); salva(); desenhaTrilha(id); }
      }
    });
    if(!on) fechaPop();
  }
  bt.addEventListener("click",function(){ setEdit(!body.classList.contains("editando")); });
  barra.querySelector(".ok").addEventListener("click",function(){ setEdit(false); });

  /* --- popover: título + link --- */
  var pop=document.createElement("div"); pop.className="pop-link"; pop.hidden=true;
  pop.innerHTML='<div class="cp-t"><label for="pop-tit">Título</label><input id="pop-tit" type="text" maxlength="200" autocomplete="off"></div><div class="cp-l"><label for="pop-url">Link</label><input id="pop-url" type="url" placeholder="https://…" autocomplete="off"></div><p class="err" hidden>Cole um link que comece com https://</p><div class="acoes"><button type="button" class="ok">Salvar</button><button type="button" class="canc">Cancelar</button></div>';
  body.appendChild(pop);
  var iT=pop.querySelector("#pop-tit"), iL=pop.querySelector("#pop-url"), err=pop.querySelector(".err"), alvo=null;
  var mob=window.matchMedia("(max-width:600px)");
  function ajustaTeclado(){
    if(!mob.matches||pop.hidden){ pop.style.bottom=""; return; }
    var v=window.visualViewport; if(!v){ pop.style.bottom="0px"; return; }
    pop.style.bottom=Math.max(0,window.innerHeight-v.height-v.offsetTop)+"px";
  }
  if(window.visualViewport){ visualViewport.addEventListener("resize",ajustaTeclado); visualViewport.addEventListener("scroll",ajustaTeclado); }
  function fechaPop(){ pop.hidden=true; alvo=null; body.classList.remove("pop-aberto"); }
  function abrePop(o,ref){
    alvo=o; err.hidden=true; iL.removeAttribute("aria-invalid");
    pop.querySelector(".cp-t").hidden=!(o.t||o.area);
    pop.querySelector(".cp-l").hidden=!o.a;
    iT.value=o.area? (o.area==="t"?tEl.textContent:dEl.textContent) : (o.t?o.t.textContent:"");
    iL.value=o.a?(o.a.getAttribute("href")||""):"";
    pop.hidden=false; body.classList.add("pop-aberto");
    if(mob.matches){ pop.style.left=pop.style.top=""; ajustaTeclado(); (o.t||o.area?iT:iL).focus(); return; }
    var r=ref.getBoundingClientRect(), w=pop.offsetWidth, h=pop.offsetHeight;
    var x=Math.max(12,Math.min(r.left,window.innerWidth-w-12));
    var y=r.bottom+8; if(y+h>window.innerHeight-12) y=Math.max(12,r.top-h-8);
    pop.style.left=x+"px"; pop.style.top=y+"px";
    (o.t||o.area?iT:iL).focus(); (o.t||o.area?iT:iL).select();
  }
  function aplicaLink(a,v){
    var i=a.dataset.i;
    if(v){ a.setAttribute("href",v); } else if(a.dataset.h){ a.setAttribute("href",a.dataset.h); } else { a.removeAttribute("href"); }
    if(a.id==="link-higienizacao"){ try{ localStorage.setItem("higienizacao_link",v||""); }catch(e){} }
    else { if(v && v!==a.dataset.h) ed.l[i]=v; else delete ed.l[i]; salva(); }
  }
  function aplicaTitulo(t,v){
    v=v.trim(); var i=t.dataset.i;
    if(v){ t.textContent=v; if(v!==t.dataset.o) ed.t[i]=v; else delete ed.t[i]; }
    else { t.textContent=t.dataset.o; delete ed.t[i]; }
    salva();
  }
  function salvaPop(){
    if(!alvo) return;
    if(alvo.a){
      var v=iL.value.trim();
      if(v && !/^https?:\/\//i.test(v)){ iL.setAttribute("aria-invalid","true"); err.hidden=false; return; }
      aplicaLink(alvo.a,v);
    }
    if(alvo.t) aplicaTitulo(alvo.t,iT.value);
    if(alvo.area){
      var id=areaAtual(), v2=iT.value.trim(); ed.a[id]=ed.a[id]||{};
      if(v2) ed.a[id][alvo.area]=v2; else delete ed.a[id][alvo.area];
      salva();
      if(!v2) { location.reload(); return; }
      window.__edAreas(id);
    }
    fechaPop();
  }
  pop.querySelector(".ok").addEventListener("click",salvaPop);
  pop.querySelector(".canc").addEventListener("click",fechaPop);
  pop.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); salvaPop(); } else if(e.key==="Escape") fechaPop(); });

  /* no modo edição, clicar em título/botão/link abre o editor em vez de agir */
  document.addEventListener("click",function(e){
    if(!body.classList.contains("editando")) return;
    var t=e.target;
    if(t.closest(".pop-link, .barra-ed, #paleta, #sync, nav, .trilha-ed")) return;
    var a=t.closest("a.pilula, a.item-link, a.celula");
    var te=t.closest(".ed-t");
    var ar=t.closest("[data-ea]");
    if(a || te || ar){
      e.preventDefault(); e.stopPropagation();
      if(ar && !a) abrePop({area:ar.getAttribute("data-ea")},ar);
      else abrePop({a:a||null,t:te||(a?a.querySelector(".ed-t"):null)},a||te);
      return;
    }
    if(!pop.hidden) fechaPop();
  },true);
  window.addEventListener("hashchange",function(){ if(!pop.hidden) fechaPop(); });

  /* botão de paleta ao lado do Sincronizar */
  var sy=document.getElementById("sync");
  function medeSync(){ var w=sy.offsetWidth; if(w) document.documentElement.style.setProperty("--sync-w",w+"px"); }
  if(window.ResizeObserver) new ResizeObserver(medeSync).observe(sy);
  medeSync(); setTimeout(medeSync,500);

  /* se o Firebase não carregar, o botão continua aparecendo e avisa */
  setTimeout(function(){
    if(!window.__syncOk){ document.getElementById("sync-txt").textContent="Sincronização indisponível"; sy.dataset.e="erro"; medeSync(); }
  },5000);
})();

/* ===== Aprimoramentos de interação ===== */
(function(){
  // animação suave ao trocar de área
  function anima(){
    ["area-trabalho","area-pessoal","area-vazio"].forEach(function(id){
      var el=document.getElementById(id); if(!el||el.hidden) return;
      el.classList.remove("surgir"); void el.offsetWidth; el.classList.add("surgir");
    });
    var m=document.getElementById("conteudo"); if(m && location.hash) m.focus({preventScroll:true});
  }
  window.addEventListener("hashchange",anima);
  // Esc fecha painéis de informação abertos
  document.addEventListener("keydown",function(e){
    if(e.key!=="Escape") return;
    document.querySelectorAll('.info[aria-expanded="true"]').forEach(function(b){
      var p=b.parentNode.querySelector(".painel"); if(p) p.hidden=true; b.setAttribute("aria-expanded","false");
    });
  });
})();

/* ===== Sincronização (Firebase) — carregada sob demanda;
   se falhar, o restante da página continua funcionando ===== */
(async function(){
let initializeApp, getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, getFirestore, doc, getDoc, setDoc;
try{
  const V="https://www.gstatic.com/firebasejs/13.2.0/";
  const [a,b,c]=await Promise.all([import(V+"firebase-app.js"),import(V+"firebase-auth.js"),import(V+"firebase-firestore.js")]);
  ({initializeApp}=a);
  ({getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut}=b);
  ({getFirestore, doc, getDoc, setDoc}=c);
}catch(e){ console.error("Firebase indisponível",e); return; }
const firebaseConfig = {
  apiKey: "AIzaSyC10wqSdbYHcxJOGKhqzwm4ZDCf3o8tQvM",
  authDomain: "ingryds-workspace.firebaseapp.com",
  projectId: "ingryds-workspace",
  storageBucket: "ingryds-workspace.firebasestorage.app",
  messagingSenderId: "130700324636",
  appId: "1:130700324636:web:d55326466d00a7064914d9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const CHAVES = ["temas-extra","pessoal-afazeres","notas-pessoal","metas","progresso-semana","higienizacao_link","wishlist","informacoes","ideias","favoritos","edicoes"];
const btn = document.getElementById("sync"), txt = document.getElementById("sync-txt");
btn.hidden = false; window.__syncOk = true;
function estado(e, t){ btn.dataset.e = e; txt.textContent = t; }
estado("off", "Entrar para sincronizar");

let usuario = null, ref = null, timer = null, pendente = false, ocupado = false;

function lerLocal(){
  const o = {};
  CHAVES.forEach(k => { try { const v = localStorage.getItem(k); if (v !== null) o[k] = v; } catch(e){} });
  return o;
}
function iguais(a, b){
  return CHAVES.every(k => (a[k] ?? null) === (b[k] ?? null));
}

async function enviar(){
  if (!ref) return;
  try {
    estado("off", "Salvando…");
    await setDoc(ref, { dados: lerLocal(), atualizadoEm: Date.now() });
    pendente = false;
    estado("ok", "Sincronizado");
  } catch(e){ console.error(e); estado("erro", "Erro ao salvar"); }
}
function agenda(){
  if (!ref) return;
  pendente = true;
  clearTimeout(timer);
  timer = setTimeout(enviar, 800);
}

// qualquer gravação numa chave sincronizada dispara o envio
const setOriginal = Storage.prototype.setItem;
Storage.prototype.setItem = function(k, v){
  setOriginal.call(this, k, v);
  if (this === window.localStorage && CHAVES.includes(k)) agenda();
};

async function baixar(permiteRecarregar){
  if (!ref || ocupado) return;
  ocupado = true;
  try {
    const snap = await getDoc(ref);
    const local = lerLocal();
    if (!snap.exists()) { await enviar(); return; }
    const remoto = (snap.data() && snap.data().dados) || {};
    const mescla = Object.assign({}, local, remoto);   // a nuvem vence; o que só existe aqui é mantido
    if (!iguais(mescla, local)) {
      if (pendente) { await enviar(); return; }        // há edição local ainda não enviada
      const emUso = document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      if (permiteRecarregar && !emUso) {
        CHAVES.forEach(k => { if (k in mescla) setOriginal.call(localStorage, k, mescla[k]); });
        location.reload();
        return;
      }
    } else if (!iguais(mescla, remoto)) { await enviar(); return; }
    estado("ok", "Sincronizado");
  } catch(e){ console.error(e); estado("erro", "Erro de sincronização"); }
  finally { ocupado = false; }
}

onAuthStateChanged(auth, user => {
  usuario = user;
  if (user) {
    ref = doc(db, "users", user.uid, "dados", "estado");
    estado("off", "Sincronizando…");
    baixar(true);
  } else {
    ref = null;
    estado("off", "Entrar para sincronizar");
  }
});
getRedirectResult(auth).catch(e => console.error(e));

btn.addEventListener("click", async () => {
  if (usuario) {
    if (confirm("Sair da conta " + (usuario.email || "") + "? Os dados deste aparelho continuam salvos nele.")) signOut(auth);
    return;
  }
  const prov = new GoogleAuthProvider();
  try { await signInWithPopup(auth, prov); }
  catch(e){
    if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) signInWithRedirect(auth, prov);
    else if (!e || e.code !== "auth/popup-closed-by-user") { console.error(e); estado("erro", "Erro no login"); }
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) { if (pendente) { clearTimeout(timer); enviar(); } }
  else baixar(true);
});
window.addEventListener("pagehide", () => { if (pendente) enviar(); });
})();

/* ===== Saudação com data ===== */
(function(){
  var topo=document.querySelector(".topo > div"); if(!topo) return;
  var p=document.createElement("p"); p.className="saudacao";
  function atualiza(){
    var d=new Date(), h=d.getHours();
    var oi=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
    var dt=d.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
    p.textContent=oi+", Ingryd · "+dt;
  }
  atualiza(); setInterval(atualiza,60000);
  topo.insertBefore(p,topo.firstChild);
})();
