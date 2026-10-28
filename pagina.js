/* Lotfly — página de vendas: contato, barra fixa, simulador, régua da venda, prévia da lista e entradas. */
'use strict';

/* Contato dos pedidos de demonstração. WHATSAPP: só dígitos, com 55 e DDD (ex.: 5547999990000).
   Sem WhatsApp, usa o EMAIL. Sem os dois, os botões levam ao formulário, que avisa na própria página. */
const WHATSAPP = '5548988344406';
const EMAIL = '';

const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const linkContato = msg => WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
  : EMAIL ? `mailto:${EMAIL}?subject=${encodeURIComponent('Demonstração do Lotfly')}&body=${encodeURIComponent(msg)}`
  : '';

document.querySelectorAll('.js-contato').forEach(a => {
  const url = linkContato(a.dataset.msg || 'Olá! Quero saber mais sobre o Lotfly.');
  if (!url) return;
  a.href = url;
  if (WHATSAPP) { a.target = '_blank'; a.rel = 'noopener'; }
});

/* ---------------------------------------------------------------- barra fixa depois da abertura */
(() => {
  const barra = document.querySelector('[data-barra]'), abertura = document.querySelector('.abertura');
  if (!barra || !abertura || !('IntersectionObserver' in window)) return;
  const fim = document.getElementById('demonstracao');
  let naAbertura = true, noFim = false;
  const aplica = () => {
    const mostra = !naAbertura && !noFim;
    barra.classList.toggle('mostra', mostra);
    barra.setAttribute('aria-hidden', String(!mostra));
    barra.querySelectorAll('a').forEach(a => { a.tabIndex = mostra ? 0 : -1; });
  };
  new IntersectionObserver(([e]) => { naAbertura = e.isIntersecting; aplica(); }, { rootMargin: '-40% 0px 0px 0px' }).observe(abertura);
  if (fim) new IntersectionObserver(([e]) => { noFim = e.isIntersecting; aplica(); }, { threshold: 0.2 }).observe(fim);
})();

/* ---------------------------------------------------------------- trilho preenchido dos controles deslizantes */
const encheTrilho = r => {
  const min = Number(r.min) || 0, max = Number(r.max) || 100;
  r.closest('.trilho').style.setProperty('--cheio', ((Number(r.value) - min) / (max - min) * 100) + '%');
};

/* ---------------------------------------------------------------- simulador (tabela de demonstração) */
(() => {
  const PRECO = 184500, ENTRADA = 0.10, JUROS = 0.008, DESCONTO = 0.06;
  const palco = document.getElementById('planta'), r = document.getElementById('parcelas');
  if (!palco || !r) return;
  const saida = document.getElementById('parcelasValor'), res = document.getElementById('resultado'), fala = document.getElementById('resultadoFala');
  const palavra = palco.querySelector('[data-palavra]'), atalhos = [...palco.querySelectorAll('.atalhos button')];
  let resumo = '';
  const mostra = () => {
    const n = Number(r.value);
    encheTrilho(r);
    atalhos.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.n) === n)));
    if (n === 1) {
      palco.dataset.modo = 'avista'; saida.textContent = 'à vista'; palavra.textContent = 'à vista';
      res.innerHTML = `À vista: <b>${brl(PRECO * (1 - DESCONTO))}</b><small>6% de desconto sobre ${brl(PRECO)}</small>`;
      resumo = `À vista: ${brl(PRECO * (1 - DESCONTO))}`;
      return;
    }
    const entrada = PRECO * ENTRADA, saldo = PRECO - entrada;
    const parcela = saldo * JUROS / (1 - Math.pow(1 + JUROS, -n));
    palco.dataset.modo = 'parcelado'; saida.textContent = n + '×'; palavra.textContent = 'em ' + n + '×';
    res.innerHTML = `Entrada de <b>${brl(entrada)}</b> + <b>${n}× ${brl(parcela)}</b><small>Saldo financiado ${brl(saldo)} · total ${brl(entrada + parcela * n)}</small>`;
    resumo = `Entrada de ${brl(entrada)} e ${n} parcelas de ${brl(parcela)}`;
  };
  /* O leitor de tela ouve o resultado quando o dedo para, não a cada passo */
  const anuncia = () => { fala.textContent = resumo; };
  r.addEventListener('input', mostra);
  r.addEventListener('change', anuncia);
  atalhos.forEach(b => b.addEventListener('click', () => { r.value = b.dataset.n; mostra(); anuncia(); }));
  mostra();
})();

/* ---------------------------------------------------------------- a venda em quatro etapas */
(() => {
  const ETAPAS = [
    { nome: 'Pedido', frase: 'Primeiro, o corretor pede a reserva', detalhe: 'Com o cliente do lado, ele escolhe o lote na planta, simula e pede a reserva pelo celular. O lote fica laranja para toda a equipe.', video: true },
    { nome: 'Aprovação', frase: 'Depois, o escritório aprova', detalhe: 'O pedido chega com o cliente, o corretor e a condição. Aprove ou recuse, um a um ou vários de uma vez; a reserva vence sozinha no prazo.', img: 'img/etapa-aprovacao.webp', w: 1300, h: 420, alt: 'Reservas no Lotfly: Quadra A, Lote 5, pedida em 18/10 pelo corretor, aguardando aprovação; Quadra B, Lote 7, aprovada até 23/10.' },
    { nome: 'Contrato', frase: 'Então, o contrato sai pronto', detalhe: 'Partes, imóvel, preço e parcelas preenchidos no seu modelo. Você confere, edita se quiser e imprime ou salva em PDF.', img: 'img/etapa-contrato.webp', w: 1180, h: 690, alt: 'Contrato de promessa de compra e venda de lote gerado pelo Lotfly, com vendedora, comprador, objeto e preço preenchidos.' },
    { nome: 'Carteira', frase: 'E as parcelas entram na carteira', detalhe: 'Cada parcela vira um recebível com vencimento, correção e boleto. Quem atrasa aparece na cobrança.', img: 'img/etapa-carteira.webp', w: 1400, h: 230, alt: 'A receber no Lotfly: parcelas em aberto, a vencer e atrasadas do mês, com os valores.' }
  ];
  const sec = document.getElementById('venda'), r = document.getElementById('etapa');
  if (!sec || !r) return;
  const frase = sec.querySelector('[data-frase]'), det = sec.querySelector('[data-detalhe]'), img = sec.querySelector('[data-tela]'), video = sec.querySelector('[data-video]');
  const botoes = [...sec.querySelectorAll('[data-etapa]')];
  ETAPAS.forEach(e => { if (e.img) { const i = new Image(); i.src = e.img; } });   // já deixa as telas carregadas
  let atual = 0;
  const vai = i => {
    if (i === atual) return; atual = i;
    const e = ETAPAS[i];
    r.value = i; r.setAttribute('aria-valuetext', e.nome); encheTrilho(r);
    botoes.forEach((b, j) => { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    [frase, det, img, video].forEach(el => { el.style.opacity = 0; });
    setTimeout(() => {
      frase.textContent = e.frase; det.textContent = e.detalhe;
      video.hidden = !e.video; img.hidden = !!e.video;
      if (e.video) video.play().catch(() => {}); else { video.pause(); img.src = e.img; img.width = e.w; img.height = e.h; img.alt = e.alt; }
      [frase, det, img, video].forEach(el => { el.style.opacity = ''; });
    }, 200);
  };
  r.addEventListener('input', () => vai(Number(r.value)));
  botoes.forEach(b => b.addEventListener('click', () => vai(Number(b.dataset.etapa))));
  encheTrilho(r);
})();

/* ---------------------------------------------------------------- lista: prévia da tela ao lado; no celular, grupos recolhidos */
(() => {
  const moldura = document.querySelector('.previa__moldura');
  if (moldura && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const imgs = { planta: moldura.querySelector('img') };
    const liga = k => {
      if (!imgs[k]) { const i = document.createElement('img'); i.src = `img/${k}.webp`; i.alt = ''; moldura.appendChild(i); imgs[k] = i; }
      Object.values(imgs).forEach(i => i.classList.toggle('ligada', i === imgs[k]));
    };
    document.querySelectorAll('#tudo tr[data-img]').forEach(tr => tr.addEventListener('mouseenter', () => liga(tr.dataset.img)));
  }
  if (matchMedia('(max-width: 760px)').matches) document.querySelectorAll('#tudo .grupo').forEach((d, i) => { if (i) d.open = false; });
})();

/* ---------------------------------------------------------------- formulário: abre o WhatsApp ou o e-mail */
(() => {
  const f = document.getElementById('formDemo');
  if (!f) return;
  const botao = f.querySelector('[data-rotulo-envio]'), nota = f.querySelector('[data-nota]');
  if (WHATSAPP) { botao.textContent = 'Chamar no WhatsApp'; nota.textContent = 'Abre o WhatsApp com a mensagem pronta. Nada fica guardado nesta página.'; }
  f.addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(f), nome = (d.get('nome') || '').trim(), emp = (d.get('empresa') || '').trim();
    const msg = `Olá! Quero agendar uma demonstração do Lotfly.${nome ? `\nNome: ${nome}` : ''}${emp ? `\nEmpresa: ${emp}` : ''}\nSomos uma ${d.get('tipo')}.`;
    const url = linkContato(msg);
    if (!url) { nota.textContent = 'O contato desta página ainda está sendo configurado. Volte em breve.'; nota.classList.add('aviso'); return; }
    if (WHATSAPP) window.open(url, '_blank', 'noopener'); else location.href = url;
  });
})();

/* ---------------------------------------------------------------- movimento reduzido: o vídeo não toca sozinho */
(() => {
  const v = document.querySelector('[data-video]');
  if (v && matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; }
})();

/* ---------------------------------------------------------------- entradas */
(() => {
  requestAnimationFrame(() => document.querySelector('.abertura')?.classList.add('carregou'));
  const els = document.querySelectorAll('.entra');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visto')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
})();
