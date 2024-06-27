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
            debug: false
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
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space4.png');
    this.load.svg('platform', 'graham-cracker-platform.svg');
    this.load.svg('hero', 'pink-puppy-squishmallow.svg');
    this.load.svg('villain', 'hot-cocoa-villain.svg');
    this.load.image('candy', 'https://labs.phaser.io/assets/sprites/star.png');
}

function create() {
    currentScene = this;
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    // Create main ground
    createPlatform(400, 568, 8, 1);
    
    // Create other platforms
    createPlatform(100, 400, 4, 1);  // Left platform
    createPlatform(600, 350, 4, 1);  // Right platform
    createPlatform(300, 100, 3, 1);  // Top center platform

    player = this.physics.add.sprite(100, 450, 'hero');
    player.setDisplaySize(60, 60);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(50, 50); // Adjust collision box
    player.body.setOffset(5, 10); // Fine-tune collision box position
    player.originalScale = { x: player.scaleX, y: player.scaleY };
    player.depth = 1; // Ensure player is drawn above platforms

    hotCocoaVillain = this.physics.add.sprite(700, 100, 'villain');
    hotCocoaVillain.setDisplaySize(80, 100);
    hotCocoaVillain.setBounce(1);
    hotCocoaVillain.setCollideWorldBounds(true);
    hotCocoaVillain.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    hotCocoaVillain.depth = 1; // Ensure villain is drawn above platforms

    cursors = this.input.keyboard.createCursorKeys();

    candies = this.physics.add.group({
        key: 'candy',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    candies.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setDisplaySize(30, 30);
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(hotCocoaVillain, platforms);
    this.physics.add.collider(candies, platforms);

    this.physics.add.overlap(player, candies, collectCandy, null, this);
    this.physics.add.collider(player, hotCocoaVillain, hitVillain, null, this);

    createTouchControls(this);
}

function update() {
    if (gameOver) {
        return;
    }

    const onGround = player.body.touching.down;

    if (cursors.left.isDown || (touchControls && touchControls.left.isDown)) {
        player.setVelocityX(-160);
        player.setFlipX(true);
        if (onGround) animateWalk(player);
    } else if (cursors.right.isDown || (touchControls && touchControls.right.isDown)) {
        player.setVelocityX(160);
        player.setFlipX(false);
        if (onGround) animateWalk(player);
    } else {
        player.setVelocityX(0);
        if (onGround) resetAnimation(player);
    }

    if ((cursors.up.isDown || (touchControls && touchControls.up.isDown)) && onGround) {
        player.setVelocityY(-330);
        animateJump(player);
    }

    if (!onGround && player.body.velocity.y > 0) {
        animateFall(player);
    }

    animateVillain(hotCocoaVillain);

    if (Math.random() < 0.02) {
        createCocoaDrip(hotCocoaVillain);
    }
}

function createPlatform(x, y, scaleX, scaleY) {
    let platform = platforms.create(x, y, 'platform');
    platform.setScale(scaleX, scaleY);
    platform.refreshBody();
    platform.depth = 0; // Ensure platforms are drawn behind characters
}

function animateWalk(sprite) {
    const walkCycleSpeed = 200;
    const walkAmplitude = 0.05;
    sprite.scaleY = sprite.originalScale.y * (1 + Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude);
    sprite.scaleX = sprite.originalScale.x * (1 - Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude);
}

function animateJump(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleY: sprite.originalScale.y * 1.2,
        scaleX: sprite.originalScale.x * 0.8,
        duration: 200,
        yoyo: true
    });
}

function animateFall(sprite) {
    sprite.scaleY = sprite.originalScale.y * 0.8;
    sprite.scaleX = sprite.originalScale.x * 1.2;
}

function resetAnimation(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleX: sprite.originalScale.x,
        scaleY: sprite.originalScale.y,
        duration: 100
    });
}

function animateVillain(villain) {
    const glowIntensity = 0.5 + Math.sin(Date.now() / 300) * 0.5;
    villain.setTint(Phaser.Display.Color.GetColor(255, glowIntensity * 255, glowIntensity * 255));
    
    if (Math.abs(villain.body.velocity.x) < 50 || Math.abs(villain.body.velocity.y) < 50) {
        villain.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(-200, 200)
        );
    }

    // Wobble animation
    villain.angle = Math.sin(Date.now() / 200) * 5;
}

function createCocoaDrip(villain) {
    const drip = currentScene.add.circle(
        villain.x,
        villain.y + villain.height / 2,
        5,
        0x3C1808
    );
    currentScene.physics.add.existing(drip);
    drip.body.setVelocityY(100);
    currentScene.physics.add.collider(drip, platforms, (drip) => {
        drip.destroy();
    });

    currentScene.tweens.add({
        targets: drip,
        scaleX: 0.5,
        scaleY: 1.5,
        duration: 300,
        yoyo: true,
        repeat: -1
    });
}

function collectCandy(player, candy) {
    candy.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (candies.countActive(true) === 0) {
        candies.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const villainCopy = currentScene.physics.add.sprite(x, 16, 'villain');
        villainCopy.setDisplaySize(80, 100);
        villainCopy.setBounce(1);
        villainCopy.setCollideWorldBounds(true);
        villainCopy.setVelocity(Phaser.Math.Between(-200, 200), 20);

        currentScene.physics.add.collider(villainCopy, platforms);
        currentScene.physics.add.collider(player, villainCopy, hitVillain, null, this);
    }
}

function hitVillain(player, villain) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' }).setOrigin(0.5);
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