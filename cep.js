
document.addEventListener('DOMContentLoaded', () => {
    const inputCep = document.getElementById('cep');

  
    inputCep.addEventListener('input', (e) => {
     
        let valor = e.target.value.replace(/\D/g, '');

       
        if (valor.length > 8) {
            valor = valor.slice(0, 8);
        }

        
        if (valor.length > 5) {
            e.target.value = `${valor.slice(0, 5)}-${valor.slice(5)}`;
        } else {
            e.target.value = valor;
        }
    });

   
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

    const cep = valor.replace(/\D/g, '');

    
    if (cep === "") {
        limpaFormularioCep();
        return;
    }

   
    const validacep = /^[0-9]{8}$/;

    if (!validacep.test(cep)) {
        limpaFormularioCep();
        alert("Formato de CEP inválido.");
        return;
    }

    
    document.getElementById('rua').value = "...";
    document.getElementById('bairro').value = "...";
    document.getElementById('cidade').value = "...";
    document.getElementById('uf').value = "...";
    document.getElementById('ibge').value = "...";

    try {
        
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
