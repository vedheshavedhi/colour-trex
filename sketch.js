var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage, cloud, cloudImages, obstacle, obstacleImages1, obstacleImages2, obstacleImages3, obstacleImages4, obstacleImages5, obstacleImages6;

var GroupClouds, GroupObstacles;

var gameOver, gameOverImage, restart, restartImage;

var die, jump, check;

var sun,sunAnimation;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var cloudImage;
var score = 0;

var sec = 0;

var min;
var remainsec;

localStorage["HighestScore"]=0;

function preload(){
  trex_running = loadAnimation("Sprites/trex_1.png","Sprites/trex_2.png","Sprites/trex_3.png");
  
  trex_collided = loadImage("Sprites/trex_collided.png");
  
  groundImage = loadImage("Sprites/ground.png")
  
  cloudImages = loadImage("Sprites/cloud.png");
  
  obstacleImages1 = loadImage("Sprites/obstacle1.png");
  
  obstacleImages2 = loadImage("Sprites/obstacle2.png");
  
  obstacleImages3 = loadImage("Sprites/obstacle3.png");
  
  obstacleImages4 = loadImage("Sprites/obstacle4.png");
  
  gameOverImage = loadImage("Sprites/gameOver.png");

  sunAnimation = loadImage("Sprites/sun.png");
  
  restartImage = loadImage("Sprites/restart.png");
  
  die = loadSound("Assets/die.mp3");
  
  jump = loadSound("Assets/jump.mp3");
  
  check = loadSound("Assets/checkPoint.mp3");

  cloudImage = loadImage("sprites/cloud.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.1;
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.6;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.1;
  restart.visible = false;
  
  GroupClouds = new Group();
  GroupObstacles = new Group();
}

function draw() {
  background("white");
  
  if(gameState === PLAY){
    
    ground.velocityX = -(2+ Math.round(score/100));
    
  if(keyDown("space") && trex.y > 161) {
    trex.velocityY = -12;
    jump.play();
  }

  // console.log(trex.y);
  
  trex.velocityY = trex.velocityY + 0.8;

  //camera
  camera.position.x=trex.x+200;
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  SpawnClouds();
  spawnObstacles();
    
    score = score + Math.round(getFrameRate()/60);

    sec++;

    min = Math.floor(sec/60);
    remainsec = sec - min * 60;

    text("Time: " + min + " min " + remainsec + " sec",400,50);
    
    if(score > 0 && score % 100 === 0){
      check.play();
    }
    
    if(GroupObstacles.isTouching(trex)){
         die.play();
         gameState = END;
       }
    
  } else if(gameState === END){
    GroupObstacles.setVelocityXEach(0);
    GroupClouds.setVelocityXEach(0);
    trex.changeAnimation("collided", trex_collided);
    ground.velocityX=0;
    trex.velocityY=0;
    GroupObstacles.setLifetimeEach(-1);
    GroupClouds.setLifetimeEach(-1);

    min = Math.floor(sec/60);
    remainsec = sec - min * 60;

    
    text("Time: " + min + " min " + remainsec + " sec",400,50);

    gameOver.visible = true;
    restart.visible = true;
  } 
  
  trex.collide(invisibleGround);
  
    if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"]=score;
  }

  // var d = new Date();
  // var min = d.getMinutes();
  
  text("Score: " +score, 300,50);
  text("High Score: "+localStorage["HighestScore"],200,50);
  
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
  
}

function reset() {
   
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  GroupObstacles.setLifetimeEach(0);    
  GroupClouds.setLifetimeEach(0);  
  
  trex.changeAnimation("running", trex_running);
  
  // console.log(localStorage["HighestScore"]);
  
  score = 0;
  sec = 0; 
}

function SpawnClouds(){
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    GroupClouds.add(cloud);
  }
}
  
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    
    switch(rand){
      case 1: obstacle.addImage("Sprites/obstacle1", obstacleImages1);
        break;
        
      case 2: obstacle.addImage("Sprites/obstacle2",obstacleImages2);
        break;
        
      case 3: obstacle.addImage("Sprites/obstacle3",obstacleImages3);
        break;
        
      case 4: obstacle.addImage("Sprites/obstacle4",obstacleImages4);
        break;
        
      case 5: obstacle.addImage("Sprites/obstacle5",obstacleImages5);
        break;
        
      case 6: obstacle.addImage("Sprites/obstacle6",obstacleImages6);
        break;
        
      default: break; 
    }
    
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;

    
    GroupObstacles.add(obstacle);
  }
}

  
