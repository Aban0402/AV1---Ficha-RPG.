const atributosPirata = ["forca", "destreza", "constituicao", "sorte", "carisma"];
let atributosRolados = {};
let atributosPreenchidos = [];
let dadosTemporariosForm = {};
let modoCriacaoPirata = "aleatorio";
let modoStatusPirata = "auto";
let faseRolagemPirata = "atributos";
let personagemAtualPirata = null;
let statusRoladosPirata = {};
let statusPreenchidosPirata = [];

function rolarD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function rolarD12() {
    return Math.floor(Math.random() * 12) + 1;
}

function rolarD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function calcularModificadorPirata(valor) {
    return Math.floor((valor - 7) / 2);
}

function gerarAtributoPirata() {
    return rolarD6() + rolarD6();
}

function construirPersonagemBase() {
    const atributos = {
        forca: 7,
        destreza: 7,
        constituicao: 7,
        sorte: 7,
        carisma: 7
    };

    Object.keys(atributosRolados).forEach(attr => {
        atributos[attr] = atributosRolados[attr];
    });

    return { atributos };
}

function calcularStatusAutomatico(personagem) {
    const modCarisma = calcularModificadorPirata(personagem.atributos.carisma || 7);
    const modConstituicao = calcularModificadorPirata(personagem.atributos.constituicao || 7);

    return {
        vida: rolarD6() + rolarD6(),
        sanidade: rolarD20() + modCarisma,
        energia: rolarD20() + modConstituicao
    };
}

function calcularStatusManualPirata(personagem, tipoStatus) {
    const modCarisma = calcularModificadorPirata(personagem.atributos.carisma || 7);
    const modConstituicao = calcularModificadorPirata(personagem.atributos.constituicao || 7);

    switch (tipoStatus) {
        case "vida":
            return rolarD12();
        case "sanidade":
            return rolarD20() + modCarisma;
        case "energia":
            return rolarD20() + modConstituicao;
        default:
            return 0;
    }
}

function calcularStatusDoPersonagem(personagem) {
    if (dadosTemporariosForm.tipoStatus === "manual-dado" || dadosTemporariosForm.tipoStatus === "manual-escrito") {
        return {
            vida: statusRoladosPirata.vida || parseInt(document.getElementById("vidaManualPirata")?.value || "0", 10) || 0,
            sanidade: statusRoladosPirata.sanidade || parseInt(document.getElementById("sanidadeManualPirata")?.value || "0", 10) || 0,
            energia: statusRoladosPirata.energia || parseInt(document.getElementById("energiaManualPirata")?.value || "0", 10) || 0
        };
    }

    return calcularStatusAutomatico(personagem);
}

function mostrarTelaRolagem() {
    const telaFormulario = document.getElementById("telaFormulario");
    const rolagem = document.getElementById("rolagem");
    const containerResultado = document.getElementById("containerResultado");
    if (telaFormulario) telaFormulario.classList.add("hidden");
    if (rolagem) rolagem.classList.remove("hidden");
    if (containerResultado) containerResultado.classList.add("hidden");
}

function mostrarResultadoPirata() {
    const telaFormulario = document.getElementById("telaFormulario");
    const rolagem = document.getElementById("rolagem");
    const containerResultado = document.getElementById("containerResultado");
    if (telaFormulario) telaFormulario.classList.add("hidden");
    if (rolagem) rolagem.classList.add("hidden");
    if (containerResultado) containerResultado.classList.remove("hidden");
}

function renderizarFichaPirata(personagem) {
    const mods = {};
    atributosPirata.forEach(attr => {
        mods[attr] = calcularModificadorPirata(personagem.atributos[attr] || 7);
    });

    const statusAtual = calcularStatusDoPersonagem(personagem);

    const resultadoDiv = document.getElementById("resultado");
    const container = document.getElementById("containerResultado");
    if (!resultadoDiv || !container) return;

    mostrarResultadoPirata();
    resultadoDiv.innerHTML = `
        <div class="text-center mb-4 border-b-2 border-stone-800 pb-1">
            <h2 class="text-2xl font-bold uppercase tracking-widest fonte-titulo-pirata text-stone-900">Mares de Sangue — Ficha de Personagem</h2>
        </div>
        
        <div class="grid grid-cols-3 gap-x-4 gap-y-2 mb-4 fonte-texto-pirata text-xs text-stone-900 border-b border-stone-300 pb-3">
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Nome:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 font-bold h-4 overflow-hidden">${personagem.nome || '____________________'}</span>
            </div>
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Cargo:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 font-bold h-4 overflow-hidden">${personagem.classe || '____________________'}</span>
            </div>
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Origem / Raça:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 font-bold h-4 overflow-hidden">${personagem.raca || '____________________'}</span>
            </div>
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Idade:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 h-4"></span>
            </div>
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Local Nasc.:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 h-4"></span>
            </div>
            <div class="flex items-center">
                <strong class="whitespace-nowrap mr-1">Altura:</strong> 
                <span class="border-b border-stone-500 flex-1 pl-1 h-4"></span>
            </div>
            
            <div class="col-span-3 mt-1">
                <strong>Descrição Física / Marcas:</strong> 
                <div class="linha-pautada mt-0.5"></div>
            </div>
            <div class="col-span-3 mt-1">
                <strong>História Pregressa:</strong> 
                <div class="linha-pautada mt-0.5"></div>
                <div class="linha-pautada"></div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-2.5 caixa-interna-pirata">
                <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 border-b border-stone-400 pb-0.5 text-center fonte-titulo-pirata">Atributos Base (2D6)</h3>
                <div class="space-y-1.5 fonte-texto-pirata text-xs text-stone-900">
                    <div class="flex justify-between items-center">
                        <span>⚔️ <strong>Força:</strong></span>
                        <span class="border border-stone-700 px-2 py-0.5 font-bold">${personagem.atributos.forca || 7} (Mod: ${mods.forca >= 0 ? '+' : ''}${mods.forca})</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>🏹 <strong>Destreza:</strong></span>
                        <span class="border border-stone-700 px-2 py-0.5 font-bold">${personagem.atributos.destreza || 7} (Mod: ${mods.destreza >= 0 ? '+' : ''}${mods.destreza})</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>⚓ <strong>Constituição:</strong></span>
                        <span class="border border-stone-700 px-2 py-0.5 font-bold">${personagem.atributos.constituicao || 7} (Mod: ${mods.constituicao >= 0 ? '+' : ''}${mods.constituicao})</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>🎲 <strong>Sorte:</strong></span>
                        <span class="border border-stone-700 px-2 py-0.5 font-bold">${personagem.atributos.sorte || 7} (Mod: ${mods.sorte >= 0 ? '+' : ''}${mods.sorte})</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>🗣️ <strong>Carisma:</strong></span>
                        <span class="border border-stone-700 px-2 py-0.5 font-bold">${personagem.atributos.carisma || 7} (Mod: ${mods.carisma >= 0 ? '+' : ''}${mods.carisma})</span>
                    </div>
                </div>
            </div>

            <div class="p-2.5 caixa-interna-pirata flex flex-col justify-between">
                <div>
                    <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5 border-b border-stone-400 pb-0.5 text-center fonte-titulo-pirata">Status & Condição Física</h3>
                    <div class="grid grid-cols-2 gap-x-2 gap-y-1 fonte-texto-pirata text-[11px] text-stone-900 mb-2">
                        <div><span class="caixa-selecao-manual"></span> Saudável</div>
                        <div><span class="caixa-selecao-manual"></span> Ferido</div>
                        <div><span class="caixa-selecao-manual"></span> Escorbuto</div>
                        <div><span class="caixa-selecao-manual"></span> Embriagado</div>
                        <div><span class="caixa-selecao-manual"></span> Doente</div>
                        <div><span class="caixa-selecao-manual"></span> Amaldiçoado</div>
                        <div><span class="caixa-selecao-manual"></span> Loucura Temp.</div>
                        <div><span class="caixa-selecao-manual"></span> Loucura Perm.</div>
                    </div>
                    <div class="space-y-1.5 border-t border-stone-300 pt-1.5 text-xs">
                        <div class="flex justify-between items-center">
                            <span>❤️ <strong>Pontos de Vida (PV):</strong></span>
                            <span class="text-stone-900 font-bold">${statusAtual.vida}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>🧠 <strong>Sanidade:</strong></span>
                            <span class="text-stone-900 font-bold">${statusAtual.sanidade}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>⚡ <strong>Energia:</strong></span>
                            <span class="text-stone-900 font-bold">${statusAtual.energia}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-2.5 caixa-interna-pirata mb-4">
            <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5 border-b border-stone-400 pb-0.5 fonte-titulo-pirata">⚔️ Armas & Equipamento Ativo</h3>
            <div class="space-y-0.5">
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
            </div>
        </div>

        <div class="p-2.5 caixa-interna-pirata mb-4">
            <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5 border-b border-stone-400 pb-0.5 fonte-titulo-pirata">🎒 Inventário Geral & Carga</h3>
            <div class="space-y-0.5">
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-2.5 caixa-interna-pirata">
                <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5 border-b border-stone-400 pb-0.5 fonte-titulo-pirata">💀 Estigmas, Maldições & Reputação</h3>
                <div class="space-y-0.5">
                    <div class="linha-pautada"></div>
                    <div class="linha-pautada"></div>
                </div>
            </div>

            <div class="p-2.5 caixa-interna-pirata">
                <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5 border-b border-stone-400 pb-0.5 fonte-titulo-pirata">⚓ Aliados, Inimigos & Facções</h3>
                <div class="space-y-0.5">
                    <div class="linha-pautada"></div>
                    <div class="linha-pautada"></div>
                </div>
            </div>
        </div>

        <div class="p-2.5 caixa-interna-pirata">
            <h3 class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5 border-b border-stone-400 pb-0.5 fonte-titulo-pirata">📜 Anotações Gerais & Diário de Bordo</h3>
            <div class="space-y-0.5">
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
                <div class="linha-pautada"></div>
            </div>
        </div>
    `;

    container.classList.remove("hidden");
    container.scrollIntoView({ behavior: 'smooth' });
}

const btnPNG = document.getElementById("btnBaixarPNG");
if (btnPNG) {
    btnPNG.addEventListener("click", () => {
        const elementoFicha = document.getElementById("blocoImpressao");
        if (!elementoFicha) return;

        html2canvas(elementoFicha, {
            scale: 2,
            backgroundColor: '#faf6ee',
            useCORS: true,
            logging: false
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `ficha-pirata-${dadosTemporariosForm.nome || 'marujo'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
}

const formularioPirata = document.getElementById("formPirata");
if (formularioPirata) {
    formularioPirata.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const raca = document.getElementById("raca").value;
        const classe = document.getElementById("classe").value;
        const tipoStatus = document.getElementById("tipoStatusPirata").value;
        const vidaManual = document.getElementById("vidaManualPirata").value;
        const sanidadeManual = document.getElementById("sanidadeManualPirata").value;
        const energiaManual = document.getElementById("energiaManualPirata").value;

        modoCriacaoPirata = document.getElementById("modoCriacaoPirata").value;
        modoStatusPirata = tipoStatus;

        dadosTemporariosForm = {
            nome,
            raca,
            classe,
            tipoStatus,
            vidaManual,
            sanidadeManual,
            energiaManual
        };

        atributosPreenchidos = [];
        atributosRolados = {};

        if (modoCriacaoPirata === "manual" || modoCriacaoPirata === "manual-escrito") {
            mostrarTelaRolagem();
            faseRolagemPirata = "atributos";
            atualizarTelaRolagemPirata();
        } else {
            const personagemAleatorio = {
                nome,
                raca,
                classe,
                atributos: {
                    forca: gerarAtributoPirata(),
                    destreza: gerarAtributoPirata(),
                    constituicao: gerarAtributoPirata(),
                    sorte: gerarAtributoPirata(),
                    carisma: gerarAtributoPirata()
                }
            };

            personagemAtualPirata = personagemAleatorio;
            atributosRolados = { ...personagemAleatorio.atributos };
            atributosPreenchidos = [...atributosPirata];
            statusRoladosPirata = {};
            statusPreenchidosPirata = [];

            mostrarTelaRolagem();
            if (tipoStatus === "manual-dado" || tipoStatus === "manual-escrito") {
                faseRolagemPirata = "status";
                atualizarTelaRolagemPirata();
            } else {
                renderizarFichaPirata(personagemAleatorio);
            }
        }
    });
}

function atualizarSelectAtributosPirata() {
    const select = document.getElementById("selectAtributoManual");
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>-- Escolha o Atributo --</option>`;
    const tradutor = { forca: "⚔️ Força", destreza: "🏹 Destreza", constituicao: "⚓ Constituição", sorte: "🎲 Sorte", carisma: "🗣️ Carisma" };

    atributosPirata.forEach(attr => {
        if (!atributosPreenchidos.includes(attr)) {
            const opt = document.createElement("option");
            opt.value = attr;
            opt.textContent = tradutor[attr];
            select.appendChild(opt);
        }
    });

    if (atributosPreenchidos.length === atributosPirata.length) {
        const botao = document.getElementById("rolarDado");
        if (botao) {
            botao.textContent = "Próximo: Status ⚓";
            botao.className = "bg-cyan-600 hover:bg-cyan-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
        }
        select.innerHTML = `<option value="pronto">Pronto!</option>`;
        select.disabled = true;
    }
}

function atualizarSelectStatusPirata() {
    const select = document.getElementById("selectStatusManualPirata");
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>-- Escolha um status --</option>`;
    const opcoes = [
        { valor: "vida", texto: "❤️ Vida" },
        { valor: "sanidade", texto: "🧠 Sanidade" },
        { valor: "energia", texto: "⚡ Energia" }
    ];

    opcoes.forEach(op => {
        if (!statusPreenchidosPirata.includes(op.valor)) {
            const opt = document.createElement("option");
            opt.value = op.valor;
            opt.textContent = op.texto;
            select.appendChild(opt);
        }
    });

    if (statusPreenchidosPirata.length === 3) {
        const botao = document.getElementById("rolarDado");
        if (botao) {
            botao.textContent = "Gerar Ficha Final ⚓";
            botao.className = "bg-green-600 hover:bg-green-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
        }
        select.innerHTML = `<option value="pronto">Pronto!</option>`;
        select.disabled = true;
    }
}

function atualizarTelaRolagemPirata() {
    const containerAtributos = document.getElementById("containerSelecaoAtributoManual");
    const containerStatus = document.getElementById("containerSelecaoStatusManual");
    const containerValorStatus = document.getElementById("containerValorStatusEscritoPirata");
    const containerValorAtributo = document.getElementById("containerValorAtributoEscritoPirata");
    const titulo = document.getElementById("tituloRolagemPirata");
    const subtitulo = document.getElementById("subtituloRolagemPirata");
    const botao = document.getElementById("rolarDado");
    const mensagemStatus = document.getElementById("resultadoRolagemStatusPirata");

    if (faseRolagemPirata === "atributos") {
        if (containerAtributos) containerAtributos.classList.remove("hidden");
        if (containerStatus) containerStatus.classList.add("hidden");
        if (containerValorAtributo) {
            containerValorAtributo.classList.toggle("hidden", modoCriacaoPirata !== "manual-escrito");
        }
        if (titulo) titulo.textContent = "Definição de Atributos (2D6)";
        if (subtitulo) {
            subtitulo.textContent = modoCriacaoPirata === "manual-escrito"
                ? "Escolha um atributo por vez e digite o valor diretamente na caixa abaixo."
                : "Escolha um atributo por vez, role os dados e salve o valor.";
        }
        if (botao) {
            botao.textContent = modoCriacaoPirata === "manual-escrito" ? "💾 Salvar Atributo" : "🎲 Rolar Dados";
            botao.className = modoCriacaoPirata === "manual-escrito"
                ? "bg-cyan-600 hover:bg-cyan-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all"
                : "bg-red-600 hover:bg-red-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
        }
        atualizarSelectAtributosPirata();
    } else {
        if (containerAtributos) containerAtributos.classList.add("hidden");
        if (containerStatus) containerStatus.classList.remove("hidden");
        if (containerValorAtributo) {
            containerValorAtributo.classList.add("hidden");
        }
        if (containerValorStatus) {
            containerValorStatus.classList.toggle("hidden", dadosTemporariosForm.tipoStatus !== "manual-escrito");
        }
        if (containerValorAtributo) {
            containerValorAtributo.classList.add("hidden");
        }
        if (titulo) titulo.textContent = "Definição de Status (Manual)";
        if (subtitulo) {
            subtitulo.textContent = dadosTemporariosForm.tipoStatus === "manual-dado"
                ? "Atributos já foram definidos. Agora gere cada status manualmente, seguindo as regras da ficha."
                : "Atributos já foram definidos. Agora escreva cada status manualmente e salve na ficha.";
        }
        if (mensagemStatus) {
            mensagemStatus.textContent = dadosTemporariosForm.tipoStatus === "manual-dado"
                ? "Regras: Vida = 1D12 | Sanidade = 1D20 + Modificador de Carisma | Energia = 1D20 + Modificador de Constituição"
                : "Digite os valores de Vida, Sanidade e Energia para completar a ficha.";
        }
        if (botao) {
            botao.textContent = dadosTemporariosForm.tipoStatus === "manual-dado" ? "🎲 Rolar Status" : "💾 Salvar Status";
            botao.className = "bg-cyan-600 hover:bg-cyan-500 px-8 py-4 rounded text-xl font-bold shadow-md transition-all";
        }
        atualizarSelectStatusPirata();
    }
}

const btnRolar = document.getElementById("rolarDado");
if (btnRolar) {
    btnRolar.addEventListener("click", function () {
        if (faseRolagemPirata === "atributos") {
            const select = document.getElementById("selectAtributoManual");
            if (!select) return;

            if (atributosPreenchidos.length === atributosPirata.length) {
                const personagemManual = {
                    nome: dadosTemporariosForm.nome,
                    raca: dadosTemporariosForm.raca,
                    classe: dadosTemporariosForm.classe,
                    atributos: { ...atributosRolados }
                };
                personagemAtualPirata = personagemManual;
                if (dadosTemporariosForm.tipoStatus === "manual-dado") {
                    faseRolagemPirata = "status";
                    statusRoladosPirata = {};
                    statusPreenchidosPirata = [];
                    atualizarTelaRolagemPirata();
                } else if (dadosTemporariosForm.tipoStatus === "manual-escrito") {
                    faseRolagemPirata = "status";
                    statusRoladosPirata = {};
                    statusPreenchidosPirata = [];
                    atualizarTelaRolagemPirata();
                } else {
                    renderizarFichaPirata(personagemManual);
                }
                return;
            }

            const selecionado = select.value;
            if (!selecionado) {
                alert("Selecione um atributo primeiro!");
                return;
            }

            if (modoCriacaoPirata === "manual-escrito") {
                const valorDigitado = parseInt(document.getElementById("valorAtributoManualPirata")?.value || "", 10);
                if (Number.isNaN(valorDigitado) || valorDigitado < 1) {
                    alert("Digite um valor válido para o atributo selecionado.");
                    return;
                }

                atributosRolados[selecionado] = valorDigitado;
                atributosPreenchidos.push(selecionado);

                const inputAtributo = document.getElementById("valorAtributoManualPirata");
                if (inputAtributo) inputAtributo.value = "";
                atualizarSelectAtributosPirata();
                return;
            }

            const d1El = document.getElementById("dado1");
            const d2El = document.getElementById("dado2");
            const totalEl = document.getElementById("totalDices");

            this.disabled = true;
            select.disabled = true;

            const animacao = setInterval(() => {
                d1El.textContent = Math.floor(Math.random() * 6) + 1;
                d2El.textContent = Math.floor(Math.random() * 6) + 1;
            }, 70);

            setTimeout(() => {
                clearInterval(animacao);
                const r1 = rolarD6();
                const r2 = rolarD6();
                const somaFinal = r1 + r2;

                d1El.textContent = r1;
                d2El.textContent = r2;
                totalEl.textContent = `Total: ${somaFinal}`;

                atributosRolados[selecionado] = somaFinal;
                atributosPreenchidos.push(selecionado);

                select.disabled = false;
                atualizarSelectAtributosPirata();
                this.disabled = false;
            }, 1000);
            return;
        }

        const selectStatus = document.getElementById("selectStatusManualPirata");
        const mensagem = document.getElementById("resultadoRolagemStatusPirata");
        const inputValorStatus = document.getElementById("valorStatusManualPirata");

        if (!selectStatus) return;

        if (statusPreenchidosPirata.length === 3) {
            renderizarFichaPirata(personagemAtualPirata);
            return;
        }

        const selecionado = selectStatus.value;
        if (!selecionado) {
            alert("Selecione um status primeiro!");
            return;
        }

        const d1El = document.getElementById("dado1");
        const d2El = document.getElementById("dado2");
        const totalEl = document.getElementById("totalDices");

        if (dadosTemporariosForm.tipoStatus === "manual-escrito") {
            const valorDigitado = parseInt(inputValorStatus?.value || "", 10);
            if (Number.isNaN(valorDigitado) || valorDigitado < 1) {
                alert("Digite um valor válido para o status selecionado.");
                return;
            }

            const mapaCampos = { vida: "vidaManualPirata", sanidade: "sanidadeManualPirata", energia: "energiaManualPirata" };
            const input = document.getElementById(mapaCampos[selecionado]);
            if (input) {
                input.value = valorDigitado;
                input.readOnly = true;
                input.classList.remove("bg-cyan-50", "text-black");
                input.classList.add("bg-gray-200", "text-gray-600");
            }

            d1El.textContent = valorDigitado;
            d2El.textContent = "✓";
            totalEl.textContent = `Status: ${valorDigitado}`;
            statusRoladosPirata[selecionado] = valorDigitado;
            statusPreenchidosPirata.push(selecionado);

            const nomes = { vida: "Vida", sanidade: "Sanidade", energia: "Energia" };
            if (mensagem) {
                mensagem.textContent = `${nomes[selecionado]} salva na ficha com ${valorDigitado}.`;
            }

            selectStatus.value = "";
            if (inputValorStatus) inputValorStatus.value = "";
            atualizarSelectStatusPirata();
            if (statusPreenchidosPirata.length === 3) {
                renderizarFichaPirata(personagemAtualPirata);
            }
            return;
        }

        this.disabled = true;
        selectStatus.disabled = true;

        const animacao = setInterval(() => {
            const valorAnimado = Math.floor(Math.random() * 20) + 1;
            d1El.textContent = valorAnimado;
            d2El.textContent = "🎲";
        }, 70);

        setTimeout(() => {
            clearInterval(animacao);
            const valorFinal = calcularStatusManualPirata(personagemAtualPirata, selecionado);
            const mapaCampos = { vida: "vidaManualPirata", sanidade: "sanidadeManualPirata", energia: "energiaManualPirata" };
            const input = document.getElementById(mapaCampos[selecionado]);
            if (input) {
                input.value = valorFinal;
                input.readOnly = true;
                input.classList.remove("bg-cyan-50", "text-black");
                input.classList.add("bg-gray-200", "text-gray-600");
            }

            d1El.textContent = valorFinal;
            d2El.textContent = "✓";
            totalEl.textContent = `Status: ${valorFinal}`;
            statusRoladosPirata[selecionado] = valorFinal;
            statusPreenchidosPirata.push(selecionado);

            const nomes = { vida: "Vida", sanidade: "Sanidade", energia: "Energia" };
            if (mensagem) {
                mensagem.textContent = `${nomes[selecionado]} salva na ficha com ${valorFinal}.`;
            }

            selectStatus.value = "";
            selectStatus.disabled = false;
            this.disabled = false;
            atualizarSelectStatusPirata();

            if (statusPreenchidosPirata.length === 3) {
                renderizarFichaPirata(personagemAtualPirata);
            }
        }, 1000);
    });
}

function obterLimitePorTipo(tipo) {
    switch (tipo) {
        case "d12":
            return 12;
        case "2d6":
            return 12;
        default:
            return 20;
    }
}

function atualizarLimitesStatusPirata() {
    ["vidaManualPirata", "sanidadeManualPirata", "energiaManualPirata"].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.removeAttribute("max");
    });
}

function atualizarVisibilidadeStatusPirata() {
    const container = document.getElementById("containerStatusManuaisPirata");
    const texto = document.getElementById("textoStatusManualPirata");
    const modo = document.getElementById("tipoStatusPirata")?.value || "auto";

    if (container) {
        container.classList.toggle("hidden", modo !== "manual-escrito");
    }

    const modoTexto = modo === "manual-dado"
        ? "Você pode rolar os valores com as regras de status da ficha pirata."
        : modo === "manual-escrito"
            ? "Você deve digitar os valores manualmente para cada status."
            : "Os status serão calculados automaticamente.";

    if (texto) texto.textContent = modoTexto;

    ["vidaManualPirata", "sanidadeManualPirata", "energiaManualPirata"].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        const modoEscrita = modo === "manual-escrito";
        input.readOnly = !modoEscrita;
        input.classList.toggle("bg-gray-200", !modoEscrita);
        input.classList.toggle("text-gray-600", !modoEscrita);
        input.classList.toggle("bg-cyan-50", modoEscrita);
        input.classList.toggle("text-black", modoEscrita);
    });

    atualizarLimitesStatusPirata();
}

const tipoStatusPirata = document.getElementById("tipoStatusPirata");
if (tipoStatusPirata) {
    tipoStatusPirata.addEventListener("change", atualizarVisibilidadeStatusPirata);
}

["vidaManualPirata", "sanidadeManualPirata", "energiaManualPirata"].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", function () {
        const tipoDado = document.getElementById("tipoDadoPirata")?.value || "2d6";
        const limite = obterLimitePorTipo(tipoDado);
        const valor = parseInt(this.value, 10);

        if (Number.isNaN(valor)) {
            this.value = "";
            return;
        }

        if (valor < 0) {
            this.value = 0;
            return;
        }

        if (valor > limite) {
            this.value = limite;
        }
    });
});

atualizarVisibilidadeStatusPirata();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    if (typeof global !== 'undefined' && !global.document) {
        try {
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM('<!DOCTYPE html><html><body><div id="telaFormulario"></div><div id="rolagem"></div><div id="containerResultado"></div><div id="resultado"></div><div id="containerSelecaoAtributoManual"></div><div id="containerSelecaoStatusManual"></div><div id="containerValorStatusEscritoPirata"></div><div id="containerValorAtributoEscritoPirata"></div><div id="tituloRolagemPirata"></div><div id="subtituloRolagemPirata"></div><button id="rolarDado"></button><div id="resultadoRolagemStatusPirata"></div><select id="selectAtributoManual"></select><select id="selectStatusManualPirata"></select><input id="valorStatusManualPirata"/><input id="valorAtributoManualPirata"/><div id="dado1"></div><div id="dado2"></div><div id="totalDices"></div><form id="formPirata"><input id="nome" value="Marujo Teste"/><input id="raca" value="Humano"/><input id="classe" value="Capitão"/><select id="tipoStatusPirata"><option value="auto" selected></select><input id="vidaManualPirata"/><input id="sanidadeManualPirata"/><input id="energiaManualPirata"/></form></body></html>');
            global.window = dom.window;
            global.document = dom.window.document;
            global.navigator = dom.window.navigator;
            global.Math = Math;
        } catch (e) {
            global.document = { getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } }), querySelectorAll: () => [] };
        }
    }
    module.exports = {
        atributosPirata, rolarD6, rolarD12, rolarD20, calcularModificadorPirata,
        gerarAtributoPirata, construirPersonagemBase, calcularStatusAutomatico,
        calcularStatusManualPirata, calcularStatusDoPersonagem, mostrarTelaRolagem,
        mostrarResultadoPirata, renderizarFichaPirata, atualizarSelectAtributosPirata,
        atualizarSelectStatusPirata, atualizarTelaRolagemPirata, obterLimitePorTipo,
        atualizarLimitesStatusPirata, atualizarVisibilidadeStatusPirata
    };
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const containerResultado = document.getElementById('containerResultado');
        if (containerResultado) {
            const btnConcluir = document.createElement('button');
            btnConcluir.id = 'btnConcluirPirataServer';
            btnConcluir.className = 'mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all text-xl';
            btnConcluir.textContent = '⚓ Concluir e Salvar Ficha de Pirata';
            
            containerResultado.appendChild(btnConcluir);

            btnConcluir.addEventListener('click', async () => {
                const payload = {
                    sistema: 'Pirata',
                    nome: dadosTemporariosForm.nome || document.getElementById('nome')?.value || 'Marujo Sem Nome',
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
                        alert(`🏴‍☠️ Ficha de Pirata Registrada!\n\n${dados.mensagem}\nTotal de fichas no servidor: ${dados.quantiaCriada}`);
                    } else {
                        alert(`❌ Erro do Servidor: ${dados.erro}`);
                    }
                } catch (erro) {
                    alert('❌ Erro de Conexão: O servidor Node.js (server.js) está ativo na porta 3000?');
                }
            });
        }
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    if (typeof global !== 'undefined' && !global.document) {
        try {
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM('<!DOCTYPE html><html><body><div id="telaFormulario"></div><div id="rolagem"></div><div id="containerResultado"></div><div id="resultado"></div><div id="containerSelecaoAtributoManual"></div><div id="containerSelecaoStatusManual"></div><div id="containerValorStatusEscritoPirata"></div><div id="containerValorAtributoEscritoPirata"></div><div id="tituloRolagemPirata"></div><div id="subtituloRolagemPirata"></div><button id="rolarDado"></button><div id="resultadoRolagemStatusPirata"></div><select id="selectAtributoManual"></select><select id="selectStatusManualPirata"></select><input id="valorStatusManualPirata"/><input id="valorAtributoManualPirata"/><div id="dado1"></div><div id="dado2"></div><div id="totalDices"></div><form id="formPirata"><input id="nome" value="Marujo Teste"/><input id="raca" value="Humano"/><input id="classe" value="Capitão"/><select id="tipoStatusPirata"><option value="auto" selected></select><input id="vidaManualPirata"/><input id="sanidadeManualPirata"/><input id="energiaManualPirata"/></form></body></html>');
            global.window = dom.window;
            global.document = dom.window.document;
            global.navigator = dom.window.navigator;
        } catch (e) {
            global.document = { getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } }), appendChild: () => {}, querySelectorAll: () => [] };
        }
    }
    module.exports = {
        atributosPirata, rolarD6, rolarD12, rolarD20, calcularModificadorPirata,
        gerarAtributoPirata, construirPersonagemBase, calcularStatusAutomatico,
        calcularStatusManualPirata, calcularStatusDoPersonagem, mostrarTelaRolagem,
        mostrarResultadoPirata, renderizarFichaPirata, atualizarSelectAtributosPirata,
        atualizarSelectStatusPirata, atualizarTelaRolagemPirata, obterLimitePorTipo,
        atualizarLimitesStatusPirata, atualizarVisibilidadeStatusPirata
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
