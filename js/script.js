document.addEventListener("DOMContentLoaded", function () {
    // Seleciona elementos
    const btnComprar = document.querySelectorAll(".btn-comprar");
    const linksMenu = document.querySelectorAll('.navbar-nav a');
    const cepInput = document.getElementById('cep');
    const valorFrete = document.getElementById('valorFrete');
    const listaCarrinho = document.getElementById("lista-carrinho");
    const totalCarrinho = document.getElementById("total-carrinho");
    const contadorCarrinho = document.getElementById("contador-carrinho");
    const btnCarrinho = document.getElementById("btn-carrinho");
    const carrinhoLateral = document.getElementById("carrinho-lateral");
    const fecharCarrinho = document.getElementById("fechar-carrinho");
    const formBusca = document.querySelector("form.d-flex");
    const formCadastro = document.getElementById("form-cadastro");
    const campoCep = document.getElementById("cep");
    const campoLogradouro = document.getElementById("logradouro");
    const campoBairro = document.getElementById("bairro");
    const campoCidade = document.getElementById("cidade");
    const campoEstado = document.getElementById("estado");

    // Eventos de clique para botões "Comprar"
    btnComprar.forEach((botao) => {
        botao.addEventListener("click", function (e) {
            e.preventDefault();
            const nomeProduto = this.getAttribute("data-nome"); // Obtém o nome do produto
            const precoProduto = parseFloat(this.getAttribute("data-preco")); // Obtém o preço do produto
            adicionarAoCarrinho(nomeProduto, precoProduto);
        });
    });

    // Rolagem suave para links do menu
    linksMenu.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // Cálculo de frete
    document.getElementById('calcularFrete').addEventListener('click', () => {
        const cep = cepInput.value.trim();

        if (!validarCEP(cep)) {
            alert("CEP inválido. Por favor, insira um CEP válido.");
            return;
        }

        consultarCEP(cep)
            .then(data => {
                if (data.erro) {
                    alert("CEP não encontrado.");
                    return;
                }

                const frete = calcularFrete(data.uf);
                valorFrete.textContent = `Frete: R$ ${frete.toFixed(2)}`;
            })
            .catch(error => {
                console.error(error);
                alert("Erro ao consultar o CEP. Tente novamente.");
            });
    });

    // Funções para validar, consultar e calcular frete
    function validarCEP(cep) {
        return /^[0-9]{5}-?[0-9]{3}$/.test(cep);
    }

    function consultarCEP(cep) {
        return fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na consulta do CEP');
                }
                return response.json();
            });
    }

    function calcularFrete(uf) {
        const regiao = {
            'SP': 10.00,
            'RJ': 15.00,
            'MG': 12.00,
            'RS': 20.00,
            // Adicione outras regiões conforme necessário
        };

        return regiao[uf] || 25.00;
    }

    // Funções para manipular o carrinho
    const carrinho = [];

    function atualizarCarrinho() {
        listaCarrinho.innerHTML = "";
        let total = 0;

        carrinho.forEach((produto, index) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${produto.nome} - R$ ${produto.preco.toFixed(2)}
                <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${index})">Remover</button>
            `;
            listaCarrinho.appendChild(li);
            total += produto.preco;
        });

        totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
        contadorCarrinho.textContent = carrinho.length;
    }

    window.adicionarAoCarrinho = function (nome, preco) {
        carrinho.push({ nome, preco });
        atualizarCarrinho();
        alert(`${nome} foi adicionado ao carrinho!`);
    };

    window.removerDoCarrinho = function (index) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    };

    // Eventos para abrir e fechar o carrinho
    btnCarrinho.addEventListener("click", function (e) {
        e.preventDefault();
        carrinhoLateral.classList.add("aberto");
    });

    fecharCarrinho.addEventListener("click", function () {
        carrinhoLateral.classList.remove("aberto");
    });

    // Barra de busca
    formBusca.addEventListener("submit", function (e) {
        e.preventDefault();
        const termoBusca = this.querySelector("input").value;
        alert(`Você buscou por: ${termoBusca}`);
        // Implementar a lógica de busca aqui
    });

    // Validação e envio do formulário de cadastro
    formCadastro.addEventListener("submit", function (e) {
        e.preventDefault();

        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem. Tente novamente.");
            return;
        }

        // Validações adicionais (exemplo)
        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        // Simulação de cadastro (substituir por chamada ao servidor)
        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";
    });

    // Autocompletar endereço pelo CEP
    campoCep.addEventListener("blur", function () {
        const cep = campoCep.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert("CEP inválido. Digite um CEP com 8 dígitos.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((response) => response.json())
            .then((data) => {
                if (data.erro) {
                    alert("CEP não encontrado.");
                    return;
                }

                campoLogradouro.value = data.logradouro;
                campoBairro.value = data.bairro;
                campoCidade.value = data.localidade;
                campoEstado.value = data.uf;
            })
            .catch(() => {
                alert("Erro ao consultar o CEP. Tente novamente.");
            });
    });
});

//fale conosco
    document.getElementById('form-contato').addEventListener('submit', function (event) {
        // Impede o envio padrão do formulário
        event.preventDefault();

        // Verifica se o formulário é válido
        if (this.checkValidity()) {
            // Exibe o alerta personalizado
            alert('📧 Email enviado com sucesso! 🐶\nEntraremos em contato em breve.');

            // Limpa o formulário após o envio (opcional)
            this.reset();
        } else {
            // Adiciona a classe de validação do Bootstrap se o formulário for inválido
            this.classList.add('was-validated');
        }
    });

