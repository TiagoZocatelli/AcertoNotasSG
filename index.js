let funcionarioLogado = null;
let cupons = [];
let valorTotal = 0;
let valorCombustivelTotal = 0;
let saldoAtual = 0;
let valorInicial = 0;

function limparSaldo() {
    saldoAtual = 0;
    valorInicial = 0; // Também pode ser necessário zerar o valor inicial
    atualizarSaldo(); // Atualize o saldo exibido para refletir a mudança
}

function adicionarSaldo() {
    console.log('Botão "Adicionar Saldo" clicado!');
    let valorAdicional = parseFloat(document.getElementById('saldo-inicial').value.replace(',', '.')) || 0;
    saldoAtual += valorAdicional;
    valorInicial += valorAdicional;
    // Recalcular o saldo atual levando em consideração os cupons e o valor do combustível
    saldoAtual = valorInicial - (valorTotal + valorCombustivelTotal);
    atualizarSaldo(); // Atualizar o saldo na tela após adicionar o saldo
    document.getElementById('saldo-inicial').value = ''; // Limpar o campo após adicionar o saldo
}

function removerCupom(index) {
    // Remove o cupom da lista de cupons
    let cupomRemovido = cupons.splice(index, 1)[0];

    // Reduz o valor total de acordo com o cupom removido
    if (cupomRemovido.tipoCupom === 'normal') {
        valorTotal -= cupomRemovido.valor;
    } else if (cupomRemovido.tipoCupom === 'combustivel') {
        valorCombustivelTotal -= cupomRemovido.valorCombustivel;
    }

    // Recalcula o saldo atual
    saldoAtual = valorInicial - (valorTotal + valorCombustivelTotal);

    // Atualiza a lista de cupons exibida
    atualizarListaCupons();
    // Atualiza o saldo atual exibido
    atualizarSaldo();
}

function adicionarCupom() {
    let nomeFuncionario = document.getElementById('nome').value;
    let data = document.getElementById('data').value;
    let tipoCupom = document.getElementById('tipoCupom').value;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!nomeFuncionario || !data) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome do Funcionário e Data).');
        return;
    }

    let tipoEmissao = ''; // Inicializa o tipo de emissão como vazio

    if (tipoCupom === 'normal') {
        tipoEmissao = document.getElementById('tipoEmissao').value; // Captura o tipo de emissão apenas para cupons normais
    }

    let valor = 0;
    let chaveCupom = '';
    let valorCombustivel = 0;
    let chaveCupomCombustivel = '';

    if (tipoCupom === 'normal') {
        valor = parseFloat(document.getElementById('valor').value.replace(',', '.')) || 0;
        chaveCupom = document.getElementById('chaveCupom').value;
    } else if (tipoCupom === 'combustivel') {
        valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value.replace(',', '.')) || 0;
        chaveCupomCombustivel = document.getElementById('chaveCupomCombustivel').value;
    }

    // Verifica se o valor do cupom é maior do que o saldo atual
    if (valor > saldoAtual || valorCombustivel > saldoAtual) {
        alert('O valor do cupom não pode ser maior do que o saldo atual.');
        return;
    }

    // Adiciona o cupom à lista de cupons com o tipo de emissão (apenas se for um cupom normal)
    cupons.push({ nomeFuncionario, data, tipoCupom, tipoEmissao, valor, chaveCupom, valorCombustivel, chaveCupomCombustivel });

    // Atualiza o valor total
    valorTotal += valor;

    // Atualiza o valor total do combustível
    valorCombustivelTotal += valorCombustivel;

    // Verifica se o cupom é do tipo combustível para não atualizar o saldo
    if (tipoCupom !== 'combustivel') {
        // Atualiza o saldo atual
        saldoAtual = valorInicial - (valorTotal + valorCombustivelTotal);
    }

    // Limpa os campos de entrada
    document.getElementById('valor').value = '';
    document.getElementById('chaveCupom').value = '';
    document.getElementById('valorCombustivel').value = '';
    document.getElementById('chaveCupomCombustivel').value = '';

    // Atualiza a lista de cupons exibida
    atualizarListaCupons();
    // Atualiza o saldo exibido
    atualizarSaldo();
}


function atualizarListaCupons() {
    let listaCupons = document.getElementById('listaCupons');
    listaCupons.innerHTML = '';

    cupons.forEach(cupom => {
        let li = document.createElement('li');
        li.innerHTML = `
            <div><strong>Data:</strong> ${cupom.data}</div>
            <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
            ${cupom.chaveCupom ? `<div><strong>Chave do Cupom:</strong> ${cupom.chaveCupom}</div>` : ''}
            ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
            ${cupom.chaveCupomCombustivel ? `<div><strong>Chave do Cupom do Combustível:</strong> ${cupom.chaveCupomCombustivel}</div>` : ''}
            <button onclick="removerCupom(${cupons.indexOf(cupom)})">Remover</button>
        `;
        listaCupons.appendChild(li);
    });
}

function atualizarSaldo() {
    document.getElementById('saldo-atual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
}

function gerarRelatorio(tipo) {
    // Verifica se há cupons registrados
    if (cupons.length === 0) {
        alert('Não há cupons registrados para gerar o relatório.');
        return;
    }

    // Captura o nome do funcionário
    const nomeFuncionarioInput = document.getElementById('nome');
    funcionarioLogado = nomeFuncionarioInput.value;

    if (!funcionarioLogado) {
        alert('Por favor, insira o nome do funcionário antes de gerar o relatório.');
        return;
    }

    const relatorioContainer = document.getElementById('relatorio-container');
    relatorioContainer.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = tipo === 'detalhado' ? 'Relatório Detalhado de Cupons' : 'Relatório Resumido';
    relatorioContainer.appendChild(titulo);

    const funcionario = document.createElement('p');
    funcionario.textContent = `Funcionário: ${funcionarioLogado}`;
    relatorioContainer.appendChild(funcionario);

    if (tipo === 'detalhado') {
        const listaCupons = document.createElement('ul');
        cupons.forEach(cupom => {
            const cupomItem = document.createElement('li');
            cupomItem.innerHTML = `
                <div><strong>Data:</strong> ${cupom.data}</div>
                <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
                ${cupom.tipoCupom === 'normal' ? `<div><strong>Tipo de Emissão:</strong> ${cupom.tipoEmissao.toUpperCase()}</div>` : ''}
                ${cupom.chaveCupom ? `<div><strong>Chave do Cupom:</strong> ${cupom.chaveCupom}</div>` : ''}
                ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
                ${cupom.chaveCupomCombustivel ? `<div><strong>Chave do Cupom do Combustível:</strong> ${cupom.chaveCupomCombustivel}</div>` : ''}
            `;
            listaCupons.appendChild(cupomItem);
            listaCupons.appendChild(document.createElement('br')); // Adiciona um espaço entre os cupons
        });
        relatorioContainer.appendChild(listaCupons);
    }

    const totalCupons = document.createElement('p');
    const totalCuponsValor = cupons.reduce((total, cupom) => total + cupom.valor, 0);
    totalCupons.textContent = `Total dos Cupons: R$ ${totalCuponsValor.toFixed(2)}`;
    relatorioContainer.appendChild(totalCupons);

    if (tipo === 'detalhado') {
        const totalCombustivel = document.createElement('p');
        const totalCombustivelValor = cupons.reduce((total, cupom) => total + cupom.valorCombustivel, 0);
        totalCombustivel.textContent = `Total de Combustível: R$ ${totalCombustivelValor.toFixed(2)}`;
        relatorioContainer.appendChild(totalCombustivel);
    } else if (tipo === 'resumido') {
        const totalCombustivel = document.createElement('p');
        const totalCombustivelValor = cupons.reduce((total, cupom) => total + cupom.valorCombustivel, 0);
        totalCombustivel.textContent = `Total de Combustível (Convênio): R$ ${totalCombustivelValor.toFixed(2)}`;
        relatorioContainer.appendChild(totalCombustivel);
    }

    // Exibe o saldo atual no relatório
    const saldoAtualElement = document.createElement('p');
    saldoAtualElement.textContent = `Saldo Atual: R$ ${saldoAtual.toFixed(2)}`;
    relatorioContainer.appendChild(saldoAtualElement);

    const imprimirBotao = document.createElement('button');
    imprimirBotao.textContent = 'Imprimir Relatório';
    imprimirBotao.classList.add('imprimir-botao');
    imprimirBotao.onclick = function() {
        const relatorioWindow = window.open('', '_blank');
        relatorioWindow.document.write('<html><head><title>Relatório de Cupons</title>');
        relatorioWindow.document.write('<style>');
        relatorioWindow.document.write('body { font-family: Arial, sans-serif; background-color: #f7f7f7; }');
        relatorioWindow.document.write('.relatorio-container { max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }');
        relatorioWindow.document.write('h2 { text-align: center; color: #333; }');
        relatorioWindow.document.write('p { margin: 10px 0; }');
        relatorioWindow.document.write('ul { list-style-type: none; padding-left: 0; }');
        relatorioWindow.document.write('li { margin-bottom: 10px; }');
        relatorioWindow.document.write('strong { font-weight: bold; color: #555; }');
        relatorioWindow.document.write('@media print { .imprimir-botao { display: none; } }'); // Oculta o botão de impressão ao imprimir
        relatorioWindow.document.write('</style>');
        relatorioWindow.document.write('</head><body>');
        relatorioWindow.document.write('<div class="relatorio-container">');
        relatorioWindow.document.write(relatorioContainer.innerHTML);
        relatorioWindow.document.write('</div>');
        relatorioWindow.document.write('</body></html>');
        relatorioWindow.print();
    };
    relatorioContainer.appendChild(imprimirBotao);
}

function mostrarCampos() {
    let tipoCupom = document.getElementById('tipoCupom').value;
    let camposCupomNormal = document.getElementById('camposCupomNormal');
    let camposCombustivelConvenio = document.getElementById('camposCombustivelConvenio');

    if (tipoCupom === 'normal') {
        camposCupomNormal.style.display = 'block';
        camposCombustivelConvenio.style.display = 'none';
    } else if (tipoCupom === 'combustivel') {
        camposCupomNormal.style.display = 'none';
        camposCombustivelConvenio.style.display = 'block';
    }
}

function prepararExportacaoPDF() {
    funcionarioLogado = document.getElementById('nome').value;
    if (funcionarioLogado) {
        gerarPDF();
    } else {
        alert('Por favor, insira o nome do funcionário antes de exportar para PDF.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há um parâmetro 'action' na URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    // Se o parâmetro 'action' for 'funcao', chama a função correspondente
    if (action === 'funcao') {
        minhaFuncao(); // Chame a função desejada aqui
    }
});

function minhaFuncao() {
    // Faça algo útil aqui
    console.log('Função chamada após o redirecionamento.');
}

function limparRelatorio() {
    const relatorioContainer = document.getElementById('relatorio-container');
    relatorioContainer.innerHTML = '';
}

function limparCupons() {
    cupons = [];
    valorTotal = 0;
    valorCombustivelTotal = 0;
    atualizarListaCupons(); // Limpa a lista de cupons exibida
    atualizarSaldo(); // Atualiza o saldo exibido
}
