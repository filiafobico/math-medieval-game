// Intro scene for Matemática Medieval
// Welcome screen and game introduction

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.gameController = null;
    }

    preload() {
        this.load.image('feiticeiro_portrait', 'assets/feiticeiro_portrait.jpeg');
        this.load.image('guardiao_portrait', 'assets/guardiao_portrait.jpeg');
        this.load.image('homens_portrait', 'assets/homens_portrait.jpeg');
        this.load.image('marek_portrait', 'assets/marek_portrait.jpeg');
        this.load.image('mercador_portrait', 'assets/mercador_portrait.jpeg');
        this.load.image('sabio_portrait', 'assets/sabio_portrait.jpeg');
        this.load.image('viajante_portrait', 'assets/viajante_portrait.jpeg');
        this.load.image('aventureiro_portrait', 'assets/aventureiro_portrait.jpeg');
        this.load.image('lorenzo_portrait', 'assets/lorenzo_portrait.jpeg');
        this.load.image('donzela_portrait', 'assets/donzela_portrait.jpeg');
        this.load.image('astronomo_portrait', 'assets/astronomo_portrait.jpeg');
        this.load.image('cocheiro_portrait', 'assets/cocheiro_portrait.jpeg');
        this.load.image('caçador_portrait', 'assets/cacador_portrait.jpeg');
        this.load.image('lebre_portrait', 'assets/lebre_portrait.jpeg');
        this.load.image('prisioneiros_portrait', 'assets/prisioneiros_portrait.jpeg');
        this.load.image('narrador_portrait', 'assets/narrador_portrait.jpeg');

        // Load background images
        this.load.image('level_1_bg', 'assets/level_1_bg.jpeg');
        this.load.image('level_2_bg', 'assets/level_2_bg.jpeg');
        this.load.image('level_3_bg', 'assets/level_3_bg.jpeg');
        this.load.image('level_4_bg', 'assets/level_4_bg.jpeg');
        this.load.image('level_5_bg', 'assets/level_5_bg.jpeg');
        this.load.image('level_6_bg', 'assets/level_6_bg.jpeg');
        this.load.image('level_7_bg', 'assets/level_7_bg.jpeg');
        this.load.image('level_8_bg', 'assets/level_8_bg.jpeg');
        this.load.image('level_9_bg', 'assets/level_9_bg.jpeg');
        this.load.image('level_10_bg', 'assets/level_10_bg.jpeg');

        // Hints shown alongside the free-response fields for levels 5 to 7
        this.load.image('dica_5', 'assets/dica_5.jpeg');
        this.load.image('dica_6', 'assets/dica_6.jpeg');
        this.load.image('dica_7', 'assets/dica_7.jpeg');

        // Load result background images
        this.load.image('success', 'assets/success.jpeg');
        this.load.image('error', 'assets/error.jpeg');

        // Load initial screen image
        this.load.image('init-screen', 'assets/init.jpeg');

        // Load placeholder assets as fallback
        this.loadPlaceholderAssets();
    }

    create() {
        // Get game controller reference
        this.gameController = this.registry.get('gameController');

        // Create background
        this.createBackground();

        // Create UI elements
        this.createIntroUI();

        // Load game data
        this.loadGameData();
    }

    // Create simple assets using graphics instead of complex SVG
    loadPlaceholderAssets() {
        // Create textures using graphics instead of SVG
        const graphics = this.add.graphics();

        // Create logo texture programmatically
        graphics.fillStyle(0x8b4513, 1);
        graphics.fillRect(0, 0, 200, 100);
        graphics.generateTexture('logo', 200, 100);
        graphics.destroy();
    }

    // Create background with initial screen image
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Use the initial screen image as background
        try {
            const bgImage = this.add.image(width / 2, height / 2, 'init-screen');
            bgImage.setDisplaySize(width, height);
        } catch (error) {
            console.warn('⚠️ Fallback para background programático:', error);

            // Fallback to gradient background
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x8B4513, 0x8B4513, 0xD2691E, 0xD2691E, 1);
            graphics.fillRect(0, 0, width, height);
        }
    }

    // Create visible intro buttons over the background image
    createIntroUI() {
        const { width, height } = this.sys.game.config;
        const buttonWidth = 300;
        const buttonHeight = 58;
        const buttonX = (width - buttonWidth) / 2;

        const createButton = (label, y, onClick) => {
            const button = this.add.graphics();
            const drawButton = (hovered = false) => {
                button.clear();
                button.fillStyle(hovered ? 0x704214 : 0x2c1810, 0.92);
                button.lineStyle(hovered ? 3 : 2, GameConfig.COLORS.SECONDARY, 1);
                button.fillRoundedRect(buttonX, y, buttonWidth, buttonHeight, 12);
                button.strokeRoundedRect(buttonX, y, buttonWidth, buttonHeight, 12);
            };

            drawButton();
            button.setInteractive(
                new Phaser.Geom.Rectangle(buttonX, y, buttonWidth, buttonHeight),
                Phaser.Geom.Rectangle.Contains
            );

            this.add.text(width / 2, y + buttonHeight / 2, label, {
                fontSize: '22px',
                fill: '#ffffff',
                fontFamily: 'Arial, serif',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);

            button.on('pointerover', () => {
                this.input.setDefaultCursor('pointer');
                drawButton(true);
            });
            button.on('pointerout', () => {
                this.input.setDefaultCursor('default');
                drawButton();
            });
            button.on('pointerdown', onClick);
        };

        createButton('Iniciar jogo', height - 150, () => this.startGame());
        createButton('Créditos', height - 78, () => {
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        });
    }

    // Load game data asynchronously
    async loadGameData() {
        try {
            if (this.gameController && this.gameController.loadGameData) {
                await this.gameController.loadGameData();
            } else {
                // GameController not available - using default data
            }
        } catch (error) {
            console.warn('Aviso: Erro ao carregar dados (continuando com fallback):', error);
            // Game will use fallback data - don't crash
        }
    }

    // Start the game - transition to level select
    startGame() {
        // Fade out animation
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('LevelSelectScene');
        });
    }
}
