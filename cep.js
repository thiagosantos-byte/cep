// Adiciona o evento quando o campo CEP perde o foco (onblur)
document.addEventListener('DOMContentLoaded', () => {
    const inputCep = document.getElementById('cep');

    // Limita o campo a apenas números e formata o CEP em tempo real
    inputCep.addEventListener('input', (e) => {
        // 1. Remove qualquer caractere que NÃO seja número
        let valor = e.target.value.replace(/\D/g, '');

        // 2. Limita a no máximo 8 dígitos numéricos
        if (valor.length > 8) {
            valor = valor.slice(0, 8);
        }

        // 3. Aplica a máscara 00000-000 dinamicamente
        if (valor.length > 5) {
            e.target.value = `${valor.slice(0, 5)}-${valor.slice(5)}`;
        } else {
            e.target.value = valor;
        }
    });

    // Mantém a consulta de CEP ao perder o foco
    inputCep.addEventListener('blur', (e) => {
        pesquisacep(e.target.value);
    });
});

function limpaFormularioCep() {
    document.getElementById('rua').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidade').value = "";
    document.getElementById('uf').value = "";
    document.getElementById('ibge').value = "";
}

async function pesquisacep(valor) {
    // Nova variável "cep" somente com dígitos
    const cep = valor.replace(/\D/g, '');

    // Verifica se campo cep possui valor informado
    if (cep === "") {
        limpaFormularioCep();
        return;
    }

    // Expressão regular para validar o CEP (8 dígitos numéricos)
    const validacep = /^[0-9]{8}$/;

    if (!validacep.test(cep)) {
        limpaFormularioCep();
        alert("Formato de CEP inválido.");
        return;
    }

    // Preenche os campos com "..." enquanto consulta o webservice
    document.getElementById('rua').value = "...";
    document.getElementById('bairro').value = "...";
    document.getElementById('cidade').value = "...";
    document.getElementById('uf').value = "...";
    document.getElementById('ibge').value = "...";

    try {
        // Requisição moderna usando Fetch API
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const conteudo = await response.json();

        if (!conteudo.erro) {
            document.getElementById('rua').value = conteudo.logradouro;
            document.getElementById('bairro').value = conteudo.bairro;
            document.getElementById('cidade').value = conteudo.localidade;
            document.getElementById('uf').value = conteudo.uf;
            document.getElementById('ibge').value = conteudo.ibge;
        } else {
            limpaFormularioCep();
            alert("CEP não encontrado.");
        }
    } catch (erro) {
        limpaFormularioCep();
        alert("Erro ao consultar o serviço de CEP.");
    }
}