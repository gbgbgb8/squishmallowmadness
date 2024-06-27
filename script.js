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
let currentScene;

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.svg('hero', 'pink-puppy-squishmallow.svg');
    this.load.svg('villain', 'hot-cocoa-villain.svg');
}

function create() {
    currentScene = this;
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    // Create main ground
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    // Create other platforms
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Create player using SVG
    player = this.add.image(100, 450, 'hero');
    player.setDisplaySize(60, 60);
    this.physics.add.existing(player);
    player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(true);

    // Store original scale for animations
    player.originalScale = { x: player.scaleX, y: player.scaleY };
    player.isJumping = false;
    player.isFalling = false;

    // Create villain using SVG
    hotCocoaVillain = this.add.image(700, 100, 'villain');
    hotCocoaVillain.setDisplaySize(80, 100);
    this.physics.add.existing(hotCocoaVillain);
    hotCocoaVillain.body.setBounce(1);
    hotCocoaVillain.body.setCollideWorldBounds(true);
    hotCocoaVillain.body.setVelocity(Phaser.Math.Between(-200, 200), 20);

    // Add a slight wobble animation to the villain
    this.tweens.add({
        targets: hotCocoaVillain,
        angle: { from: -5, to: 5 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

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
        player.body.setVelocityX(-160);
        player.setFlipX(true);
        if (onGround) animateWalk();
    } else if (cursors.right.isDown || (touchControls && touchControls.right.isDown)) {
        player.body.setVelocityX(160);
        player.setFlipX(false);
        if (onGround) animateWalk();
    } else {
        player.body.setVelocityX(0);
        if (onGround) resetAnimation();
    }

    if ((cursors.up.isDown || (touchControls && touchControls.up.isDown)) && onGround) {
        player.body.setVelocityY(-330);
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

    // Villain animation
    animateVillain();

    if (Math.random() < 0.02) {
        createCocoaDrip();
    }
}

function animateWalk() {
    const walkCycleSpeed = 200;
    const walkAmplitude = 0.05;
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

function animateVillain() {
    // Make the villain's eyes glow
    const glowIntensity = 0.5 + Math.sin(Date.now() / 300) * 0.5;
    hotCocoaVillain.setTint(Phaser.Display.Color.GetColor(255, glowIntensity * 255, glowIntensity * 255));

    // Make the villain bob up and down slightly
    hotCocoaVillain.y = hotCocoaVillain.body.y + Math.sin(Date.now() / 500) * 5;
}

function createCocoaDrip() {
    const drip = currentScene.add.circle(
        hotCocoaVillain.x + Phaser.Math.Between(-20, 20),
        hotCocoaVillain.y + 40,
        5,
        0x3C1808
    );
    currentScene.physics.add.existing(drip);
    drip.body.setVelocityY(100);
    currentScene.physics.add.collider(drip, platforms, (drip) => {
        drip.destroy();
    });

    // Add a tween to make the drip stretch as it falls
    currentScene.tweens.add({
        targets: drip,
        scaleX: 0.5,
        scaleY: 1.5,
        duration: 300,
        yoyo: true,
        repeat: -1
    });
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