//estamos declarando constantes para definir as dimensões do nosso jogo.
const larguraJogo = 700;
const alturaJogo = 850;

//variaveis.
var alien;
var teclado;
var fogo;
var plataforma;
var segundaPlataforma;
var moeda;
var pontuacao = 0;
var placar;

//configurações básicas do phaser, onde diferente das outras vezes, estamos utilizando constantes declaradas para definir as dimensões do jogo.
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,

    //adicionando fisica ao jogo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

//estamos iniciando um novo jogo com base na constante "config".
const game = new Phaser.Game(config);

//carregamento das imagens e sprites.
function preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('player', 'assets/alienigena.png');
    this.load.image('turbo_nave', 'assets/turbo.png');
    this.load.image('plataforma_tijolo', 'assets/tijolos.png');
    this.load.image('plataforma_tijolo2', 'assets/tijolos.png');
    this.load.image('moeda', 'assets/moeda.png');
}

//configuração do comportamento das imagens e sprites.
function create() {
    //estamos configurando o nosso background a partir das constantes "larguraJogo" e "alturaJogo", porém divididas por 2.
    this.add.image(larguraJogo / 2, alturaJogo / 2, 'background');

    //adicionando a visualização de fogo na nave do alien.
    fogo = this.add.sprite(0, 0, 'turbo_nave');
    fogo.setVisible(false);

    //criação do sprite com fisica
    alien = this.physics.add.sprite(larguraJogo / 2, 0, 'player');

    //informando que o alien nãlo irá passar das bordas do jogo.
    alien.setCollideWorldBounds(true);

    //configuração da largura e altura do corpo do alien.
    alien.body.setSize(116, 100, true);
    teclado = this.input.keyboard.createCursorKeys();

    //configurando o chão do background.
    this.physics.world.setBounds(
        0,
        0,
        larguraJogo,
        alturaJogo -90,
    )

    //informando os tamanhos, e que a plataforma terá um fisica estatica.
    plataforma = this.physics.add.staticImage(larguraJogo / 2, alturaJogo / 2, 'plataforma_tijolo');
    segundaPlataforma = this.physics.add.staticImage(100, 300, 'plataforma_tijolo2');


    //adicionamos a colisão entre as plataformas e o alien.
    this.physics.add.collider(alien, plataforma);
    this.physics.add.collider(alien, segundaPlataforma);

    //adição da moeda, juntamente com a declaração de sua fisica.
    moeda = this.physics.add.sprite(larguraJogo / 2, 0, 'moeda');

    //informando que a moeda não irá ultrapaçar as bordas do jogo.
    moeda.setCollideWorldBounds(true);

    //informando que a moeda terá um efeito elastico.
    moeda.setBounce(0.5);

    //informando que a moeda haverá colisão com as plataformas.
    this.physics.add.collider(moeda, plataforma);
    this.physics.add.collider(moeda, segundaPlataforma);

    //adição do placar
    placar = this.add.text(100, 100, 'Moedas' + pontuacao, { fontSize: '45px', fill: '#495613' });

    //responsividade do placar após o alien coletar uma moeda.
    this.physics.add.overlap(alien, moeda, function () {
        moeda.setVisible(false);
        var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
        moeda.setPosition(posicaoMoeda_Y, 100);

        //contabilizador das moedas coletadas.
        pontuacao += 1;

        //atualização do placar.
        placar.setText('Moedas:' + pontuacao);

        //ativa a visão de uma nova moeda.
        moeda.setVisible(true);
    });
}

//moviemntos e atualizações dentro do jogo.
function update() {
    //adicionando o controle por teclas.
    if (teclado.left.isDown) {
        alien.setVelocityX(-150);
    }

    else if (teclado.right.isDown) {
        alien.setVelocityX(150);
    }

    else {
        alien.setVelocityX(0);
    }
    //aqui em especifico, ao apertar a tecla "up" ativamos o fogo da nave.
    if (teclado.up.isDown) {
        alien.setVelocityY(-400);
        ativarTurbo();
    }
    //aqui definimos que, caso a tecla "up" não esteja precionada, o fogo não será ativado.
    else { semTurbo() };

    fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

//criamos a função ativar fogo utilizada na linha 75.
function ativarTurbo() {
    fogo.setVisible(true);
}

//criamos a função para desativar o fogo utilizada na linha 78.
function semTurbo() {
    fogo.setVisible(false);
}
