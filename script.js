const questions = [
    {
        question: "Em que ano o Santos Futebol Clube foi fundado?",
        options: ["1908", "1912", "1920", "1930"],
        correct: 1
    },
    {
        question: "Qual é o estádio oficial do Santos FC?",
        options: ["Vila Belmiro", "Pacaembu", "Morumbi", "Maracanã"],
        correct: 0
    },
    {
        question: "Quem foi o maior artilheiro da história do Santos FC?",
        options: ["Coutinho", "Pepe", "Pelé", "Neymar"],
        correct: 2
    },
    {
        question: "Em que década o Santos conquistou o seu bicampeonato mundial interclubes?",
        options: ["Década de 1950", "Década de 1960", "Década de 1970", "Década de 1980"],
        correct: 1
    },
    {
        question: "Qual famoso apelido histórico foi dado ao ataque santista dos anos 60?",
        options: ["Os Canhotinhas", "A Máquina Alvinegra", "O Ataque dos Sonhos", "Os Santásticos"],
        correct: 3
    },
    {
        question: "Quantas Copas Libertadores da América o Santos possui até hoje?",
        options: ["2", "3", "4", "5"],
        correct: 1
    },
    {
        question: "Qual craque revelado na base santista comandou a conquista da Libertadores de 2011?",
        options: ["Robinho", "Gabigol", "Neymar Jr.", "Rodrygo"],
        correct: 2
    },
    {
        question: "Além de Pelé, qual outro jogador marcou época vestindo a camisa 10 e encantando o mundo pelo Peixe?",
        options: ["Giovanni", "Zico", "Rivelino", "Kaká"],
        correct: 0
    },
    {
        question: "Qual foi a cor original da camisa do Santos no seu primeiro ano de fundação?",
        options: ["Preto e Branco", "Azul e Branco", "Vermelho e Branco", "Verde e Branco"],
        correct: 1
    },
    {
        question: "O Santos ficou mundialmente conhecido por ser o único time a parar uma guerra onde?",
        options: ["Na Nigéria", "Na Argélia", "No Congo", "No Vietnã"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let userAnswersHistory = [];

const questionTitle = document.getElementById("question-title");
const optionsContainer = document.getElementById("options-container");
const flowchartContainer = document.getElementById("flowchart-container");
const currentQSpan = document.getElementById("current-q");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showCompletion();
        return;
    }

    const q = questions[currentQuestionIndex];
    currentQSpan.textContent = currentQuestionIndex + 1;
    questionTitle.textContent = q.question;
    optionsContainer.innerHTML = "";

    q.options.forEach((optionText, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = optionText;
        btn.addEventListener("click", () => handleAnswer(index));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex) {
    const q = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    
    // Salva a resposta no histórico para montar o fluxograma
    userAnswersHistory.push({
        step: currentQuestionIndex + 1,
        question: q.question,
        chosen: q.options[selectedIndex],
        correct: isCorrect,
        correctAnswer: q.options[q.correct]
    });

    // Atualiza o fluxograma dinamicamente
    renderFlowchart();

    // Avança para a próxima pergunta
    currentQuestionIndex++;
    loadQuestion();
}

function renderFlowchart() {
    flowchartContainer.innerHTML = "";

    userAnswersHistory.forEach((item, index) => {
        // Cria conector visual entre nós (exceto para o primeiro)
        if (index > 0) {
            const connector = document.createElement("div");
            connector.classList.add("flow-connector");
            flowchartContainer.appendChild(connector);
        }

        const node = document.createElement("div");
        node.classList.add("flow-node");
        
        // Estilização dinâmica por acerto/erro
        const statusText = item.correct ? "✅ Correto" : "❌ Incorreto";
        
        node.innerHTML = `
            <div class="flow-node-header">
                <span>FASE ${item.step}</span>
                <span>${statusText}</span>
            </div>
            <div class="flow-node-body">
                <strong>Q:</strong> ${item.question}<br>
                <strong>Sua escolha:</strong> ${item.chosen}
                ${!item.correct ? `<br><small style="color:var(--santos-gold)">Gabarito: ${item.correctAnswer}</small>` : ''}
            </div>
        `;
        
        flowchartContainer.appendChild(node);
    });

    // Auto-scroll para o final do fluxograma
    flowchartContainer.scrollTop = flowchartContainer.scrollHeight;
}

function showCompletion() {
    questionTitle.textContent = "🏆 Jornada Concluída, Alvinegro!";
    const correctCount = userAnswersHistory.filter(h => h.correct).length;
    
    optionsContainer.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <p style="font-size: 0.95rem; margin-bottom: 10px; color: var(--santos-white);">
                Você acertou <strong>${correctCount}</strong> de 10 perguntas sobre a gloriosa história do Peixe!
            </p>
        </div>
    `;

    restartBtn.style.display = "block";
}

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswersHistory = [];
    restartBtn.style.display = "none";
    loadQuestion();
    flowchartContainer.innerHTML = `<div class="flowchart-placeholder">Responda à primeira pergunta para iniciar o fluxograma...</div>`;
});

// Inicializa o app
loadQuestion();