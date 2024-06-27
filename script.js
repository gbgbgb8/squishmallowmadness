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
let hotCocoaVillain;
let villagers;
let currentScene;
let score = 0;
let scoreText;
let gameOver = false;
let jumpButton;

function preload() {
    this.load.image('sky', 'background01.png');
    this.load.svg('platform', 'graham-cracker-platform.svg');
    this.load.svg('hero', 'pink-puppy-squishmallow.svg');
    this.load.svg('villain', 'hot-cocoa-villain.svg');
    this.load.svg('villager', 'marshmallow-villager.svg');
}

function create() {
    currentScene = this;
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    createPlatform(400, 568, 8, 1);
    createPlatform(100, 400, 4, 1);
    createPlatform(600, 300, 4, 1);
    createPlatform(200, 150, 3, 1);

    player = this.physics.add.sprite(100, 450, 'hero');
    player.setDisplaySize(60, 60);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(50, 50);
    player.body.setOffset(5, 10);
    player.originalScale = { x: player.scaleX, y: player.scaleY };
    player.depth = 1;
    player.alpha = 0.9;
    player.isJumping = false;
    player.isFalling = false;

    hotCocoaVillain = this.physics.add.sprite(700, 100, 'villain');
    hotCocoaVillain.setDisplaySize(80, 100);
    hotCocoaVillain.setBounce(1);
    hotCocoaVillain.setCollideWorldBounds(true);
    hotCocoaVillain.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    hotCocoaVillain.depth = 1;
    hotCocoaVillain.originalScale = { x: hotCocoaVillain.scaleX, y: hotCocoaVillain.scaleY };

    villagers = this.physics.add.group();
    for (let i = 0; i < 12; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const villager = villagers.create(x, y, 'villager');
        villager.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        villager.setDisplaySize(40, 40);
        villager.depth = 1;
        villager.alpha = 0.9;
        villager.originalScale = { x: villager.scaleX, y: villager.scaleY };
    }

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(hotCocoaVillain, platforms);
    this.physics.add.collider(villagers, platforms);

    this.physics.add.overlap(player, villagers, rescueVillager, null, this);
    this.physics.add.collider(player, hotCocoaVillain, hitVillain, null, this);

    jumpButton = this.add.circle(700, 500, 30, 0x4a4a4a);
    jumpButton.setInteractive();
    jumpButton.on('pointerdown', function() {
        if (player.body.touching.down) {
            player.setVelocityY(-330);
            player.isJumping = true;
            player.isFalling = false;
            animateJump(player);
        }
    });

    this.input.on('pointerdown', startDragging, this);
    this.input.on('pointermove', doDrag, this);
    this.input.on('pointerup', stopDragging, this);
}

function update() {
    if (gameOver) return;

    const onGround = player.body.touching.down;

    if (player.body.velocity.x !== 0) {
        player.setFlipX(player.body.velocity.x < 0);
        if (onGround) animateWalk(player);
    } else {
        if (onGround) resetAnimation(player);
    }

    if (player.isJumping && player.body.velocity.y >= 0) {
        player.isJumping = false;
        player.isFalling = true;
    }

    if (player.isFalling && onGround) {
        player.isFalling = false;
        animateLand(player);
    }

    if (!onGround && player.body.velocity.y > 0 && !player.isFalling) {
        player.isFalling = true;
        animateFall(player);
    }

    animateVillain(hotCocoaVillain);
    animateVillagers();

    if (Math.random() < 0.02) {
        createCocoaDrip(hotCocoaVillain);
    }
}

function startDragging(pointer) {
    this.input.off('pointerdown', startDragging, this);
    this.dragStartX = pointer.x;
}

function doDrag(pointer) {
    if (typeof this.dragStartX !== 'undefined') {
        const dragDistanceX = pointer.x - this.dragStartX;
        player.setVelocityX(dragDistanceX * 2);
    }
}

function stopDragging(pointer) {
    player.setVelocityX(0);
    delete this.dragStartX;
    this.input.on('pointerdown', startDragging, this);
    resetAnimation(player);
}

function createPlatform(x, y, scaleX, scaleY) {
    let platform = platforms.create(x, y, 'platform');
    platform.setScale(scaleX, scaleY);
    platform.refreshBody();
    platform.depth = 0;
    platform.alpha = 0.9;
}

function animateWalk(sprite) {
    const walkCycleSpeed = 200;
    const walkAmplitude = 0.1;
    sprite.scaleY = sprite.originalScale.y * (1 + Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude);
    sprite.scaleX = sprite.originalScale.x * (1 - Math.sin(Date.now() / walkCycleSpeed) * walkAmplitude / 2);
    
    // Add a slight bounce
    sprite.y = sprite.y + Math.sin(Date.now() / 100) * 1;
}

function animateJump(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleY: sprite.originalScale.y * 1.3,
        scaleX: sprite.originalScale.x * 0.7,
        duration: 300,
        ease: 'Quad.easeOut',
        yoyo: true,
        onComplete: () => {
            sprite.setScale(sprite.originalScale.x, sprite.originalScale.y);
        }
    });
}

function animateFall(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleY: sprite.originalScale.y * 0.8,
        scaleX: sprite.originalScale.x * 1.2,
        duration: 300,
        ease: 'Quad.easeIn'
    });
}

function animateLand(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleY: sprite.originalScale.y * 0.6,
        scaleX: sprite.originalScale.x * 1.4,
        duration: 100,
        ease: 'Bounce.easeOut',
        yoyo: true,
        onComplete: () => {
            sprite.setScale(sprite.originalScale.x, sprite.originalScale.y);
        }
    });
}

function resetAnimation(sprite) {
    currentScene.tweens.add({
        targets: sprite,
        scaleX: sprite.originalScale.x,
        scaleY: sprite.originalScale.y,
        duration: 200,
        ease: 'Quad.easeOut'
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

    villain.angle = Math.sin(Date.now() / 200) * 10;
    villain.scaleX = villain.originalScale.x + Math.sin(Date.now() / 150) * 0.1;
    villain.scaleY = villain.originalScale.y - Math.sin(Date.now() / 150) * 0.1;
}

function animateVillagers() {
    villagers.children.entries.forEach((villager) => {
        if (villager.active && villager.originalScale) {
            villager.angle = Math.sin(Date.now() / 200 + villager.x) * 10;
            const bounceHeight = Math.sin(Date.now() / 300 + villager.x) * 3;
            villager.y += bounceHeight - (villager.prevBounceHeight || 0);
            villager.prevBounceHeight = bounceHeight;
            
            const pulseScale = 1 + Math.sin(Date.now() / 400 + villager.x) * 0.1;
            villager.setScale(villager.originalScale.x * pulseScale, villager.originalScale.y * pulseScale);
        }
    });
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
        createSplash(drip.x, drip.y);
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

function createSplash(x, y) {
    const splash = currentScene.add.particles(x, y, 'villain', {
        scale: { start: 0.05, end: 0 },
        speed: { min: 30, max: 60 },
        angle: { min: 0, max: 360 },
        lifespan: 500,
        blendMode: 'ADD',
        frequency: 20,
        maxParticles: 10
    });

    currentScene.time.delayedCall(500, () => {
        splash.destroy();
    });
}

function rescueVillager(player, villager) {
    villager.disableBody(true, true);
    score += 50;
    scoreText.setText('Score: ' + score);

    const rescueEffect = currentScene.add.particles(villager.x, villager.y, 'villager', {
        scale: { start: 0.5, end: 0 },
        speed: { min: 50, max: 100 },
        angle: { min: 0, max: 360 },
        lifespan: 1000,
        blendMode: 'ADD',
        frequency: 25,
        maxParticles: 20
    });

    currentScene.time.delayedCall(1000, () => {
        rescueEffect.destroy();
    });

    if (villagers.countActive(true) === 0) {
        villagers.children.entries.forEach((v) => {
            v.enableBody(true, v.x, 0, true, true);
        });

        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const villainCopy = currentScene.physics.add.sprite(x, 16, 'villain');
        villainCopy.setDisplaySize(80, 100);
        villainCopy.setBounce(1);
        villainCopy.setCollideWorldBounds(true);
        villainCopy.setVelocity(Phaser.Math.Between(-200, 200), 20);
        villainCopy.originalScale = { x: villainCopy.scaleX, y: villainCopy.scaleY };

        currentScene.physics.add.collider(villainCopy, platforms);
        currentScene.physics.add.collider(player, villainCopy, hitVillain, null, this);
    }
}

function hitVillain(player, villain) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;

    const gameOverText = this.add.text(400, 300, 'Game Over', { 
        fontSize: '64px', 
        fill: '#000',
        stroke: '#fff',
        strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
        targets: gameOverText,
        scale: 1.1,
        duration: 1000,
        yoyo: true,
        repeat: -1
    });
}