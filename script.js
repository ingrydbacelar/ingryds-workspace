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
    var li=document.querySelectorAll("#area-pessoal .af"), cont=document.getElementById("cont-af");
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
      if(f.dataset.alvo==="tab-aprender"||f.dataset.alvo==="tab-proj"||f.dataset.alvo==="tab-insp") return;
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
    pessoal:{t:"Pessoal",d:"Minhas ideias e interesses."},
    projetos:{t:"Projetos",d:"Meus projetos de programação."},
    estudos:{t:"Estudos",d:"Meus cursos e leituras."}
  };
  var botoes=document.querySelectorAll("nav button");
  function mostrar(id){
    if(!AREAS[id]) id="trabalho";
    document.getElementById("titulo").textContent=AREAS[id].t;
    document.getElementById("descricao").textContent=AREAS[id].d;
    document.getElementById("vazio-titulo").textContent="Nenhum módulo em "+AREAS[id].t;
    document.getElementById("area-trabalho").hidden=(id!=="trabalho");
    document.getElementById("area-pessoal").hidden=(id!=="pessoal");
    document.getElementById("area-estudos").hidden=(id!=="estudos");
    document.getElementById("area-projetos").hidden=(id!=="projetos");
    document.getElementById("area-vazio").hidden=(id==="trabalho"||id==="pessoal"||id==="estudos"||id==="projetos");
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

/* ===== Estudos: acompanhamento de notas ===== */
(function(){
  var raiz=document.getElementById("notas-est"); if(!raiz) return;
  var CH="notas-estudos", CA="notas-estudos-ativo", NP=8, NC=5, MAX={s1:1,s2:1,av:8,avs:8}, MIN=6, MODAL=["","Presencial","Online"];
  var corpo=document.getElementById("est-corpo"), abas=document.getElementById("est-abas");
  var resumo=document.getElementById("est-resumo"), mediaPer=document.getElementById("est-media-per");
  var dados=[], ativo=0;

  function novo(){ var p=[]; for(var i=0;i<NP;i++){ var c=[]; for(var j=0;j<NC;j++) c.push({n:"",m:"",s1:"",s2:"",av:"",avs:""}); p.push(c); } return p; }
  function carrega(){
    var base=novo(), j=null;
    try{ j=JSON.parse(localStorage.getItem(CH)||"null"); }catch(e){}
    if(Array.isArray(j)) for(var i=0;i<NP;i++) for(var k=0;k<NC;k++){
      var o=j[i]&&j[i][k]; if(!o) continue;
      ["n","m","s1","s2","av","avs"].forEach(function(f){ if(typeof o[f]==="string") base[i][k][f]=o[f]; });
    }
    base.forEach(function(p){ p.forEach(function(c){ if(MODAL.indexOf(c.m)<0) c.m=""; }); });
    dados=base;
    try{ var a=parseInt(localStorage.getItem(CA),10); if(a>=0&&a<NP) ativo=a; }catch(e){}
  }
  function salva(){ try{ localStorage.setItem(CH,JSON.stringify(dados)); }catch(e){} }

  function num(s){ if(s==null) return null; s=String(s).trim().replace(",","."); if(s===""||isNaN(s)) return null; return parseFloat(s); }
  function fmt(n){ var s=(Math.round(n*100)/100).toFixed(2); if(s.charAt(s.length-1)==="0") s=s.slice(0,-1); return s.replace(".",","); }

  function calcula(c){
    var s1=num(c.s1), s2=num(c.s2), av=num(c.av), avs=num(c.avs);
    if(s1===null&&s2===null&&av===null&&avs===null) return {k:"vazio",t:"—",media:null};
    var sm=(s1||0)+(s2||0), prova=null;
    if(av!==null) prova=av; if(avs!==null && (prova===null||avs>prova)) prova=avs;
    var media=Math.round((sm+(prova||0))*100)/100;
    if(prova===null) return {k:"andamento",t:"Em andamento",d:"Falta "+fmt(MIN-sm)+" na AV",media:media};
    if(media>=MIN) return {k:"ok",t:"Aprovada",media:media};
    if(avs===null) return {k:"avs",t:"Fazer AVS",d:"Falta "+fmt(MIN-sm)+" na AVS",media:media};
    return {k:"reprovada",t:"Reprovada",media:media};
  }

  function desenhaAbas(){
    abas.innerHTML="";
    for(var i=0;i<NP;i++){
      var b=document.createElement("button"); b.type="button"; b.className="est-aba"; b.setAttribute("role","tab");
      b.dataset.i=i; b.textContent=(i+1)+"º período"; b.id="est-aba-"+i;
      b.setAttribute("aria-selected",i===ativo?"true":"false"); b.tabIndex=(i===ativo?0:-1);
      b.setAttribute("aria-controls","est-tab");
      abas.appendChild(b);
    }
    marcaFeitos();
  }
  function marcaFeitos(){
    Array.prototype.forEach.call(abas.children,function(b,i){
      var feito=dados[i].every(function(c){ return calcula(c).k==="ok"; });
      b.classList.toggle("feito",feito);
      b.setAttribute("aria-label",(i+1)+"º período"+(feito?" — todas aprovadas":""));
    });
  }

  function celNota(k,v,n,rot){
    var td=document.createElement("td"), i=document.createElement("input");
    i.type="text"; i.inputMode="decimal"; i.autocomplete="off"; i.className="est-n"; i.dataset.k=k; i.value=v; i.placeholder="–";
    i.maxLength=5; i.setAttribute("aria-label",rot+" — matéria "+(n+1));
    td.appendChild(i); return td;
  }
  function desenhaLinhas(){
    corpo.innerHTML="";
    dados[ativo].forEach(function(c,n){
      var tr=document.createElement("tr"); tr.dataset.n=n;
      var t0=document.createElement("td"); t0.className="est-col-nome";
      var nm=document.createElement("input"); nm.type="text"; nm.className="est-nome"; nm.dataset.k="n"; nm.value=c.n; nm.maxLength=60;
      nm.placeholder="Matéria "+(n+1); nm.autocomplete="off"; nm.setAttribute("aria-label","Nome da matéria "+(n+1));
      t0.appendChild(nm); tr.appendChild(t0);
      var tmod=document.createElement("td"), md=document.createElement("select"); md.className="est-nome est-mod"; md.dataset.k="m";
      MODAL.forEach(function(o){ var op=document.createElement("option"); op.value=o; op.textContent=o||"Modalidade"; md.appendChild(op); });
      md.value=c.m; md.classList.toggle("sem",!md.value); md.setAttribute("aria-label","Modalidade da matéria "+(n+1));
      tmod.appendChild(md); tr.appendChild(tmod);
      tr.appendChild(celNota("s1",c.s1,n,"SM1")); tr.appendChild(celNota("s2",c.s2,n,"SM2"));
      tr.appendChild(celNota("av",c.av,n,"AV")); tr.appendChild(celNota("avs",c.avs,n,"AVS"));
      var tm=document.createElement("td"); tm.className="est-td-media"; tm.innerHTML='<span class="est-media"></span>'; tr.appendChild(tm);
      var ts=document.createElement("td"); ts.className="est-td-sit"; ts.innerHTML='<span class="est-sit"></span><span class="est-dica"></span>'; tr.appendChild(ts);
      corpo.appendChild(tr); atualizaLinha(tr,c);
    });
    atualizaResumo();
  }
  function atualizaLinha(tr,c){
    var r=calcula(c), m=tr.querySelector(".est-media"), s=tr.querySelector(".est-sit"), d=tr.querySelector(".est-dica");
    m.textContent=r.media===null?"—":fmt(r.media);
    s.textContent=r.t; s.className="est-sit "+r.k;
    d.textContent=r.d||"";
  }
  function atualizaResumo(){
    var rs=dados[ativo].map(calcula), ok=rs.filter(function(r){return r.k==="ok";}).length;
    var ms=rs.filter(function(r){return r.media!==null;}).map(function(r){return r.media;});
    resumo.textContent=ok+"/"+NC+" aprovadas";
    mediaPer.textContent=ms.length?("Média das notas lançadas: "+fmt(ms.reduce(function(a,b){return a+b;},0)/ms.length)+" · mínimo para passar: "+fmt(MIN)):("Mínimo para passar: "+fmt(MIN));
    marcaFeitos();
  }
  function mostra(i){
    ativo=i; try{ localStorage.setItem(CA,String(i)); }catch(e){}
    Array.prototype.forEach.call(abas.children,function(b,k){ b.setAttribute("aria-selected",k===i?"true":"false"); b.tabIndex=(k===i?0:-1); });
    corpo.setAttribute("aria-labelledby","est-aba-"+i);
    fechaTip(); desenhaLinhas();
  }

  /* abas */
  abas.addEventListener("click",function(e){ var b=e.target.closest(".est-aba"); if(b) mostra(+b.dataset.i); });
  abas.addEventListener("keydown",function(e){
    var d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:e.key==="Home"?-ativo:e.key==="End"?NP-1-ativo:0;
    if(!d) return; e.preventDefault();
    var i=Math.max(0,Math.min(NP-1,ativo+d)); mostra(i); abas.children[i].focus();
  });

  /* edição das células */
  corpo.addEventListener("input",function(e){
    var el=e.target; if(!el.dataset||!el.dataset.k) return;
    var tr=el.closest("tr"), c=dados[ativo][+tr.dataset.n], k=el.dataset.k;
    if(k!=="n"&&k!=="m"){
      var v=el.value.replace(/[^0-9.,]/g,""); if(v!==el.value) el.value=v;
      var n=num(v); el.classList.toggle("acima",n!==null&&n>MAX[k]);
    }
    if(k==="m") el.classList.toggle("sem",!el.value);
    c[k]=el.value; salva(); atualizaLinha(tr,c); atualizaResumo();
  });
  corpo.addEventListener("focusout",function(e){
    var el=e.target; if(!el.dataset||!el.dataset.k||el.dataset.k==="n"||el.dataset.k==="m") return;
    var tr=el.closest("tr"), c=dados[ativo][+tr.dataset.n], k=el.dataset.k, n=num(el.value);
    if(n===null) el.value=""; else el.value=fmt(Math.min(MAX[k],Math.max(0,n)));
    el.classList.remove("acima");
    if(c[k]!==el.value){ c[k]=el.value; salva(); atualizaLinha(tr,c); atualizaResumo(); }
  });
  corpo.addEventListener("keydown",function(e){
    if(e.key!=="Enter"||!e.target.dataset||!e.target.dataset.k) return;
    var ins=Array.prototype.slice.call(corpo.querySelectorAll("input")), i=ins.indexOf(e.target);
    if(i>=0&&ins[i+1]){ e.preventDefault(); ins[i+1].focus(); ins[i+1].select(); }
  });

  /* balões de informação */
  var tip=document.createElement("div"); tip.className="est-tip"; tip.setAttribute("role","tooltip"); tip.hidden=true; document.body.appendChild(tip);
  var aberto=null;
  function fechaTip(){ if(aberto){ aberto.setAttribute("aria-expanded","false"); aberto=null; } tip.hidden=true; }
  function posiciona(b){
    var r=b.getBoundingClientRect(), w=tip.offsetWidth, h=tip.offsetHeight;
    var l=Math.max(8,Math.min(window.innerWidth-w-8,r.left+r.width/2-w/2));
    var t=r.bottom+8; if(t+h>window.innerHeight-8) t=Math.max(8,r.top-h-8);
    tip.style.left=l+"px"; tip.style.top=t+"px";
  }
  raiz.addEventListener("click",function(e){
    var b=e.target.closest(".est-info"); if(!b) return;
    if(aberto===b){ fechaTip(); return; }
    fechaTip(); aberto=b; b.setAttribute("aria-expanded","true");
    tip.textContent=b.dataset.tip; tip.hidden=false; posiciona(b);
  });
  document.addEventListener("click",function(e){ if(aberto && !e.target.closest(".est-info")) fechaTip(); });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape" && aberto){ var b=aberto; fechaTip(); b.focus(); } });
  window.addEventListener("resize",fechaTip);
  window.addEventListener("hashchange",fechaTip);
  window.addEventListener("scroll",fechaTip,true);

  carrega(); desenhaAbas(); mostra(ativo);
})();

/* ===== Estudos: bloco de notas ===== */
(function(){
  var t=document.getElementById("notas-estudos-txt"); if(!t) return;
  try{ t.value=localStorage.getItem("anotacoes-estudos")||""; }catch(e){}
  t.addEventListener("input",function(){ try{ localStorage.setItem("anotacoes-estudos",t.value); }catch(e){} });
})();

/* ===== Estudos: calendário ===== */
(function(){
  var raiz=document.getElementById("cal-est"); if(!raiz) return;
  var CH="calendario-estudos", LIM=370;
  var MESES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  var DIAS=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  var TIPOS={aula:"Aula presencial",evento:"Evento",aval:"Avaliação"};
  var grade=document.getElementById("cal-grade"), painelEl=document.getElementById("cal-dia"), lista=document.getElementById("cal-lista"), tit=document.getElementById("cal-dia-tit");
  var mesEl=document.getElementById("cal-mes"), tipo=document.getElementById("cal-tipo"), mod=document.getElementById("cal-mod");
  var titulo=document.getElementById("cal-titulo"), hora=document.getElementById("cal-hora"), add=document.getElementById("cal-add");
  var rep=document.getElementById("cal-rep"), ate=document.getElementById("cal-ate"), fim=document.getElementById("cal-fim"), msg=document.getElementById("cal-msg");
  var ev=[];
  function pad(n){ return (n<10?"0":"")+n; }
  function chave(a,m,d){ return a+"-"+pad(m+1)+"-"+pad(d); }
  function dt(k){ var p=k.split("-"); return new Date(+p[0],+p[1]-1,+p[2]); }
  function kd(d){ return chave(d.getFullYear(),d.getMonth(),d.getDate()); }
  function carrega(){
    try{ var j=JSON.parse(localStorage.getItem(CH)||"[]"); if(Array.isArray(j)) ev=j.filter(function(e){
      return e&&typeof e.d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e.d)&&TIPOS[e.t]&&typeof e.id==="string"; }).map(function(e){
      return {id:e.id,d:e.d,t:e.t,n:typeof e.n==="string"?e.n:"",m:e.m==="Online"||e.m==="Presencial"?e.m:"",h:/^\d{2}:\d{2}$/.test(e.h||"")?e.h:"",s:typeof e.s==="string"?e.s:""}; }); }catch(e){}
  }
  function salva(){ try{ localStorage.setItem(CH,JSON.stringify(ev)); }catch(e){} }
  var hj=new Date(), HOJE=kd(hj);
  var vis={a:hj.getFullYear(),m:hj.getMonth()}, sel=null, foco=HOJE;

  function doDia(k){
    return ev.filter(function(e){return e.d===k;}).sort(function(a,b){
      if(a.h!==b.h){ if(!a.h) return -1; if(!b.h) return 1; return a.h<b.h?-1:1; }
      return a.id<b.id?-1:1; });
  }
  function rotulo(e){ return e.n||TIPOS[e.t]; }

  function desenha(){
    mesEl.textContent=MESES[vis.m]+" "+vis.a;
    grade.innerHTML="";
    var primeiro=new Date(vis.a,vis.m,1).getDay(), total=new Date(vis.a,vis.m+1,0).getDate();
    var mapa={}; ev.forEach(function(e){ (mapa[e.d]=mapa[e.d]||[]).push(e); });
    var pref=vis.a+"-"+pad(vis.m+1), f=(foco&&foco.slice(0,7)===pref)?foco:chave(vis.a,vis.m,1);
    for(var i=0;i<primeiro;i++){ var v=document.createElement("span"); v.className="cal-vz"; grade.appendChild(v); }
    for(var d=1;d<=total;d++){
      var k=chave(vis.a,vis.m,d), b=document.createElement("button"); b.type="button"; b.className="cal-d"+(k===HOJE?" hoje":"");
      b.dataset.k=k; b.tabIndex=(k===f?0:-1);
      b.setAttribute("aria-pressed",k===sel?"true":"false"); if(k===HOJE) b.setAttribute("aria-current","date");
      var es=mapa[k]||[];
      var n=document.createElement("span"); n.textContent=d; b.appendChild(n);
      var pts=document.createElement("span"); pts.className="cal-pts";
      es.slice(0,3).forEach(function(e){ var p=document.createElement("span"); p.className="cal-pt t-"+e.t; pts.appendChild(p); });
      if(es.length>3){ var mais=document.createElement("span"); mais.className="cal-mais"; mais.textContent="+"; pts.appendChild(mais); }
      b.appendChild(pts);
      b.setAttribute("aria-label",d+" de "+MESES[vis.m]+(es.length?", "+es.length+(es.length===1?" item":" itens"):""));
      grade.appendChild(b);
    }
    painel();
  }
  function painel(){
    lista.innerHTML=""; painelEl.hidden=!sel; if(!sel) return;
    var x=dt(sel);
    tit.textContent=DIAS[x.getDay()]+", "+x.getDate()+" de "+MESES[x.getMonth()]+(x.getFullYear()!==hj.getFullYear()?" de "+x.getFullYear():"");
    var es=doDia(sel);
    if(!es.length){ var v=document.createElement("li"); v.className="cal-vazio"; v.textContent="Nada cadastrado neste dia."; lista.appendChild(v); }
    es.forEach(function(e){
      var li=document.createElement("li"); li.className="cal-it";
      var pt=document.createElement("span"); pt.className="cal-pt t-"+e.t; li.appendChild(pt);
      var tx=document.createElement("span"); tx.className="cal-it-tx";
      var b=document.createElement("b"); b.textContent=rotulo(e); tx.appendChild(b);
      var meta=[TIPOS[e.t]===rotulo(e)?"":TIPOS[e.t], e.h, e.t==="evento"?e.m:""].filter(Boolean).join(" · ");
      if(meta){ var s=document.createElement("small"); s.textContent=meta; tx.appendChild(s); }
      li.appendChild(tx);
      if(e.s){ var rs=document.createElement("button"); rs.type="button"; rs.className="cal-rem-s"; rs.dataset.s=e.s; rs.textContent="Remover série"; rs.setAttribute("aria-label","Remover todas as repetições de "+rotulo(e)); li.appendChild(rs); }
      var r=document.createElement("button"); r.type="button"; r.className="cal-rem"; r.dataset.id=e.id; r.textContent="×"; r.setAttribute("aria-label","Remover "+rotulo(e)); li.appendChild(r);
      lista.appendChild(li);
    });
  }
  function foca(){ var n=grade.querySelector('[data-k="'+foco+'"]'); if(n) n.focus(); }
  function irMes(delta){ var d=new Date(vis.a,vis.m+delta,1); vis.a=d.getFullYear(); vis.m=d.getMonth(); sel=null; foco=null; msg.textContent=""; desenha(); }

  document.getElementById("cal-ant").addEventListener("click",function(){ irMes(-1); });
  document.getElementById("cal-prox").addEventListener("click",function(){ irMes(1); });
  document.getElementById("cal-hoje").addEventListener("click",function(){ vis.a=hj.getFullYear(); vis.m=hj.getMonth(); sel=null; foco=HOJE; msg.textContent=""; desenha(); });
  grade.addEventListener("click",function(e){
    var b=e.target.closest(".cal-d"); if(!b) return;
    var k=b.dataset.k; sel=(sel===k)?null:k; foco=k; msg.textContent=""; desenha(); foca();
    if(sel && painelEl.scrollIntoView) painelEl.scrollIntoView({block:"nearest",behavior:"smooth"});
  });
  grade.addEventListener("keydown",function(e){
    var b=e.target.closest(".cal-d"); if(!b) return;
    var d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key]; if(!d) return; e.preventDefault();
    var x=dt(b.dataset.k); x.setDate(x.getDate()+d); foco=kd(x); vis.a=x.getFullYear(); vis.m=x.getMonth(); desenha(); foca();
  });
  lista.addEventListener("click",function(e){
    var r=e.target.closest(".cal-rem, .cal-rem-s"); if(!r) return;
    if(r.dataset.s) ev=ev.filter(function(x){return x.s!==r.dataset.s;}); else ev=ev.filter(function(x){return x.id!==r.dataset.id;});
    salva(); desenha(); foca();
  });
  tipo.addEventListener("change",function(){ mod.hidden=(tipo.value!=="evento"); });
  rep.addEventListener("change",function(){ ate.hidden=!rep.value; msg.textContent=""; if(rep.value && !fim.value) fim.focus(); });
  function novoId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function adiciona(){
    if(!sel) return;
    var base={t:tipo.value,n:titulo.value.trim(),m:tipo.value==="evento"?mod.value:"",h:hora.value}, datas=[sel], serie="";
    if(rep.value){
      if(!fim.value){ msg.textContent="Escolha até que dia repetir."; fim.focus(); return; }
      if(fim.value<sel){ msg.textContent="A data final precisa ser igual ou depois de "+dt(sel).getDate()+"/"+pad(dt(sel).getMonth()+1)+"."; fim.focus(); return; }
      var passo=rep.value==="semana"?7:1, x=dt(sel), fx=dt(fim.value); datas=[];
      while(x<=fx && datas.length<LIM){ datas.push(kd(x)); x.setDate(x.getDate()+passo); }
      serie=novoId();
    }
    datas.forEach(function(d,i){ ev.push({id:novoId()+i,d:d,t:base.t,n:base.n,m:base.m,h:base.h,s:serie}); });
    salva(); titulo.value=""; hora.value=""; rep.value=""; fim.value=""; ate.hidden=true;
    msg.textContent=datas.length>1?datas.length+" datas adicionadas."+(datas.length>=LIM?" (limite por série atingido)":""):"";
    desenha(); titulo.focus();
  }
  add.addEventListener("click",adiciona);
  titulo.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); adiciona(); } });

  carrega(); desenha();
})();

/* ===== Estudos: Aprender ===== */
(function(){
  var raiz=document.getElementById("aprender"); if(!raiz) return;
  var CH="aprender", TEMAS=["Curso","Aula","Leitura"], COR={Curso:"var(--turquesa)",Aula:"var(--azul)",Leitura:"var(--oliva)"};
  var tab=document.getElementById("tab-aprender"), cont=document.getElementById("ct-aprender"), filtro=raiz.querySelector(".filtro"), novo=document.getElementById("novo-aprender");
  var editTipo=(function(){ var t=document.createElement("span"); try{ t.contentEditable="plaintext-only"; }catch(e){} return t.contentEditable==="plaintext-only"?"plaintext-only":"true"; })();
  var est=[];
  try{
    var j=JSON.parse(localStorage.getItem(CH)||"[]");
    if(Array.isArray(j)) est=j.filter(function(it){ return it&&TEMAS.indexOf(it.t)>=0; }).map(function(it){
      return {d:typeof it.d==="string"?it.d:"",t:it.t,x:typeof it.x==="string"?it.x:"",l:(typeof it.l==="string"&&/^https?:\/\//i.test(it.l))?it.l:""};
    });
  }catch(e){}
  function salva(){ try{ localStorage.setItem(CH,JSON.stringify(est)); }catch(e){} }
  function hoje(){ var d=new Date(); return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2); }
  function el(t,c,x){ var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e; }
  function normaliza(v){ v=v.trim(); if(!v) return ""; if(!/^https?:\/\//i.test(v)) v="https://"+v; try{ return new URL(v).href; }catch(e){ return null; } }
  function host(u){ try{ return new URL(u).hostname.replace(/^www\./,""); }catch(e){ return u; } }
  function aplica(){
    var ch=filtro.querySelector('.chip[aria-pressed="true"]'), tema=ch?ch.dataset.tema:"", n=0;
    tab.querySelectorAll(".tab-lin").forEach(function(l){ var h=!!tema&&l.dataset.tema!==tema; l.hidden=h; if(!h) n++; });
    cont.textContent=n;
  }
  function desenha(){
    tab.querySelectorAll(".tab-lin").forEach(function(l){ l.remove(); });
    est.forEach(function(it,idx){
      var l=el("div","tab-lin"); l.dataset.tema=it.t;
      l.appendChild(el("span","dt",it.d));
      var tx=el("span","vaz",it.x); tx.contentEditable=editTipo; tx.spellcheck=false; tx.dataset.ph="Título…";
      tx.addEventListener("input",function(){ it.x=tx.textContent; salva(); });
      tx.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); tx.blur(); } });
      l.appendChild(tx);
      var tg=el("span","tag",it.t); tg.style.setProperty("--tag",COR[it.t]); l.appendChild(tg);
      var lk;
      if(it.l){ lk=el("a","lk",host(it.l)); lk.href=it.l; lk.target="_blank"; lk.rel="noopener noreferrer"; lk.title=it.l; }
      else lk=el("span","lk lk-vz","—");
      l.appendChild(lk);
      var r=el("button","rem","×"); r.type="button"; r.setAttribute("aria-label","Remover");
      r.addEventListener("click",function(){ if(confirm("Remover este item?")){ est.splice(idx,1); salva(); desenha(); } });
      l.appendChild(r);
      tab.appendChild(l);
    });
    aplica();
  }
  filtro.addEventListener("click",function(e){
    var b=e.target.closest(".chip"); if(!b) return;
    filtro.querySelectorAll(".chip").forEach(function(c){ c.setAttribute("aria-pressed",c===b?"true":"false"); });
    aplica();
  });
  var form=null;
  function abreForm(){
    if(form){ form.querySelector("input").focus(); return; }
    form=el("div","add-form");
    var sel=document.createElement("select"); sel.setAttribute("aria-label","Tema");
    TEMAS.forEach(function(t){ var op=document.createElement("option"); op.value=t; op.textContent=t; sel.appendChild(op); });
    var inp=document.createElement("input"); inp.type="text"; inp.className="txt-nova"; inp.placeholder="Título…"; inp.setAttribute("aria-label","Título"); inp.maxLength=200; inp.autocomplete="off";
    var lnk=document.createElement("input"); lnk.type="text"; lnk.inputMode="url"; lnk.placeholder="Link (opcional)"; lnk.setAttribute("aria-label","Link"); lnk.maxLength=500; lnk.autocomplete="off";
    var ok=el("button","btn","Adicionar"); ok.type="button";
    function fecha(){ form.remove(); form=null; }
    function grava(){
      var v=inp.value.trim(); if(!v){ inp.focus(); return; }
      var u=normaliza(lnk.value);
      if(u===null){ lnk.setAttribute("aria-invalid","true"); lnk.focus(); return; }
      est.unshift({d:hoje(),t:sel.value,x:v,l:u}); salva(); desenha(); fecha();
    }
    ok.addEventListener("click",grava);
    [inp,lnk].forEach(function(i){ i.addEventListener("keydown",function(e){ if(e.key==="Enter") grava(); else if(e.key==="Escape") fecha(); }); });
    lnk.addEventListener("input",function(){ lnk.removeAttribute("aria-invalid"); });
    form.appendChild(sel); form.appendChild(inp); form.appendChild(lnk); form.appendChild(ok);
    novo.parentNode.insertBefore(form,novo);
    inp.focus();
  }
  novo.addEventListener("click",abreForm);
  novo.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); abreForm(); } });
  desenha();
})();

/* ===== Projetos: afazeres e bloco de notas ===== */
(function(){
  var topo=document.getElementById("proj-topo"); if(!topo) return;
  var CH="projetos-afazeres", N=5, est={t:[],c:[]};
  try{ var x=JSON.parse(localStorage.getItem(CH)||"null"); if(x&&x.t&&x.c) est=x; }catch(e){}
  var li=topo.querySelectorAll(".af"), cont=document.getElementById("cont-af-p");
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
  document.getElementById("limpar-af-p").addEventListener("click",function(){
    li.forEach(function(el,i){
      if(est.c[i]){ est.c[i]=false; est.t[i]=""; el.querySelector(".txt-af").value=""; }
    });
    salva(); pinta();
  });
  pinta();
  var t=document.getElementById("notas-projetos-txt"); if(!t) return;
  function ajusta(){ t.style.height="auto"; t.style.height=t.scrollHeight+"px"; }
  try{ t.value=localStorage.getItem("notas-projetos")||""; }catch(e){}
  ajusta();
  t.addEventListener("input",function(){ ajusta(); try{ localStorage.setItem("notas-projetos",t.value); }catch(e){} });
  window.addEventListener("resize",ajusta);
  window.addEventListener("hashchange",function(){ setTimeout(ajusta,0); });
})();

/* ===== Projetos: listas com data, tema e link (Meus projetos e Inspirações) ===== */
(function(){
  var PAL=["#6fa3b0","#7d8b5c","#d8c47a","#d9a9a1","#b58fc4","#e0955f","#5fae9b","#c77d8a"];
  function corDe(t){ var h=0; for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return PAL[h%PAL.length]; }
  var editTipo=(function(){ var t=document.createElement("span"); try{ t.contentEditable="plaintext-only"; }catch(e){} return t.contentEditable==="plaintext-only"?"plaintext-only":"true"; })();
  function hoje(){ var d=new Date(); return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+String(d.getFullYear()).slice(-2); }
  function el(t,c,x){ var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e; }
  function normaliza(v){ v=v.trim(); if(!v) return ""; if(!/^https?:\/\//i.test(v)) v="https://"+v; try{ return new URL(v).href; }catch(e){ return null; } }
  function rotuloLink(u){ try{ var h=new URL(u).hostname.replace(/^www\./,""); return h==="drive.google.com"?"Abrir no Drive":h; }catch(e){ return u; } }

  function lista(o){
    var raiz=document.getElementById(o.raiz); if(!raiz) return;
    var CH=o.chave, CT=o.chaveTemas;
    var tab=document.getElementById(o.tab), cont=document.getElementById(o.cont), filtro=document.getElementById(o.filtro), novo=document.getElementById(o.novo);
    var temas=[], est=[], bruto=null;
    try{ bruto=localStorage.getItem(CT); }catch(e){}
    if(bruto===null) temas=o.temas.slice();
    else try{ var tj=JSON.parse(bruto); if(Array.isArray(tj)) temas=tj.filter(function(s){ return typeof s==="string"&&s.trim(); }); }catch(e){}
    try{
      var j=JSON.parse(localStorage.getItem(CH)||"[]");
      if(Array.isArray(j)) est=j.filter(function(it){ return it&&typeof it.t==="string"&&it.t; }).map(function(it){
        return {d:typeof it.d==="string"?it.d:"",t:it.t,x:typeof it.x==="string"?it.x:"",l:(typeof it.l==="string"&&/^https?:\/\//i.test(it.l))?it.l:""};
      });
    }catch(e){}
    est.forEach(function(it){ if(temas.indexOf(it.t)<0) temas.push(it.t); });
    function salva(){ try{ localStorage.setItem(CH,JSON.stringify(est)); }catch(e){} }
    function salvaTemas(){ try{ localStorage.setItem(CT,JSON.stringify(temas)); }catch(e){} }
    function aplica(){
      var ch=filtro.querySelector('.chip[aria-pressed="true"]'), tema=ch?ch.dataset.tema:"", n=0;
      tab.querySelectorAll(".tab-lin").forEach(function(l){ var h=!!tema&&l.dataset.tema!==tema; l.hidden=h; if(!h) n++; });
      cont.textContent=n;
    }
    function chipNovo(n){
      var g=el("span","chip-g");
      var c=el("button","chip",n); c.type="button"; c.dataset.tema=n; c.setAttribute("aria-pressed","false");
      var x=el("button","chip-x","×"); x.type="button"; x.setAttribute("aria-label","Excluir categoria "+n);
      x.addEventListener("click",function(){
        if(est.some(function(it){ return it.t===n; })){ alert("Ainda há itens na categoria \""+n+"\". Remova esses itens antes de excluí-la."); return; }
        if(!confirm("Excluir a categoria \""+n+"\"?")) return;
        if(c.getAttribute("aria-pressed")==="true"){ var td=filtro.querySelector('.chip[data-tema=""]'); if(td) td.setAttribute("aria-pressed","true"); }
        temas=temas.filter(function(t){ return t!==n; }); salvaTemas(); g.remove(); aplica();
      });
      g.appendChild(c); g.appendChild(x); filtro.appendChild(g);
    }
    function novaTema(n){
      n=(n||"").replace(/\s+/g," ").trim(); if(!n) return "";
      var ex=temas.filter(function(t){ return t.toLowerCase()===n.toLowerCase(); })[0]; if(ex) return ex;
      temas.push(n); salvaTemas(); chipNovo(n); return n;
    }
    temas.forEach(chipNovo);
    function desenha(){
      tab.querySelectorAll(".tab-lin").forEach(function(l){ l.remove(); });
      est.forEach(function(it,idx){
        var l=el("div","tab-lin"); l.dataset.tema=it.t;
        if(o.data!==false) l.appendChild(el("span","dt",it.d));
        var tx=el("span","vaz",it.x); tx.contentEditable=editTipo; tx.spellcheck=false; tx.dataset.ph=o.phTitulo;
        tx.addEventListener("input",function(){ it.x=tx.textContent; salva(); });
        tx.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); tx.blur(); } });
        l.appendChild(tx);
        var tg=el("span","tag",it.t); tg.style.setProperty("--tag",corDe(it.t)); l.appendChild(tg);
        var lk;
        if(it.l){ lk=el("a","lk",rotuloLink(it.l)); lk.href=it.l; lk.target="_blank"; lk.rel="noopener noreferrer"; lk.title=it.l; }
        else lk=el("span","lk lk-vz","—");
        l.appendChild(lk);
        var r=el("button","rem","×"); r.type="button"; r.setAttribute("aria-label","Remover");
        r.addEventListener("click",function(){ if(confirm(o.confirmaRem)){ est.splice(idx,1); salva(); desenha(); } });
        l.appendChild(r);
        tab.appendChild(l);
      });
      aplica();
    }
    filtro.addEventListener("click",function(e){
      var b=e.target.closest(".chip"); if(!b) return;
      filtro.querySelectorAll(".chip").forEach(function(c){ c.setAttribute("aria-pressed",c===b?"true":"false"); });
      aplica();
    });
    var form=null;
    function abreForm(){
      if(form){ form.querySelector("input").focus(); return; }
      form=el("div","add-form");
      var sel=document.createElement("select"); sel.setAttribute("aria-label",o.rotuloTema);
      temas.concat(["__nova"]).forEach(function(t){ var op=document.createElement("option"); op.value=t; op.textContent=t==="__nova"?"+ Nova categoria…":t; sel.appendChild(op); });
      var cat=document.createElement("input"); cat.type="text"; cat.className="txt-nova"; cat.placeholder="Nome da nova categoria…"; cat.maxLength=24; cat.autocomplete="off"; cat.setAttribute("aria-label","Nome da nova categoria");
      var inp=document.createElement("input"); inp.type="text"; inp.className="txt-nova"; inp.placeholder=o.phTitulo; inp.setAttribute("aria-label",o.rotuloTitulo); inp.maxLength=o.max; inp.autocomplete="off";
      var lnk=document.createElement("input"); lnk.type="text"; lnk.inputMode="url"; lnk.placeholder=o.phLink; lnk.setAttribute("aria-label","Link"); lnk.maxLength=500; lnk.autocomplete="off";
      var ok=el("button","btn","Adicionar"); ok.type="button";
      sel.value=temas.length?temas[0]:"__nova"; cat.hidden=sel.value!=="__nova";
      sel.addEventListener("change",function(){ cat.hidden=sel.value!=="__nova"; if(!cat.hidden) cat.focus(); });
      function fecha(){ form.remove(); form=null; }
      function grava(){
        var v=inp.value.trim(); if(!v){ inp.focus(); return; }
        var u=normaliza(lnk.value);
        if(u===null){ lnk.setAttribute("aria-invalid","true"); lnk.focus(); return; }
        var tema=sel.value;
        if(tema==="__nova"){ tema=novaTema(cat.value); if(!tema){ cat.focus(); return; } }
        est.unshift({d:o.data===false?"":hoje(),t:tema,x:v,l:u}); salva(); desenha(); fecha();
      }
      ok.addEventListener("click",grava);
      [cat,inp,lnk].forEach(function(i){ i.addEventListener("keydown",function(e){ if(e.key==="Enter") grava(); else if(e.key==="Escape") fecha(); }); });
      lnk.addEventListener("input",function(){ lnk.removeAttribute("aria-invalid"); });
      form.appendChild(sel); form.appendChild(cat); form.appendChild(inp); form.appendChild(lnk); form.appendChild(ok);
      novo.parentNode.insertBefore(form,novo);
      (cat.hidden?inp:cat).focus();
    }
    novo.addEventListener("click",abreForm);
    novo.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); abreForm(); } });
    desenha();
  }

  lista({raiz:"proj",chave:"projetos",chaveTemas:"projetos-temas",tab:"tab-proj",cont:"ct-proj",filtro:"filtro-proj",novo:"novo-proj",temas:[],
    phTitulo:"Nome da pasta…",rotuloTitulo:"Nome da pasta",rotuloTema:"Tema",phLink:"Link do Drive (opcional)",confirmaRem:"Remover esta pasta da lista?",max:200});
  lista({raiz:"insp",chave:"inspiracoes",chaveTemas:"inspiracoes-temas",tab:"tab-insp",cont:"ct-insp",filtro:"filtro-insp",novo:"novo-insp",temas:["Site","Ideia"],data:false,
    phTitulo:"Descreva a inspiração…",rotuloTitulo:"Inspiração",rotuloTema:"Tipo",phLink:"Link (opcional)",confirmaRem:"Remover esta inspiração?",max:300});
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
  document.querySelectorAll("a.pilula, .grupo h3, #tit-planilhas, label[for=notas-pessoal], label[for=metas-texto], label[for=notas-estudos-txt], label[for=notas-projetos-txt], .grupo-topo h3, .cartao-topo h2").forEach(embrulha);
  var base=Array.prototype.slice.call(document.querySelectorAll("a.pilula > .ed-t, .grupo h3 .ed-t, .grupo h3 > span, #tit-planilhas .ed-t, #tit-planilhas > span, a.item-link .nome, a.celula .nome"));
  var extra=Array.prototype.slice.call(document.querySelectorAll(".grupo-topo h3 > .ed-t, .cartao-topo h2 > .ed-t, label[for=notas-pessoal] > .ed-t, label[for=metas-texto] > .ed-t, .senhas-cab .nome, .acc-btn > span:not(.cont):not(.chev), .fav-sep > span:not(.cont), .novo > span"));
  extra=extra.filter(function(e){ return !e.closest("#aprender, #proj, #proj-topo, #insp"); });
  var tardios2=Array.prototype.slice.call(document.querySelectorAll("#proj-topo .grupo-topo h3 > .ed-t, #proj-topo label > .ed-t"));
  var tardios3=Array.prototype.slice.call(document.querySelectorAll("#insp .cartao-topo h2 > .ed-t, #insp .novo > span"));
  var tardios=Array.prototype.slice.call(document.querySelectorAll("label[for=notas-estudos-txt] > .ed-t, #aprender .acc-btn > span:not(.cont):not(.chev), #aprender .novo > span, #proj .cartao-topo h2 > .ed-t, #proj .novo > span"));
  var textos=[];
  base.concat(extra,tardios,tardios2,tardios3).forEach(function(e){ if(textos.indexOf(e)<0) textos.push(e); });
  (function(){ var est=document.getElementById("area-estudos"); if(!est) return; function dentro(e){ return est.contains(e)||!!e.closest("#area-projetos"); } var a=textos.filter(function(e){return !dentro(e);}), b=textos.filter(dentro); textos=a.concat(b); })();
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
    ["area-trabalho","area-pessoal","area-estudos","area-projetos","area-vazio"].forEach(function(id){
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

const CHAVES = ["temas-extra","pessoal-afazeres","notas-pessoal","metas","progresso-semana","higienizacao_link","wishlist","informacoes","ideias","favoritos","edicoes","notas-estudos","calendario-estudos","anotacoes-estudos","aprender","projetos","projetos-temas","projetos-afazeres","notas-projetos","inspiracoes","inspiracoes-temas"];
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
