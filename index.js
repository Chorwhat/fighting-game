const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite ({
    position: {
        x: 0,
        y:0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite ({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})



const player = new Fighter({
    position: {
        x:0,
        y:0,  
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 75,
            y: 40
        },
        width: 175,
        height: 50
    }

});
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0.
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0
    },imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 50
        },
        width: 130,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}
let lastKey


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0,0,canvas.width,canvas.height)

    background.update();
    shop.update();
    player.update()
    enemy.update()


    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    
   
    
    if(keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }else if (keys.d.pressed && lastKey=== 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy movement
    
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey=== 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else{
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect if players attackbox is overlapping enemy
    if (
        rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

     //detect if enemy attackbox is overlapping player
     if (
        rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.takeHit()
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){

        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if(!player.dead){

    
    
    
    switch (event.key){
        
        //Player Movement
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;   
        case 'w':
            player.velocity.y = -20
            break;
        case ' ':
            player.attack()
            break;
    }
}
        //Enemy Movement
    if(!enemy.dead){
    
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;   
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowDown':
            enemy.attack()
            break;

    }
}})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        //player movement
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;  
        case 'w':
            keys.w.pressed = false
            break;   
            
        //enemy movement    
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;  
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break;           
    }
})