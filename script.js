// Captura os elementos do HTML criados no index.html
const conversa = document.getElementById('conversa');
const inputMensagem = document.getElementById('mensagem');
const btnEnviar = document.getElementById('btnEnviar');
const btnFalar = document.getElementById('btnFalar');
const status = document.getElementById('status');

// Dicionário de palavras-chave e respostas
const bancoDeRespostas = {
    "oii": "Olá, como posso ajudar?",
    "dia da prova": "A prova será no dia 21/10/2026.",
    "local": "O local é na Escola Senai em Pederneiras.",
    "horário": "O horário é às 14:30.",
    "horario": "O horário é às 14:30.", // sem acento para cobrir variações
    "material": "O material necessário é um Computador com internet.",
    "duração": "A duração é de 2h00.",
    "duracao": "A duração é de 2h00."
};

// Função para buscar a resposta correspondente
function obterResposta(mensagem) {
    const msgNormalizada = mensagem.toLowerCase().trim();
    
    // Verifica se alguma palavra-chave está na mensagem do usuário
    for (const chave in bancoDeRespostas) {
        if (msgNormalizada.includes(chave)) {
            return bancoDeRespostas[chave];
        }
    }
    // Caso não compreenda a pergunta
    return "NÃO COMPREENDEMOS, REPITA A PERGUNTA";
}

// Função para adicionar a mensagem na interface do chat
function adicionarMensagem(texto, remetente) {
    const div = document.createElement('div');
    // Adiciona as classes 'mensagem' e o remetente ('bot' ou 'usuario') definidas no style.css
    div.classList.add('mensagem', remetente);
    div.textContent = texto;

    // Alinhamento conforme exigência: pergunta lado direito, resposta lado esquerdo
    if (remetente === 'usuario') {
        div.style.alignSelf = 'flex-end'; // Força para a direita
    } else {
        div.style.alignSelf = 'flex-start'; // Força para a esquerda
    }

    conversa.appendChild(div);
    // Rola o chat para a última mensagem enviada
    conversa.scrollTop = conversa.scrollHeight;
}

// Função para o Bot falar a resposta em áudio
function falarTexto(texto) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(texto);
    utterThis.lang = 'pt-BR'; // Define o idioma para Português do Brasil
    synth.speak(utterThis);
}

// Processa o envio da mensagem (seja texto ou voz)
function processarMensagem(texto) {
    if (!texto) return;
    
    // 1. Exibe a pergunta em texto
    adicionarMensagem(texto, 'usuario');
    inputMensagem.value = ''; // Limpa o campo de texto

    // 2. Obtém a resposta
    const resposta = obterResposta(texto);
    
    // 3. Exibe a resposta em texto e em áudio com pequeno delay
    setTimeout(() => {
        adicionarMensagem(resposta, 'bot');
        falarTexto(resposta);
    }, 500);
}

// Evento de clique para o botão "Enviar" (Texto)
btnEnviar.addEventListener('click', () => {
    processarMensagem(inputMensagem.value);
});

// Evento de tecla "Enter" no campo de texto
inputMensagem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processarMensagem(inputMensagem.value);
    }
});

// Configuração do Reconhecimento de Voz (Áudio para Texto)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    // Quando começar a escutar
    recognition.onstart = () => {
        status.textContent = "Escutando... Pode falar.";
    };

    // Quando capturar o áudio com sucesso
    recognition.onresult = (event) => {
        const transcricao = event.results[0][0].transcript;
        status.textContent = ""; // Limpa o status
        processarMensagem(transcricao); // Envia a transcrição gerada pelo áudio para aparecer em texto
    };

    // Quando houver um erro
    recognition.onerror = (event) => {
        status.textContent = "Não foi possível captar o áudio.";
    };

    // Quando parar de ouvir
    recognition.onend = () => {
        status.textContent = "";
    };

    // Evento de clique para o botão "Falar" (Áudio)
    btnFalar.addEventListener('click', () => {
        recognition.start();
    });
} else {
    // Caso o navegador não suporte reconhecimento de voz (ex: navegadores antigos)
    btnFalar.style.display = 'none';
    status.textContent = "Reconhecimento de voz não suportado neste navegador.";
}
