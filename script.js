// Seleciona o contêiner onde os vídeos serão exibidos
const containerVideos = document.querySelector(".videos__container");

// Seleciona o input da barra de pesquisa
const barraDePesquisa = document.querySelector(".pesquisar__input");

// Seleciona todos os botões de categoria
const botaoCategoria = document.querySelectorAll(".superior__item");

// Adiciona um evento para filtrar os vídeos conforme o usuário digita na barra de pesquisa
barraDePesquisa.addEventListener("input", filtrarPesquisa);

// Função assíncrona para buscar e mostrar os vídeos
async function buscarEMostrarVideos() {
    try {
        // Faz uma requisição para obter os vídeos do servidor
        const busca = await fetch("http://localhost:3000/videos");
        const videos = await busca.json();
    
        // Itera sobre cada vídeo recebido
        videos.forEach((video) => {
            
            // Verifica se o vídeo possui uma categoria
            if(video.categoria == ""){
                throw new Error('Vídeo está sem categoria');
            }

            // Adiciona o HTML do vídeo no contêiner
            containerVideos.innerHTML += `
            <li class="videos__item">
                <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
                <div class="descricao-video">
                    <img class="img-canal" src="${video.imagem}" alt="Logo do Canal">
                    <h3 class="titulo-video">${video.titulo}</h3>
                    <p class="titulo-canal">${video.descricao}</p>
                    <p class="categoria" hidden>${video.categoria}</p>
                </div>
            </li>
            `;
        });
    } catch(error) {
        // Exibe uma mensagem de erro caso ocorra algum problema na requisição
        containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error}</p>`;
    }
}

// Chama a função para buscar e mostrar os vídeos assim que a página carrega
buscarEMostrarVideos();

// Função para filtrar os vídeos com base na pesquisa do usuário
function filtrarPesquisa() {
    const videos = document.querySelectorAll(".videos__item");
    const valorFiltro = barraDePesquisa.value.toLowerCase();
    
    // Itera sobre cada vídeo e ajusta sua exibição com base no título
    videos.forEach((video) => {
        const titulo = video.querySelector(".titulo-video").textContent.toLowerCase();

        // Verifica se o título do vídeo inclui o texto da pesquisa
        video.style.display = valorFiltro ? titulo.includes(valorFiltro) ? 'block' : 'none' : 'block';
    });
}

// Adiciona um evento de clique a cada botão de categoria para filtrar os vídeos
botaoCategoria.forEach((botao) => {
    let nomeCategoria = botao.getAttribute("name");
    botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
});

// Função para filtrar os vídeos com base na categoria selecionada
function filtrarPorCategoria(filtro) {
    const videos = document.querySelectorAll(".videos__item");
    for(let video of videos) {
        let categoria = video.querySelector(".categoria").textContent.toLowerCase();
        let valorFiltro = filtro.toLowerCase();

        // Verifica se a categoria do vídeo inclui o filtro e ajusta a exibição do vídeo
        if(!categoria.includes(valorFiltro) && valorFiltro != 'tudo') {
            video.style.display = "none";
        } else {
            video.style.display = "block";
        }
    }
}
