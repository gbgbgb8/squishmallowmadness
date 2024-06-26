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

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
}

function create() {
    // Add a silly background
    this.add.image(400, 300, 'sky');

    // Create platforms group
    platforms = this.physics.add.staticGroup();

    // Create graham cracker platforms
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Create the squishmallow player
    player = this.add.circle(100, 450, 30, 0xffafcc);
    this.physics.add.existing(player);
    player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(true);

    // Create the hot cocoa villain
    hotCocoaVillain = this.add.rectangle(700, 100, 60, 80, 0x6f4e37);
    this.physics.add.existing(hotCocoaVillain);
    hotCocoaVillain.body.setBounce(1);
    hotCocoaVillain.body.setCollideWorldBounds(true);
    hotCocoaVillain.body.setVelocity(Phaser.Math.Between(-200, 200), 20);

    // Collider for player and platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(hotCocoaVillain, platforms);

    // Player input
    cursors = this.input.keyboard.createCursorKeys();

    // Add some marshmallow villagers
    for (let i = 0; i < 12; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const villager = this.add.circle(x, y, 10, 0xffffff);
        this.physics.add.existing(villager);
        villager.body.setBounce(0.8);
        villager.body.setCollideWorldBounds(true);
        this.physics.add.collider(villager, platforms);
    }

    // Add some candy cane power-ups
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
    // Player movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
        player.angle -= 5;  // Make the player roll!
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
        player.angle += 5;  // Make the player roll!
    } else {
        player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
        // Squish the player when jumping
        player.scaleY = 0.8;
        player.scaleX = 1.2;
        this.time.delayedCall(200, () => {
            player.scaleY = 1;
            player.scaleX = 1;
        });
    }

    // Make the hot cocoa villain wobble
    hotCocoaVillain.angle = Math.sin(this.time.now / 200) * 15;

    // Drip "cocoa" from the villain
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