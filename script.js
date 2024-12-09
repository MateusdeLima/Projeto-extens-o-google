document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('topicForm');
    const copyButton = document.getElementById('copyButton');

    // Criar botão para gerar 3 palavras-chave
    const generateThreeButton = document.createElement('button');
    generateThreeButton.textContent = "GENERATE 3 KW";
    generateThreeButton.className = 'btn';
    generateThreeButton.style.marginTop = '10px';
    form.appendChild(generateThreeButton);

    generateThreeButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Obter o título do campo de entrada
        const title = document.getElementById('title').value.trim();

        if (title === '') {
            alert("Por favor, insira um título.");
            return;
        }

        // Mostrar carregando
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'none';  // Ocultar os resultados enquanto carrega
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = "Gerando tópicos, por favor aguarde...";
        resultsDiv.innerHTML = '';  // Limpar o conteúdo anterior
        resultsDiv.appendChild(loadingMessage);

        // Gerar tópicos
        const topics = generateTopics(title, 3);

        if (typeof topics === 'string') {
            resultsDiv.innerHTML = `<p>${topics}</p>`;
        } else {
            // Exibir os resultados formatados
            resultsDiv.innerHTML = formatResults(topics);
        }
        resultsDiv.style.display = 'block';  // Exibir a div #results

        // Exibir o botão de copiar
        copyButton.style.display = 'block';
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obter o título do campo de entrada
        const title = document.getElementById('title').value.trim();

        if (title === '') {
            alert("Por favor, insira um título.");
            return;
        }

        // Mostrar carregando
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'none';  // Ocultar os resultados enquanto carrega
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = "Gerando tópicos, por favor aguarde...";
        resultsDiv.innerHTML = '';  // Limpar o conteúdo anterior
        resultsDiv.appendChild(loadingMessage);

        // Gerar tópicos
        const topics = generateTopics(title, 5);

        if (typeof topics === 'string') {
            resultsDiv.innerHTML = `<p>${topics}</p>`;
        } else {
            // Exibir os resultados formatados
            resultsDiv.innerHTML = formatResults(topics);
        }
        resultsDiv.style.display = 'block';  // Exibir a div #results

        // Exibir o botão de copiar
        copyButton.style.display = 'block';
    });

    // Função para copiar palavras-chave
    copyButton.addEventListener('click', function () {
        const resultsDiv = document.getElementById('results');
        // Adicionar uma linha em branco entre cada palavra-chave
        const textToCopy = resultsDiv.innerText.replace("Resultados:", "").trim().split('\n').join('\n\n');

        navigator.clipboard.writeText(textToCopy).then(function() {
            copyButton.textContent = "COPIED";
            setTimeout(() => {
                copyButton.textContent = "COPIAR";
            }, 2000); // Voltar para "COPIAR" após 2 segundos
        }, function(err) {
            alert("Erro ao copiar palavras-chave: " + err);
        });
    });

    // Função para gerar tópicos de forma inteligente
    function generateTopics(title, numTopics) {
        const words = title.split(" ").filter(word => word.trim() !== "");
        const keywords = [];
        const excludedWords = ["promoção", "liquidação", "preço baixo", "preço", "desconto", "oferta", "saldão","baixo","abaixou",""];

        if (words.length === 0) {
            return "Nenhuma palavra-chave gerada.";
        }

        // Função para analisar a importância das palavras no título
        const getImportantWords = (words) => {
            // Palavras comuns e excluídas que podemos ignorar
            const commonWords = ["a", "de", "e", "o", "que", "do", "da", "em", "um", "uma", "para", "com", "não", "é", "por", "os", "as", "dos", "das"];
            return words.filter(word => !commonWords.includes(word.toLowerCase()) && !excludedWords.includes(word.toLowerCase()));
        };

        const importantWords = getImportantWords(words);

        // Se não houver palavras importantes suficientes, usar todas as palavras, exceto as excluídas
        const relevantWords = importantWords.length > 0 ? importantWords : words.filter(word => !excludedWords.includes(word.toLowerCase()));

        if (relevantWords.length < 4) {
            return "Erro: Para gerar Keywords mais coerentes, ensira um título com no mínimo 4 palavras.";
        }

        // Função para embaralhar palavras de forma controlada
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Gerar palavras-chave coerentes
        while (keywords.length < numTopics) {
            let selectedWords = shuffleArray([...relevantWords]);

            // Ajuste para garantir um número fixo de palavras (entre 4 e 6)
            if (selectedWords.length > 6) {
                selectedWords = selectedWords.slice(0, 6);
            } else if (selectedWords.length < 4) {
                continue; // Pular esta iteração se houver menos de 4 palavras
            }

            const keyword = selectedWords.join(" ");
            if (!keywords.includes(keyword)) {
                keywords.push(keyword);
            }
        }

        // Melhorar a variedade das palavras-chave (evitar repetições)
        const uniqueKeywords = [...new Set(keywords)];

        return uniqueKeywords;
    }

    // Função para formatar os resultados numerados de 1 a 5
    function formatResults(topics) {
        return `
            <h3>Resultados:</h3>
            <ol>
                ${topics.map((topic, index) => `<li>${topic}</li>`).join('')}
            </ol>
        `;
    }
});
