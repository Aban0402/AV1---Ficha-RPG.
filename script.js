const atributosChaves = ["forca", "destreza", "constituicao", "inteligencia", "sabedoria", "carisma"];

let atributosRolados = {};
let atributosPreenchidos = [];
let modoCriacao = "aleatorio";
let dadosTemporariosForm = {};

function obterNomeTipoDado(tipo) {
    switch (tipo) {
        case "d12": return "D12";
        case "2d6": return "2D6";
        default: return "D20";
    }
}

function rolarDado(tipo) {
    switch (tipo) {
        case "d12":
            return Math.floor(Math.random() * 12) + 1;
        case "2d6":
            return (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
        default:
            return Math.floor(Math.random() * 20) + 1;
    }
}

function gerarAtributo(tipo) {
    return rolarDado(tipo);
}

function calcularModificador(valor) {
    return Math.floor((valor - 10) / 2);
}

function aplicarBonus(personagem) {
    return personagem;
}

function mostrarTelaRolagem() {
    const telaFormulario = document.getElementById("telaFormulario");
    const rolagem = document.getElementById("rolagem");
    const containerResultado = document.getElementById("containerResultado");
    const resultado = document.getElementById("resultado");

    if (telaFormulario) telaFormulario.classList.add("hidden");
    if (rolagem) rolagem.classList.remove("hidden");
    if (containerResultado) containerResultado.classList.add("hidden");
    if (resultado) resultado.classList.add("hidden");
}

function mostrarResultado() {
    const telaFormulario = document.getElementById("telaFormulario");
    const rolagem = document.getElementById("rolagem");
    const containerResultado = document.getElementById("containerResultado");
    const resultado = document.getElementById("resultado");

    if (telaFormulario) telaFormulario.classList.add("hidden");
    if (rolagem) rolagem.classList.add("hidden");
    if (containerResultado) containerResultado.classList.remove("hidden");
    if (resultado) resultado.classList.remove("hidden");
}

function atualizarTextoRolagem() {
    const titulo = document.getElementById("tituloRolagem");
    const subtitulo = document.getElementById("subtituloRolagem");
    const botao = document.getElementById("rolarDado");
    const tipo = dadosTemporariosForm.tipoDado || "d20";
    const nomeTipo = obterNomeTipoDado(tipo);

    if (titulo) titulo.textContent = `Rolagem dos Atributos (${nomeTipo})`;
    if (subtitulo) subtitulo.textContent = `Escolha um atributo por vez, role o ${nomeTipo} e salve o valor dele.`;
    if (botao) botao.textContent = `🎲 Rolar ${nomeTipo}`;
}

function renderizarFicha(personagem) {
    aplicarBonus(personagem);

    const mods = {};
    atributosChaves.forEach(attr => {
        mods[attr] = calcularModificador(personagem.atributos[attr]);
    });

    let vida, mana, energia;

    if (dadosTemporariosForm.tipoStatus === "manual") {
        vida = parseInt(dadosTemporariosForm.vidaManual) || 0;
        mana = parseInt(dadosTemporariosForm.manaManual) || 0;
        energia = parseInt(dadosTemporariosForm.energiaManual) || 0;
    } else {
        vida = 10 + mods.constituicao;
        mana = 5;
        energia = 100 + (mods.destreza * 5);
        switch (personagem.classe) {
            case "Guerreiro": vida += 10; break;
            case "Mago": mana += 15; break;
            case "Ladino": energia += 25; break;
            case "Clérigo": vida += 5; mana += 5; break;
        }
    }

    const resultadoContainer = document.getElementById("resultado");
    if (!resultadoContainer) return;

    mostrarResultado();
    resultadoContainer.innerHTML = `
        <div class="bg-[#f8efe0] text-stone-800 rounded-2xl border border-stone-400 shadow-2xl p-6 md:p-8">
            <div class="text-center mb-6 border-b border-stone-400 pb-3">
                <h2 class="text-3xl font-bold uppercase tracking-[0.25em] text-stone-800">Ficha de Aventureiro</h2>
                <p class="text-sm mt-2 text-stone-600">Ficha ${obterNomeTipoDado(dadosTemporariosForm.tipoDado || "d20")}</p>
            </div>

            <div class="grid md:grid-cols-3 gap-3 mb-6 text-sm">
                <div class="bg-white/70 rounded-lg p-3 border border-stone-300"><strong>Nome:</strong> ${personagem.nome}</div>
                <div class="bg-white/70 rounded-lg p-3 border border-stone-300"><strong>Raça:</strong> ${personagem.raca}</div>
                <div class="bg-white/70 rounded-lg p-3 border border-stone-300"><strong>Classe:</strong> ${personagem.classe}</div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white/70 rounded-xl p-4 border border-stone-300">
                    <h3 class="text-lg font-bold mb-3 text-stone-800">Atributos</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span>⚔️ Força</span><span>${personagem.atributos.forca} <span class="text-stone-500">(${mods.forca >= 0 ? '+' : ''}${mods.forca})</span></span></div>
                        <div class="flex justify-between"><span>🏹 Destreza</span><span>${personagem.atributos.destreza} <span class="text-stone-500">(${mods.destreza >= 0 ? '+' : ''}${mods.destreza})</span></span></div>
                        <div class="flex justify-between"><span>🛡️ Constituição</span><span>${personagem.atributos.constituicao} <span class="text-stone-500">(${mods.constituicao >= 0 ? '+' : ''}${mods.constituicao})</span></span></div>
                        <div class="flex justify-between"><span>📖 Inteligência</span><span>${personagem.atributos.inteligencia} <span class="text-stone-500">(${mods.inteligencia >= 0 ? '+' : ''}${mods.inteligencia})</span></span></div>
                        <div class="flex justify-between"><span>🙏 Sabedoria</span><span>${personagem.atributos.sabedoria} <span class="text-stone-500">(${mods.sabedoria >= 0 ? '+' : ''}${mods.sabedoria})</span></span></div>
                        <div class="flex justify-between"><span>🎭 Carisma</span><span>${personagem.atributos.carisma} <span class="text-stone-500">(${mods.carisma >= 0 ? '+' : ''}${mods.carisma})</span></span></div>
                    </div>
                </div>

                <div class="bg-white/70 rounded-xl p-4 border border-stone-300">
                    <h3 class="text-lg font-bold mb-3 text-stone-800">Estatísticas Vitais</h3>
                    <div class="grid gap-3">
                        <div class="bg-red-700/90 text-white p-3 rounded text-center font-bold">❤️ Vida<br><span class="text-2xl">${vida}</span></div>
                        <div class="bg-blue-700/90 text-white p-3 rounded text-center font-bold">⚡ Mana<br><span class="text-2xl">${mana}</span></div>
                        <div class="bg-yellow-600/90 text-white p-3 rounded text-center font-bold">🏃‍♂️ Energia<br><span class="text-2xl">${energia}</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    resultadoContainer.scrollIntoView({ behavior: 'smooth' });
}

function atualizarSelectAtributos() {
    const select = document.getElementById("selectAtributoManual");
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>-- Escolha um atributo --</option>`;

    const dicionarioNomes = {
        forca: "⚔️ Força",
        destreza: "🏹 Destreza",
        constituicao: "🛡️ Constituição",
        inteligencia: "📖 Inteligência",
        sabedoria: "🙏 Sabedoria",
        carisma: "🎭 Carisma"
    };

    atributosChaves.forEach(attr => {
        if (!atributosPreenchidos.includes(attr)) {
            const opcao = document.createElement("option");
            opcao.value = attr;
            opcao.textContent = dicionarioNomes[attr];
            select.appendChild(opcao);
        }
    });

    if (atributosPreenchidos.length === atributosChaves.length) {
        const botao = document.getElementById("rolarDado");
        if (botao) {
            botao.textContent = "Finalizar e Montar Ficha! ⚔️";
            botao.className = "bg-green-600 hover:bg-green-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
            botao.disabled = false;
        }
        select.innerHTML = `<option value="pronto">Todos os atributos salvos!</option>`;
        select.disabled = true;
    }
}

const formulario = document.getElementById("formPersonagem");
if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const raca = document.getElementById("raca").value;
        const classe = document.getElementById("classe").value;

        const tipoStatus = document.getElementById("tipoStatus").value;
        const tipoDado = document.getElementById("tipoDado").value;
        const vidaManual = document.getElementById("vidaManual").value;
        const manaManual = document.getElementById("manaManual").value;
        const energiaManual = document.getElementById("energiaManual").value;

        if (nome === "" || raca === "" || classe === "") {
            alert("Por favor, informe o Nome, a Raça e a Classe do seu herói!");
            return;
        }

        dadosTemporariosForm = { nome, raca, classe, tipoStatus, tipoDado, vidaManual, manaManual, energiaManual };

        if (modoCriacao === "manual") {
            mostrarTelaRolagem();

            atributosPreenchidos = [];
            atributosRolados = {};

            atualizarTextoRolagem();

            const botaoRolar = document.getElementById("rolarDado");
            if (botaoRolar) {
                botaoRolar.className = "bg-red-600 hover:bg-red-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
            }

            const select = document.getElementById("selectAtributoManual");
            if (select) select.disabled = false;
            atualizarSelectAtributos();
        } else {
            const personagemAleatorio = {
                nome,
                raca,
                classe,
                atributos: {
                    forca: gerarAtributo(tipoDado),
                    destreza: gerarAtributo(tipoDado),
                    constituicao: gerarAtributo(tipoDado),
                    inteligencia: gerarAtributo(tipoDado),
                    sabedoria: gerarAtributo(tipoDado),
                    carisma: gerarAtributo(tipoDado)
                }
            };
            mostrarResultado();
            renderizarFicha(personagemAleatorio);
        }
    });
}

const tipoStatusSelect = document.getElementById("tipoStatus");
if (tipoStatusSelect) {
    tipoStatusSelect.addEventListener("change", function () {
        const containerInputs = document.getElementById("containerStatusManuais");
        if (this.value === "manual") {
            containerInputs.classList.remove("hidden");
        } else {
            containerInputs.classList.add("hidden");
        }
    });
}

const botaoRolarDado = document.getElementById("rolarDado");
if (botaoRolarDado) {
    botaoRolarDado.addEventListener("click", function () {
        const select = document.getElementById("selectAtributoManual");
        if (!select) return;

        if (atributosPreenchidos.length === atributosChaves.length) {
            const personagemManual = {
                nome: dadosTemporariosForm.nome,
                raca: dadosTemporariosForm.raca,
                classe: dadosTemporariosForm.classe,
                atributos: { ...atributosRolados }
            };
            mostrarResultado();
            renderizarFicha(personagemManual);
            return;
        }

        const atributoSelecionado = select.value;
        if (!atributoSelecionado) {
            alert("Selecione primeiro qual atributo receberá o valor desta rolagem!");
            return;
        }

        const dadoExibicao = document.getElementById("resultadoDado");
        const botao = this;
        const tipoDado = dadosTemporariosForm.tipoDado || "d20";
        botao.disabled = true;
        select.disabled = true;

        const animacaoGiro = setInterval(() => {
            if (dadoExibicao) dadoExibicao.textContent = rolarDado(tipoDado);
        }, 70);

        setTimeout(() => {
            clearInterval(animacaoGiro);
            const valorFinalDado = rolarDado(tipoDado);
            if (dadoExibicao) dadoExibicao.textContent = valorFinalDado;

            atributosRolados[atributoSelecionado] = valorFinalDado;
            atributosPreenchidos.push(atributoSelecionado);

            select.disabled = false;
            atualizarSelectAtributos();
            botao.disabled = false;
        }, 1000);
    });
}

const btnMenu = document.getElementById("btnMenu");
const menuDropdown = document.getElementById("menuDropdown");

if (btnMenu && menuDropdown) {
    btnMenu.addEventListener("click", () => menuDropdown.classList.toggle("hidden"));
}

const menuAleatorio = document.getElementById("menuAleatorio");
if (menuAleatorio) {
    menuAleatorio.addEventListener("click", () => {
        modoCriacao = "aleatorio";
        if (menuDropdown) menuDropdown.classList.add("hidden");
        document.getElementById("telaFormulario").classList.remove("hidden");
        document.getElementById("rolagem").classList.add("hidden");
        document.getElementById("resultado").classList.add("hidden");
        document.getElementById("btnCriar").textContent = "Criar Personagem Aleatório 🎲";
    });
}

const menuManual = document.getElementById("menuManual");
if (menuManual) {
    menuManual.addEventListener("click", () => {
        modoCriacao = "manual";
        if (menuDropdown) menuDropdown.classList.add("hidden");
        document.getElementById("telaFormulario").classList.remove("hidden");
        document.getElementById("rolagem").classList.add("hidden");
        document.getElementById("resultado").classList.add("hidden");
        document.getElementById("btnCriar").textContent = "Avançar para Distribuição de Dados ⚔️";
    });
}

const btnLogin = document.getElementById("menuLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        if (menuDropdown) menuDropdown.classList.add("hidden");
        window.location.href = "login.html";
    });
}

const btnPirata = document.getElementById("menuPirata");
if (btnPirata) {
    btnPirata.addEventListener("click", () => {
        if (menuDropdown) menuDropdown.classList.add("hidden");
        window.location.href = "pirata.html";
    });
}

const btnPNGMedieval = document.getElementById("btnBaixarPNG");
if (btnPNGMedieval) {
    btnPNGMedieval.addEventListener("click", () => {
        const elementoFicha = document.getElementById("resultado");
        if (!elementoFicha) return;

        html2canvas(elementoFicha, {
            scale: 2,
            backgroundColor: '#0f172a',
            useCORS: true,
            logging: false
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `ficha-medieval-${dadosTemporariosForm.nome || 'heroi'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    if (typeof global !== 'undefined' && !global.document) {
        try {
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM('<!DOCTYPE html><html><body><div id="telaFormulario"></div><div id="rolagem"></div><div id="containerResultado"></div><div id="resultado"></div><div id="tituloRolagem"></div><div id="subtituloRolagem"></div><button id="rolarDado"></button><select id="selectAtributoManual"></select><form id="formPersonagem"><input id="nome" value="Herói Teste"/><input id="raca" value="Humano"/><input id="classe" value="Guerreiro"/><select id="tipoStatus"><option value="auto" selected></select><select id="tipoDado"><option value="d20" selected></select><input id="vidaManual"/><input id="manaManual"/><input id="energiaManual"/></form></body></html>');
            global.window = dom.window;
            global.document = dom.window.document;
            global.navigator = dom.window.navigator;
            global.Math = Math;
        } catch (e) {
            global.document = { getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } }) };
        }
    }
    module.exports = {
        atributosChaves, obterNomeTipoDado, rolarDado, gerarAtributo,
        calcularModificador, aplicarBonus, mostrarTelaRolagem, mostrarResultado,
        atualizarTextoRolagem, renderizarFicha, atualizarSelectAtributos
    };
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const containerResultado = document.getElementById('containerResultado');
        if (containerResultado) {
            const btnConcluir = document.createElement('button');
            btnConcluir.id = 'btnConcluirFichaServer';
            btnConcluir.className = 'mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all text-xl';
            btnConcluir.textContent = '💾 Concluir e Salvar Ficha no Servidor';
            
            containerResultado.appendChild(btnConcluir);

            btnConcluir.addEventListener('click', async () => {
                const payload = {
                    sistema: 'Medieval',
                    nome: dadosTemporariosForm.nome || document.getElementById('nome')?.value || 'Herói Sem Nome',
                    raca: dadosTemporariosForm.raca || document.getElementById('raca')?.value || 'Humano',
                    classe: dadosTemporariosForm.classe || document.getElementById('classe')?.value || 'Guerreiro',
                    atributos: atributosRolados
                };

                try {
                    const resposta = await fetch('http://localhost:3000/api/fichas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const dados = await resposta.json();

                    if (resposta.ok) {
                        alert(`🎉 Ficha Salva com Sucesso!\n\n${dados.mensagem}\nTotal de fichas no servidor: ${dados.quantiaCriada}`);
                    } else {
                        alert(`❌ Erro do Servidor: ${dados.erro}`);
                    }
                } catch (erro) {
                    alert('❌ Erro de Conexão: Certifique-se de que o server.js está rodando na porta 3000.');
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    if (typeof global !== 'undefined' && !global.document) {
        try {
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM('<!DOCTYPE html><html><body><div id="telaFormulario"></div><div id="rolagem"></div><div id="containerResultado"></div><div id="resultado"></div><div id="tituloRolagem"></div><div id="subtituloRolagem"></div><button id="rolarDado"></button><select id="selectAtributoManual"></select><form id="formPersonagem"><input id="nome" value="Herói Teste"/><input id="raca" value="Humano"/><input id="classe" value="Guerreiro"/><select id="tipoStatus"><option value="auto" selected></select><select id="tipoDado"><option value="d20" selected></select><input id="vidaManual"/><input id="manaManual"/><input id="energiaManual"/></form></body></html>');
            global.window = dom.window;
            global.document = dom.window.document;
            global.navigator = dom.window.navigator;
        } catch (e) {
            global.document = { getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }) };
        }
    }
    module.exports = {
        atributosChaves, obterNomeTipoDado, rolarDado, gerarAtributo,
        calcularModificador, aplicarBonus, mostrarTelaRolagem, mostrarResultado,
        atualizarTextoRolagem, renderizarFicha, atualizarSelectAtributos
    };
}

function enviarFichaAoServidor(sistema, nome, raca, classe, atributos) {
    const usuarioId = localStorage.getItem('usuarioId'); 

    const dadosFicha = {
        sistema: sistema,
        nome: nome,
        raca: raca,
        classe: classe,
        atributos: atributos,
        usuarioId: usuarioId ? parseInt(usuarioId) : null
    };

    fetch('http://localhost:3000/api/fichas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFicha)
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert("Erro: " + data.erro);
        } else {
            alert(data.mensagem);
        }
    })
    .catch(err => console.error("Erro ao enviar dados:", err));
}
