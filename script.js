console.log('Phaser version:', Phaser.VERSION);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Set to true to see physics bodies when needed
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;
let hotCocoaVillain;
let touchControls;

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.svg('hero', 'pink-puppy-squishmallow.svg');
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    // Create main ground
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    // Create other platforms
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Create player using SVG
    player = this.physics.add.sprite(100, 450, 'hero');
    player.setDisplaySize(60, 60);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Store original scale for animations
    player.originalScale = { x: player.scaleX, y: player.scaleY };
    player.isJumping = false;
    player.isFalling = false;

    hotCocoaVillain = this.add.rectangle(700, 100, 60, 80, 0x6f4e37);
    this.physics.add.existing(hotCocoaVillain);
    hotCocoaVillain.body.setBounce(1);
    hotCocoaVillain.body.setCollideWorldBounds(true);
    hotCocoaVillain.body.setVelocity(Phaser.Math.Between(-200, 200), 20);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(hotCocoaVillain, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    createTouchControls(this);

    for (let i = 0; i < 12; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const villager = this.add.circle(x, y, 10, 0xffffff);
        this.physics.add.existing(villager);
        villager.body.setBounce(0.8);
        villager.body.setCollideWorldBounds(true);
        this.physics.add.collider(villager, platforms);
    }

    for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const candyCane = this.add.rectangle(x, y, 10, 30, 0xff0000);
        this.physics.add.existing(candyCane);
        candyCane.body.setBounce(0.8);
        candyCane.body.setCollideWorldBounds(true);
        this.physics.add.collider(candyCane, platforms);
    }
}

function update() {
    const onGround = player.body.touching.down;

    if (cursors.left.isDown || (touchControls && touchControls.left.isDown)) {
        player.setVelocityX(-160);
        player.setFlipX(true);
        if (onGround) animateWalk();
    } else if (cursors.right.isDown || (touchControls && touchControls.right.isDown)) {
        player.setVelocityX(160);
        player.setFlipX(false);
        if (onGround) animateWalk();
    } else {
        player.setVelocityX(0);
        if (onGround) resetAnimation();
    }

    if ((cursors.up.isDown || (touchControls && touchControls.up.isDown)) && onGround) {
        player.setVelocityY(-330);
        player.isJumping = true;
        player.isFalling = false;
    }

    if (player.isJumping && player.body.velocity.y >= 0) {
        player.isJumping = false;
        player.isFalling = true;
    }

    if (player.isJumping) {
        animateJump();
    } else if (player.isFalling) {
        animateFall();
    }

    if (onGround) {
        player.isFalling = false;
    }

    hotCocoaVillain.angle = Math.sin(this.time.now / 200) * 15;

    if (Math.random() < 0.02) {
        const drip = this.add.circle(
            hotCocoaVillain.x + Phaser.Math.Between(-20, 20),
            hotCocoaVillain.y + 40,
            5,
            0x6f4e37
        );
        this.physics.add.existing(drip);
        this.physics.add.collider(drip, platforms, (drip) => {
            drip.destroy();
        });
    }
}

function animateWalk() {
    const walkCycleSpeed = 200; // Adjust this value to change the walking animation speed
    const walkAmplitude = 0.05; // Adjust this value to change the intensity of the squash and stretch
    player.scaleY = player.originalScale.y * (1 + Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude);
    player.scaleX = player.originalScale.x * (1 - Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude);
}

function animateJump() {
    player.scaleY = player.originalScale.y * 1.2;
    player.scaleX = player.originalScale.x * 0.8;
}

function animateFall() {
    player.scaleY = player.originalScale.y * 0.8;
    player.scaleX = player.originalScale.x * 1.2;
}

function resetAnimation() {
    player.setScale(player.originalScale.x, player.originalScale.y);
}

function createTouchControls(scene) {
    touchControls = {
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: false }
    };

    const buttonStyle = {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#4a4a4a',
        padding: {
            x: 10,
            y: 10
        }
    };

    const leftButton = scene.add.text(50, 550, '<', buttonStyle).setInteractive();
    const rightButton = scene.add.text(150, 550, '>', buttonStyle).setInteractive();
    const jumpButton = scene.add.text(100, 500, '^', buttonStyle).setInteractive();

    leftButton.on('pointerdown', () => touchControls.left.isDown = true);
    leftButton.on('pointerup', () => touchControls.left.isDown = false);
    leftButton.on('pointerout', () => touchControls.left.isDown = false);

    rightButton.on('pointerdown', () => touchControls.right.isDown = true);
    rightButton.on('pointerup', () => touchControls.right.isDown = false);
    rightButton.on('pointerout', () => touchControls.right.isDown = false);

    jumpButton.on('pointerdown', () => touchControls.up.isDown = true);
    jumpButton.on('pointerup', () => touchControls.up.isDown = false);
    jumpButton.on('pointerout', () => touchControls.up.isDown = false);
}