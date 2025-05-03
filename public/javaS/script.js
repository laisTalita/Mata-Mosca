let largura =0
let altura =0
let mouseX=0
let mouseY=0
let vidas =3
let pontosMoscas = 0
let tempo =30
let jogoAtivo = true
let moscaAtual=null
let gameOver =document.getElementById('gameOver')
let mostraVitoria =document.getElementById('vitoria')
let pontuacao= document.querySelector('.pontuacao')
let podeTrocarLado = true;

let nivelEscolhido= new URLSearchParams(window.location.search)
let nivel = nivelEscolhido.get('nivel')


const configuracaoNivel = {
    facil:{
        tempo_criaMosca:2000,
        tempo_desaparece:3000,
        tempo_muda: 3000,
        pontos_individuaisNiveis :5,
        criaBonus :4000,
        criaBomba:6000,
        distancia_bomba:4000
    },
    medio:{
        tempo_criaMosca:  1000,
        tempo_desaparece:  2000,
        tempo_muda:  2000,
        pontos_individuaisNiveis: 10,
        criaBonus : 7000,
        criaBomba:2000,
        distancia_bomba:6000
    },
    dificil:{
        tempo_criaMosca: 300,
        tempo_desaparece: 1400,
        tempo_muda: 1630,
        pontos_individuaisNiveis:30,
        criaBonus :3000,
        criaBomba:1000,
        distancia_bomba:6000
    }
};
let config = configuracaoNivel[nivel]

function retorna() {
     largura =window.innerWidth
     altura =window.innerHeight
     console.log(`${largura}, altura: ${altura}`)
}
window.addEventListener('resize', retorna)
 retorna()

function criaMosca() {
    const mosca = document.createElement("div")
    mosca.classList.add('mosquito')

    let randX = Math.floor(Math.random()*largura) -70
    let randY = Math.floor(Math.random()*altura) -60
    randX = randX <0 ?0: randX
    randY = randY <0 ?0: randY

    let randomSize= Math.floor(Math.random()*60)+40
    mosca.style.position="absolute"
    mosca.style.left= `${randX}px`
    mosca.style.top= `${randY}px`
    mosca.style.width = `${randomSize}px`;
    mosca.style.height = `${randomSize}px`;

    document.body.appendChild(mosca)
    moscaAtual = mosca
    ladoAleatorio(moscaAtual)

    mosca.addEventListener('mouseenter',()=>{
       matarMosca(moscaAtual)
    })
     setTimeout(()=>{
        if (jogoAtivo && document.body.contains(mosca)) {
            mosca.remove()
            verificaVida(false)
            pontosMoscas -= config.pontos_individuaisNiveis 
            pontosMoscas = Math.max(pontosMoscas, 0);
            pontuacao.textContent=pontosMoscas
            document.querySelectorAll('.pontuacaoFinalText').forEach(p => {
                p.textContent = pontosMoscas
            })
        }
     },config.tempo_desaparece)
}

function matarMosca(mosca) {
    mosca.remove()
    pontosMoscas += 260
    pontuacao.textContent=pontosMoscas
    document.querySelectorAll('.pontuacaoFinalText').forEach(p => {
        p.textContent = pontosMoscas
    })
}

function restauraVida_dinheiro() {
    const tipo= Math.random()<0.5 ? 'vida':'dinheiro'
    const elementoBonus = document.createElement("div")

    let posicaoX = Math.floor(Math.random()*largura) -70
    let posicaoY = Math.floor(Math.random()*altura) -500
    posicaoX = posicaoX <0 ?0: posicaoX
    posicaoY = posicaoY <0 ?0: posicaoY

    elementoBonus.style.position = "absolute";
    elementoBonus.style.top =`${posicaoY}px`
    elementoBonus.style.left =`${posicaoX}px`

    if (tipo ==='vida') {
        elementoBonus.classList.add('conquistaVida')
    }else if(tipo==='dinheiro'){
       elementoBonus.classList.add('dinheiro')
    }else{
        return
    }
    document.body.appendChild(elementoBonus)

    elementoBonus.addEventListener('mouseenter',()=>{
        elementoBonus.remove()
        if (elementoBonus.classList.contains('conquistaVida')) {
            verificaVida(true)
        }else if(elementoBonus.classList.contains('dinheiro')){
            pontosMoscas += 500
            pontuacao.textContent=pontosMoscas
            document.querySelectorAll('.pontuacaoFinalText').forEach(p => {
                p.textContent = pontosMoscas
            })
        }
    })
    setInterval(()=>{
        if (document.body.contains(elementoBonus)) {
            elementoBonus.remove()
        }
    },5000)
}
function dano() {
  const elementoDano=document.createElement("div")

  let posicaoX = Math.floor(Math.random()*largura) -70
  let posicaoY = Math.floor(Math.random()*altura) -70
  posicaoX = posicaoX <0 ?0: posicaoX
  posicaoY = posicaoY <0 ?0: posicaoY

  elementoDano.style.position='absolute'
  elementoDano.style.top=`${posicaoY}px`
  elementoDano.style.left=`${posicaoX}px`
  elementoDano.classList.add('bomba')

  document.body.appendChild(elementoDano)

  elementoDano.addEventListener('mouseenter', () => {
    elementoDano.classList.remove('bomba');
    elementoDano.classList.add('explosao');
    setTimeout(() => {
      elementoDano.remove();
    }, 400); 
    verificaVida(false)  
  });
  setTimeout(()=>{
    if (document.body.contains(elementoDano)) {
        elementoDano.remove()
    }
  },config.distancia_bomba)
}
setInterval(()=>{
    dano()
},config.criaBomba)
setInterval(()=>{
    restauraVida_dinheiro()
},config.criaBonus)
window.document.addEventListener('mousemove',(e)=>{
    if(!moscaAtual) return
    mouseX = e.clientX
    mouseY = e.clientY
    let posicaoMosca = moscaAtual.getBoundingClientRect()
    let xMosca = posicaoMosca.left +(posicaoMosca.width/2)
    let yMosca = posicaoMosca.top +(posicaoMosca.height/2)

    let distancia = Math.sqrt(Math.pow(xMosca-mouseX,2)+Math.pow(yMosca-mouseY,2))

    if (distancia <700 && podeTrocarLado ===true ){
     ladoAleatorio(moscaAtual)
     podeTrocarLado = false;

    let trocaLadoTime= setTimeout(()=>{
            podeTrocarLado = true;
        },config.tempo_muda)

    }
})
function ladoAleatorio(mosca) {
    const ladoAtual = mosca.dataset.lado;
    const novoLado = Math.random() < 0.5 ? 'direita' : 'esquerda';
    if (ladoAtual !== novoLado) {
        mosca.classList.remove('direita', 'esquerda');
        mosca.classList.add(novoLado);
        mosca.dataset.lado = novoLado;
    }
    return novoLado;
}
function perdeJogo(){
    if (vidas ===0 && jogoAtivo) {
         jogoAtivo= false
         clearInterval(geraMoscas)
         clearInterval(cronometro)
         gameOver.classList.remove('oculto')
     }
}
function verificaVida(valor) {
    if (valor) {
        if (vidas < 3) {
            vidas++;
            const coracao = document.getElementById('v' + vidas).src = "/imagens/coracao_cheio.png";
        }
    } else {
        if (vidas > 0) {
            const coracao = document.getElementById('v' + vidas).src = "/imagens/coracao_vazio.png";
            vidas--;
        }
    }
    if (vidas === 0) {
        perdeJogo();
    }
}
let cronometro = setInterval(()=>{
    tempo--
    document.getElementById('tempo').textContent=tempo
    if (tempo === 0){
        jogoAtivo= false
        clearInterval(geraMoscas)
        clearInterval(cronometro)
        mostraVitoria.classList.remove('oculto')
    }
    },1000)
let geraMoscas= setInterval(()=>{
    if (jogoAtivo && !document.querySelector('.mosquito')) {
    criaMosca()}
    },config.tempo_criaMosca) 
function jogarNovamente() {
    window.location.href = `papaMosca.html?nivel=${nivel}`;
}


