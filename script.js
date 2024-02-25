// Declaração das constantes para definir as dimensões do jogo
const larguraJogo = 700;
const alturaJogo = 850;

// Variáveis
var alien;
var teclado;
var fogo;
var moeda;
var pontuacao = 0;
var placar;

// Configurações básicas do Phaser
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,
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

// Inicialização do jogo
const game = new Phaser.Game(config);

// Carregamento das imagens e sprites
function preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('player', 'assets/alienigena.png');
    this.load.image('turbo_nave', 'assets/turbo.png');
    this.load.image('plataforma_tijolo', 'assets/tijolos.png');
    this.load.image('moeda', 'assets/moeda.png');
}

// Configuração do comportamento das imagens e sprites
function create() {
    // Configuração do background
    this.add.image(larguraJogo / 2, alturaJogo / 2, 'background');

    // Adicionando a visualização de fogo na nave do alien
    fogo = this.add.sprite(0, 0, 'turbo_nave');
    fogo.setVisible(false);

    // Criação do sprite com física para o alien
    alien = this.physics.add.sprite(larguraJogo / 2, 0, 'player');
    alien.setCollideWorldBounds(true);
    alien.body.setSize(116, 100, true);
    teclado = this.input.keyboard.createCursorKeys();

    // Configurando o chão do background
    this.physics.world.setBounds(0, 0, larguraJogo, alturaJogo - 90);

    // Inicialização da lista de plataformas
    var plataformas = [];

    // Adicionando as plataformas à lista
    plataformas.push(this.physics.add.staticImage(larguraJogo / 2, alturaJogo / 2, 'plataforma_tijolo'));
    plataformas.push(this.physics.add.staticImage(100, 600, 'plataforma_tijolo'));

    // Adicionando a colisão entre o alien e as plataformas usando um loop for...of
    for (const plataforma of plataformas) {
        // Adiciona um colisor entre o alien e a plataforma atual
        this.physics.add.collider(alien, plataforma);
    }

    // Adição da moeda com sua física e colisão com as plataformas
    moeda = this.physics.add.sprite(larguraJogo / 2, 0, 'moeda');
    moeda.setCollideWorldBounds(true);
    moeda.setBounce(0.5);
    this.physics.add.collider(moeda, plataformas);

    // Adição do placar
    placar = this.add.text(100, 100, 'Moedas: ' + pontuacao, { fontSize: '45px', fill: '#495613' });

    // Responsividade do placar após o alien coletar uma moeda
    this.physics.add.overlap(alien, moeda, function () {
        moeda.setVisible(false);
        var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
        moeda.setPosition(posicaoMoeda_Y, 450);
        pontuacao += 1;
        placar.setText('Moedas: ' + pontuacao);
        moeda.setVisible(true);
    });
}

// Movimentos e atualizações dentro do jogo
function update() {
    if (teclado.left.isDown) {
        alien.setVelocityX(-150);
    } else if (teclado.right.isDown) {
        alien.setVelocityX(150);
    } else {
        alien.setVelocityX(0);
    }

    if (teclado.up.isDown) {
        alien.setVelocityY(-400);
        ativarTurbo();
    } else {
        semTurbo();
    }
    fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

// Função para ativar o fogo
function ativarTurbo() {
    fogo.setVisible(true);
}

// Função para desativar o fogo
function semTurbo() {
    fogo.setVisible(false);
}
