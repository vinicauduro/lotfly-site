/* Lotfly — página de vendas: simulador, régua da venda, prévia da lista, WhatsApp e entradas. */
'use strict';

/* Número do WhatsApp que recebe os pedidos de demonstração: DDI + DDD + número, só dígitos.
   Enquanto estiver vazio, os botões levam para o formulário no fim da página. */
const WHATSAPP = '';

const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const linkWhats = msg => WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}` : '#demonstracao';

document.querySelectorAll('.js-whats').forEach(a => {
  if (!WHATSAPP) return;
  a.href = linkWhats(a.dataset.msg || 'Olá! Quero saber mais sobre o Lotfly.');
  a.target = '_blank'; a.rel = 'noopener';
});

/* ---------------------------------------------------------------- simulador (tabela de demonstração) */
(() => {
  const PRECO = 184500, ENTRADA = 0.10, JUROS = 0.008, DESCONTO = 0.06;
  const palco = document.getElementById('planta'), r = document.getElementById('parcelas');
  if (!palco || !r) return;
  const saida = document.getElementById('parcelasValor'), res = document.getElementById('resultado'), palavra = palco.querySelector('[data-palavra]');
  const mostra = () => {
    const n = Number(r.value);
    r.style.setProperty('--cheio', ((n - 1) / 119 * 100) + '%');
    if (n === 1) {
      palco.dataset.modo = 'avista'; saida.textContent = 'à vista'; palavra.textContent = 'à vista';
      res.innerHTML = `À vista: <b>${brl(PRECO * (1 - DESCONTO))}</b><small>6% de desconto sobre ${brl(PRECO)}</small>`;
      return;
    }
    const entrada = PRECO * ENTRADA, saldo = PRECO - entrada;
    const parcela = saldo * JUROS / (1 - Math.pow(1 + JUROS, -n));
    palco.dataset.modo = 'parcelado'; saida.textContent = n + '×'; palavra.textContent = 'em ' + n + '×';
    res.innerHTML = `Entrada de <b>${brl(entrada)}</b> + <b>${n}× ${brl(parcela)}</b><small>Saldo financiado ${brl(saldo)} · total ${brl(entrada + parcela * n)}</small>`;
  };
  r.addEventListener('input', mostra); mostra();
})();

/* ---------------------------------------------------------------- a venda em quatro etapas */
(() => {
  const ETAPAS = [
    { nome: 'Pedido', frase: 'Primeiro, o corretor pede a reserva', detalhe: 'Com o cliente do lado, ele escolhe o lote na planta, simula e pede a reserva pelo celular. O lote fica laranja para toda a equipe.', video: true },
    { nome: 'Aprovação', frase: 'Depois, o escritório aprova', detalhe: 'O pedido chega com o cliente, o corretor e a condição. Aprove ou recuse, um a um ou vários de uma vez; a reserva vence sozinha no prazo.', img: 'img/reservas.webp', w: 1600, h: 553, alt: 'Tela de reservas do Lotfly com um pedido aguardando aprovação e uma reserva aprovada.' },
    { nome: 'Contrato', frase: 'Então, o contrato sai pronto', detalhe: 'Partes, imóvel, preço e parcelas preenchidos no seu modelo. Você confere, edita se quiser e imprime ou salva em PDF.', img: 'img/contrato.webp', w: 1720, h: 1000, alt: 'Prévia do contrato de promessa de compra e venda de lote, com as partes, o objeto e a forma de pagamento preenchidos.' },
    { nome: 'Carteira', frase: 'E as parcelas entram na carteira', detalhe: 'Cada parcela vira um recebível com vencimento, correção e boleto. Quem atrasa aparece na cobrança.', img: 'img/a-receber.webp', w: 1600, h: 653, alt: 'Tela A receber do Lotfly com as parcelas do mês, as atrasadas e as pagas.' }
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
    r.value = i; r.setAttribute('aria-valuetext', e.nome); r.style.setProperty('--cheio', (i / 3 * 100) + '%');
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
})();

/* ---------------------------------------------------------------- lista com prévia da tela */
(() => {
  const previa = document.querySelector('.previa');
  if (!previa || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const imgs = {};
  document.querySelectorAll('.linha[data-img]').forEach(l => {
    const k = l.dataset.img;
    if (!imgs[k]) { const i = document.createElement('img'); i.src = `img/${k}.webp`; i.alt = ''; i.loading = 'lazy'; previa.appendChild(i); imgs[k] = i; }
    l.addEventListener('mouseenter', () => { Object.values(imgs).forEach(i => i.classList.toggle('ligada', i === imgs[k])); previa.classList.add('mostra'); });
  });
  document.querySelector('.programa__lista').addEventListener('mouseleave', () => previa.classList.remove('mostra'));
})();

/* ---------------------------------------------------------------- formulário: abre o WhatsApp */
(() => {
  const f = document.getElementById('formDemo');
  if (!f) return;
  f.addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(f), nome = (d.get('nome') || '').trim(), emp = (d.get('empresa') || '').trim();
    const msg = `Olá! Quero agendar uma demonstração do Lotfly.${nome ? `\nNome: ${nome}` : ''}${emp ? `\nEmpresa: ${emp}` : ''}\nSomos uma ${d.get('tipo')}.`;
    if (WHATSAPP) window.open(linkWhats(msg), '_blank', 'noopener');
    else alert('O número do WhatsApp ainda não foi configurado nesta página.');
  });
})();

/* ---------------------------------------------------------------- entradas */
(() => {
  requestAnimationFrame(() => document.querySelector('.abertura')?.classList.add('carregou'));
  const els = document.querySelectorAll('.entra');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visto')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
})();

/* ---------------------------------------------------------------- movimento reduzido: o vídeo não toca sozinho */
(() => {
  const v = document.querySelector('[data-video]');
  if (v && matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; }
})();
