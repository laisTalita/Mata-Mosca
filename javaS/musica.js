const ligaIcone = document.getElementById('ligaMusica');
const desligaIcone = document.getElementById('desligaMusica');
const areaMusica = document.getElementById('controleMusica');
let regulaMusica = document.getElementById('regulaMusica');
const bgm = document.getElementById('bgm');
const botaoMusica = document.getElementById('botaoMusica')


areaMusica.addEventListener('mouseenter', () => {
    regulaMusica.classList.remove('oculto');
});
areaMusica.addEventListener('mouseleave', () => {
    regulaMusica.classList.add('oculto');
});
function atualizarIconesVolume() {
    if (bgm.volume === 0) {
        ligaIcone.classList.add('oculto');
        desligaIcone.classList.remove('oculto');
    } else {
        ligaIcone.classList.remove('oculto');
        desligaIcone.classList.add('oculto');
    }
}

regulaMusica.addEventListener('input', () => {
    let valor = regulaMusica.value;
    bgm.volume = valor / 5;
    atualizarIconesVolume();
    localStorage.setItem('valor',valor);

});

botaoMusica.addEventListener('click', () => {
    if (bgm.volume > 0) {
        regulaMusica.value = 0;
        bgm.volume = 0;
    }
    else{
        regulaMusica.value =1
        bgm.volume =1/5
    }
    localStorage.setItem('valor',regulaMusica.value);
    atualizarIconesVolume();

});
window.addEventListener('load',()=>{
  let valorSalvo= localStorage.getItem('valor');
    if (valorSalvo!==null) {
        regulaMusica.value = valorSalvo
        bgm.volume = valorSalvo/5
    }
    else{
        regulaMusica.value = 1
        bgm.volume = 1/5
    }
    atualizarIconesVolume();
})

