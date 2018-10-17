"use strict"

//Hide scrollBars
document.documentElement.style.overflow = "hidden";

//Launch game
var game = function (ph) {

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //Save Recovery

    var currentSave = localStorage.getItem('save');

    var save = JSON.parse(currentSave);

    var stringSave = JSON.stringify(save);
    localStorage.setItem('save', stringSave);
    var JSONSave = JSON.parse(localStorage.getItem('save'));


    //Level Management
    var phase = ph;
    if (phase == 1)
    {    
        var nbE = 11;
        var eSpeedX = 0.004;
        var eSpeedY = 0.3;
    }
    else if (phase == 2)
    {    
        var nbE = 22;
        var eSpeedX = 0.0045;
        var eSpeedY = 0.32;
    }
    else if (phase == 3)
    {    
        var nbE = 33;
        var eSpeedX = 0.005;
        var eSpeedY = 0.34;
    }
    document.getElementById("level").style.color = "lightgreen";
    document.getElementById("level").style.fontFamily = "Impact,Charcoal,sans-serif"; 
    document.getElementById("level").style.fontSize = "xx-large";
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.FontLoader(manager);

    manager.onError = function(url){
        console.log(url);
    }
    
    //skybox
    var geometrySkyBox = new THREE.BoxGeometry( 1250 , 1250, 1250);
    var materialSkyBox = 
    [
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_ft.png" ), side: THREE.BackSide} ),
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_bk.png" ), side: THREE.BackSide} ),
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_up.png" ), side: THREE.BackSide} ),
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_dn.png" ), side: THREE.BackSide} ),
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_rt.png" ), side: THREE.BackSide} ),
        new THREE.MeshBasicMaterial( {map : new THREE.TextureLoader().load( "../medias/images/skyBox/mp_drakeq/drakeq_lf.png" ), side: THREE.BackSide} )
    ]
    var skyBox = new THREE.Mesh( geometrySkyBox, materialSkyBox );
    scene.add( skyBox );
    if (phase == 1)
    {    
        skyBox.rotation.y = 0;
    }
    else if (phase == 2)
    {    
        skyBox.rotation.y = -5;
    }
    else if (phase == 3)
    {    
        skyBox.rotation.y = 10;
    }

    //player
    playerMesh.scale.x = 0.25;
    playerMesh.scale.y = 0.25;
    playerMesh.scale.z = 0.25;
    var playerSpeedX = 0.33;

    var playerName = JSONSave.name;
    document.getElementById("nom").style.color = "lightgreen";
    document.getElementById("nom").style.fontFamily = "Impact,Charcoal,sans-serif"; 
    document.getElementById("nom").style.fontSize = "xx-large";
    
    var playerHp = 3;
    document.getElementById("vie").style.color = "lightgreen";
    document.getElementById("vie").style.fontFamily = "Impact,Charcoal,sans-serif"; 
    document.getElementById("vie").style.fontSize = "xx-large";
    
    var playerScore = 0;
    document.getElementById("score").style.color = "lightgreen";
    document.getElementById("score").style.fontFamily = "Impact,Charcoal,sans-serif"; 
    document.getElementById("score").style.fontSize = "xx-large";
    
    var limitPlayerPositionX = 20;
    playerMesh.name = "playerMesh";
    
    playerMesh.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    
    scene.add( playerMesh );
    
    //enemy
    var geometryEnemy = new THREE.BoxGeometry( 1, 1, 1 );
    var materialEnemy = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var nbEnemy = nbE;
    var enemyShooter;
    var enemySpeedX = eSpeedX;
    var enemySpeedY = eSpeedY;
    var goingRight = true;
    var purgeMode = false;
    var hitBoxSize = 0.75;
    var enemyMeshArray = {};
    var enemyDeadArray = {};
    var nbEnemyDead = 0;
    var oneEnemyBeingKilled = false;
    var row = 0;
    for (var i = 0; i < nbEnemy; i++)
    {
        enemyMeshArray[i] = enemyModel1[i];
        enemyMeshArray[i].scale.x = 0.25;
        enemyMeshArray[i].scale.y = 0.25;
        enemyMeshArray[i].scale.z = 0.25;
        
        enemyMeshArray[i].material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        enemyMeshArray[i].name = "enemyMesh"+ i;
        enemyDeadArray[i] = false;
        enemyMeshArray[i].position.x = -15 + ((i%11)*3);
        row = Math.trunc(i/11);

        switch(row){
            case 0:
                enemyMeshArray[i].position.y = 23;
                break;
            case 1:
                enemyMeshArray[i].position.y = 21;
                break;
            case 2:
                enemyMeshArray[i].position.y = 19;
                break;
            case 3:
                enemyMeshArray[i].position.y = 17;
                break;
            case 4:
                enemyMeshArray[i].position.y = 15;
                break;
        }

        scene.add( enemyMeshArray[i] );
    }
    
    //enemy bonus
    var enemyBonusSpeedX = 0.15;
    enemyMeshArray[nbEnemy] = enemyBonusModel;
    enemyMeshArray[nbEnemy].material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    enemyMeshArray[nbEnemy].scale.x = 0.2;
    enemyMeshArray[nbEnemy].scale.y = 0.2;
    enemyMeshArray[nbEnemy].scale.z = 0.2;
    
    enemyMeshArray[nbEnemy].name = "enemyMesh"+ nbEnemy;
    enemyMeshArray[nbEnemy].position.y = 25;
    enemyMeshArray[nbEnemy].position.x = -31;

    //tools
    var invincibilityMode = false;

    //MissilePlayer
    var geometryMissilePlayer = new THREE.BoxGeometry( 0.33, 0.33, 0.33 );
    var materialMissilePlayer = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var MissilePlayerMesh = new THREE.Mesh( geometryMissilePlayer, materialMissilePlayer );
    var missilePlayerSpeedY = 0.75;
    var limitMissilePlayerPositionY = 30;
    MissilePlayerMesh.name = "MissilePlayerMesh";
    var MissilePlayerShooted = false;

    //MissileEnemy
    var geometryMissileEnemy = new THREE.BoxGeometry( 0.33, 0.33, 0.33 );
    var materialMissileEnemy = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var MissileEnemyMesh = new THREE.Mesh( geometryMissileEnemy, materialMissileEnemy );
    var missileEnemySpeedY = 0.5;
    var limitMissileEnemyPositionY = -1;
    MissileEnemyMesh.name = "MissileEnemyMesh";
    var MissileEnemyShooted = false;
    
    //Shield
    var geometryShield = new THREE.BoxGeometry( 1, 1, 1 );
    var materialShield  = {};
    var shieldMeshArray0 = {};
    var shieldMeshArray1 = {};
    var shieldMeshArray2 = {};
    var shieldMeshArray3 = {};
    var shieldHpArray = {};
    for (var h = 0; h < 40; h++)
    {
        materialShield[h] = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
        shieldHpArray[h] = 4;
    }
    var megaShieldArray = {};
    for (var m = 0; m < 10; m++)
    {
        shieldMeshArray0[m] = new THREE.Mesh( geometryShield, materialShield[m]);
        shieldMeshArray0[m].material.transparent = true;
        shieldMeshArray1[m] = new THREE.Mesh( geometryShield, materialShield[m+10]);
        shieldMeshArray1[m].material.transparent = true;
        shieldMeshArray2[m] = new THREE.Mesh( geometryShield, materialShield[m+20]);
        shieldMeshArray2[m].material.transparent = true;
        shieldMeshArray3[m] = new THREE.Mesh( geometryShield, materialShield[m+30]);
        shieldMeshArray3[m].material.transparent = true;
        shieldMeshArray0[m].name = "shieldMesh0"+ m;
        shieldMeshArray1[m].name = "shieldMesh1"+ m;
        shieldMeshArray2[m].name = "shieldMesh2"+ m;
        shieldMeshArray3[m].name = "shieldMesh3"+ m;
    }  
    
    megaShieldArray[0] = shieldMeshArray0;
    megaShieldArray[1] = shieldMeshArray1;
    megaShieldArray[2] = shieldMeshArray2;
    megaShieldArray[3] = shieldMeshArray3;
    
    for (var p = 0; p < 4; p++)
    {
        megaShieldArray[p][0].position.y = 3;
        megaShieldArray[p][1].position.y = 4;
        megaShieldArray[p][2].position.y = 5;
        megaShieldArray[p][3].position.y = 4.5;
        megaShieldArray[p][4].position.y = 5;
        megaShieldArray[p][5].position.y = 4.5;
        megaShieldArray[p][6].position.y = 5;
        megaShieldArray[p][7].position.y = 3;
        megaShieldArray[p][8].position.y = 4;
        megaShieldArray[p][9].position.y = 5;
    }
    for (var n = 0; n < 10; n++)
    { 
        megaShieldArray[0][0].position.x = 0 -18;
        megaShieldArray[0][1].position.x = 0 -18;
        megaShieldArray[0][2].position.x = 0 -18;
        megaShieldArray[0][3].position.x = 1 -18;
        megaShieldArray[0][4].position.x = 1 -18;
        megaShieldArray[0][5].position.x = 2 -18;
        megaShieldArray[0][6].position.x = 2 -18;
        megaShieldArray[0][7].position.x = 3 -18;
        megaShieldArray[0][8].position.x = 3 -18;
        megaShieldArray[0][9].position.x = 3 -18;
        scene.add(megaShieldArray[0][n]);
        
        megaShieldArray[1][0].position.x = 0 -7;
        megaShieldArray[1][1].position.x = 0 -7;
        megaShieldArray[1][2].position.x = 0 -7;
        megaShieldArray[1][3].position.x = 1 -7;
        megaShieldArray[1][4].position.x = 1 -7;
        megaShieldArray[1][5].position.x = 2 -7;
        megaShieldArray[1][6].position.x = 2 -7;
        megaShieldArray[1][7].position.x = 3 -7;
        megaShieldArray[1][8].position.x = 3 -7;
        megaShieldArray[1][9].position.x = 3 -7;
        scene.add(megaShieldArray[1][n]);
        
        megaShieldArray[2][0].position.x = 0 +4;
        megaShieldArray[2][1].position.x = 0 +4;
        megaShieldArray[2][2].position.x = 0 +4;
        megaShieldArray[2][3].position.x = 1 +4;
        megaShieldArray[2][4].position.x = 1 +4;
        megaShieldArray[2][5].position.x = 2 +4;
        megaShieldArray[2][6].position.x = 2 +4;
        megaShieldArray[2][7].position.x = 3 +4;
        megaShieldArray[2][8].position.x = 3 +4;
        megaShieldArray[2][9].position.x = 3 +4;
        scene.add(megaShieldArray[2][n]);
        
        megaShieldArray[3][0].position.x = 0 +15;
        megaShieldArray[3][1].position.x = 0 +15;
        megaShieldArray[3][2].position.x = 0 +15;
        megaShieldArray[3][3].position.x = 1 +15;
        megaShieldArray[3][4].position.x = 1 +15;
        megaShieldArray[3][5].position.x = 2 +15;
        megaShieldArray[3][6].position.x = 2 +15;
        megaShieldArray[3][7].position.x = 3 +15;
        megaShieldArray[3][8].position.x = 3 +15;
        megaShieldArray[3][9].position.x = 3 +15;
        scene.add(megaShieldArray[3][n]);
        
    }
    
    //board limit
    var geometryBoardLimit = new THREE.BoxGeometry( 41, 0.2, 0.2 );
    var materialBoardLimit = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var boardLimitMesh = new THREE.Mesh( geometryBoardLimit, materialBoardLimit );
    scene.add( boardLimitMesh );
    boardLimitMesh.position.y = -1.5

    //camera
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    camera.position.x = 0;
    camera.position.y = 11;
    camera.position.z = 20;
    var cameraPosition1 = false;

    //KeyOption Handler, update every time a key is pressed
    //Used for one time key press
    document.addEventListener('keydown',onDocumentKeyDown,false);
	function onDocumentKeyDown(event){
		event = event || window.event;
		var keycode = event.keyCode;

        //Prevent Key Handling by your Browser
        event.preventDefault();

        //Invicibility mode
        if(keycode == 73)
        {
        	if(invincibilityMode == false)
        	{
        		invincibilityMode = true;
        	}
        	else
        	{
        		invincibilityMode = false;
        	}
        }

        //Purge mode
        if(keycode == 75)
        {
        	for (var s = 0; s < nbEnemy; s++)
    		{ 
    			scene.remove(enemyMeshArray[s]);
    			enemyDeadArray[s] = true;
                nbEnemyDead = nbEnemy;
                purgeMode = true;
    		}
        }

        //Help Window
        if(keycode == 72)
        {
        	help();
        }

	}

    //KeyGame Handler
    //Permit to avoid delay while pressing a key
    var keyState = {};
    document.addEventListener("keydown",function(e){ keyState[e.keyCode || e.which] = true; },true);
    document.addEventListener("keyup",function(e){ keyState[e.keyCode || e.which] = false; },true);


    //game loop, update every frame
    var animate = function () {
        requestAnimationFrame( animate );
        
        //HUD loop managmenet
        document.getElementById("level").innerHTML = "Level " + ph;
        document.getElementById("nom").innerHTML = "Nom : " + playerName;
        if(playerScore < 0)
        {
            playerScore = 0;
        }
        document.getElementById("score").innerHTML = "Score : " + playerScore;
        document.getElementById("vie").innerHTML = "Vie : " + playerHp;
        
        //skyBox Mouvement
        skyBox.rotation.y += 0.0001;
        
        //Move Left
        if (keyState[37] && playerMesh.position.x > -20) {
            playerMesh.position.x -= playerSpeedX;
        }

        //Move Right
        if (keyState[39] && playerMesh.position.x < 20) {
            playerMesh.position.x += playerSpeedX;
        }

        //Shoot Missile Player
        if (keyState[32] && MissilePlayerShooted == false && playerHp > 0 )
        {
            MissilePlayerShooted = true;
            scene.add( MissilePlayerMesh );
            MissilePlayerMesh.position.x = playerMesh.position.x;
            sound.setBuffer( shootSoundBuffer );
            sound.setVolume( 0.5 );
            sound.play();       
        }

        //Shoot Missile Enemy
        if (MissileEnemyShooted == false)
        {
        	enemyShooter = Math.round(Math.random()*nbEnemy);
        	if(enemyDeadArray[enemyShooter] == false)
        	{
        		MissileEnemyMesh.position.x = enemyMeshArray[enemyShooter].position.x
        		MissileEnemyMesh.position.y = enemyMeshArray[enemyShooter].position.y
        		MissileEnemyShooted = true;
        		scene.add( MissileEnemyMesh );
        	}
        }

        //Missile Player Movement
        if(MissilePlayerShooted == true)
        {
            MissilePlayerMesh.position.y += missilePlayerSpeedY;

            if(MissilePlayerMesh.position.y > limitMissilePlayerPositionY)
            {
                scene.remove(MissilePlayerMesh);
                MissilePlayerMesh.position.y = 0;
                MissilePlayerShooted = false;
            }
        }

        //Missile Enemy Movement
        if(MissileEnemyShooted == true)
        {
            MissileEnemyMesh.position.y -= missileEnemySpeedY;

            if(MissileEnemyMesh.position.y < limitMissileEnemyPositionY)
            {
                scene.remove(MissileEnemyMesh);
                MissileEnemyShooted = false;
            }
        }

        //Missile Player Collision

        //Collision with Enemy
        for (var j = 0; j < nbEnemy + 1; j++)
        {
            if(collisionBetween(scene, MissilePlayerMesh, enemyMeshArray[j], "enemyMesh" + j, hitBoxSize ))
            {
                sound.setBuffer( boomSoundBuffer );
                sound.setVolume( 0.5 );
                sound.play();  
            	enemyDeadArray[j] = true;
                scene.remove(enemyMeshArray[j]);
                oneEnemyBeingKilled = true;
                enemySpeedX += 0.004;
                if(nbEnemyDead == nbEnemy - 3)
                {
                    enemySpeedX += 0.05;
                }
                if(nbEnemyDead == nbEnemy - 2)
                {
                    enemySpeedX += 0.05;
                }
                scene.remove(MissilePlayerMesh);
                MissilePlayerMesh.position.y = 0;
                MissilePlayerShooted = false;
                if (j == nbEnemy)
                {
                    playerScore += 300;
                    enemyMeshArray[nbEnemy].position.x = -30;
                }
                else
                {
                    playerScore += 100;
                }
            }
            if(oneEnemyBeingKilled == true)
            {
                if (j != nbEnemy)
                {
                    nbEnemyDead += 1;
                }
                oneEnemyBeingKilled = false;
                
                //Game win
                if(nbEnemyDead == nbEnemy)
                {
                    sound.setBuffer( winSoundBuffer );
                    sound.setVolume( 0.5 );
                    setTimeout(function(){ sound.play(); }, 1000); 
                    if(ph == 1)
                    {
                        save = { "name": JSONSave.name,"score": JSONSave.score + playerScore,"level": 2};
                        stringSave = JSON.stringify(save);
                        localStorage.setItem('save', stringSave);
                        JSONSave = JSON.parse(localStorage.getItem('save'));
                        setTimeout(function(){ location.href = 'gamewin.html'; }, 2000);
                    }
                    else if(ph == 2)
                    {
                        save = { "name": JSONSave.name,"score": JSONSave.score +  playerScore,"level": 3};
                        stringSave = JSON.stringify(save);
                        localStorage.setItem('save', stringSave);
                        JSONSave = JSON.parse(localStorage.getItem('save'));
                        setTimeout(function(){ location.href = 'gamewin.html'; }, 2000);
                    }
                    else if(ph == 3)
                    {
                        save = { "name": JSONSave.name,"score": JSONSave.score +  playerScore,"level": 3};
                        stringSave = JSON.stringify(save);
                        localStorage.setItem('save', stringSave);
                        JSONSave = JSON.parse(localStorage.getItem('save'));
                        setTimeout(function(){ location.href = 'gamewin.html'; }, 2000);
                    }

                }
            }
        }

        //Game win with Purge
        if(purgeMode == true)
        {
            sound.setBuffer( winSoundBuffer );
            sound.setVolume( 0.5 );
            sound.play(); 
            if(ph == 1)
            {
                save = { "name": JSONSave.name,"score": JSONSave.score + playerScore,"level": 2};
                stringSave = JSON.stringify(save);
                localStorage.setItem('save', stringSave);
                JSONSave = JSON.parse(localStorage.getItem('save'));
                setTimeout(function(){ location.href = 'gamewin.html'; }, 1000);
            }
            else if(ph == 2)
            {
                save = { "name": JSONSave.name,"score": JSONSave.score +  playerScore,"level": 3};
                stringSave = JSON.stringify(save);
                localStorage.setItem('save', stringSave);
                JSONSave = JSON.parse(localStorage.getItem('save'));
                setTimeout(function(){ location.href = 'gamewin.html'; }, 1000);
            }
            else if(ph == 3)
            {
                save = { "name": JSONSave.name,"score": JSONSave.score +  playerScore,"level": 3};
                stringSave = JSON.stringify(save);
                localStorage.setItem('save', stringSave);
                JSONSave = JSON.parse(localStorage.getItem('save'));
                setTimeout(function(){ location.href = 'gamewin.html'; }, 1000);
            }

        }

        for (var q = 0; q < nbEnemy; q++)
        {
	        //Collision with Shield
            if(collisionBetween(scene, MissilePlayerMesh, shieldMeshArray0[q], "shieldMesh0" + q, hitBoxSize ))
            {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[q] --;
                shieldMeshArray0[q].material.opacity -= 0.25;
	            scene.remove(MissilePlayerMesh);
	            MissilePlayerMesh.position.y = 0;
	            MissilePlayerShooted = false;
	            if(shieldHpArray[q] <= 0)
	            {
	                scene.remove(shieldMeshArray0[q]);
	            }
	        }
            if(collisionBetween(scene, MissilePlayerMesh, shieldMeshArray1[q], "shieldMesh1" + q, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[q+10] --;
                shieldMeshArray1[q].material.opacity -= 0.25;
	            scene.remove(MissilePlayerMesh);
	            MissilePlayerMesh.position.y = 0;
	            MissilePlayerShooted = false;
	            if(shieldHpArray[q+10] <= 0)
	            {
	                scene.remove(shieldMeshArray1[q]);
	            }
	        }
            if(collisionBetween(scene, MissilePlayerMesh, shieldMeshArray2[q], "shieldMesh2" + q, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[q+20] --;
                shieldMeshArray2[q].material.opacity -= 0.25;
	            scene.remove(MissilePlayerMesh);
	            MissilePlayerMesh.position.y = 0;
	            MissilePlayerShooted = false;
	            if(shieldHpArray[q+20] <= 0)
	            {
	                scene.remove(shieldMeshArray2[q]);
	            }
	        }
            if(collisionBetween(scene, MissilePlayerMesh, shieldMeshArray3[q], "shieldMesh3" + q, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[q+30] --;
                shieldMeshArray3[q].material.opacity -= 0.25;
	            scene.remove(MissilePlayerMesh);
	            MissilePlayerMesh.position.y = 0;
	            MissilePlayerShooted = false;
	            if(shieldHpArray[q+30] <= 0)
	            {
	                scene.remove(shieldMeshArray3[q]);
	            }
	        }
        }

        //Missile Enemy Collision

        //Collision with player
        if(collisionBetween(scene, MissileEnemyMesh, playerMesh, "playerMesh", hitBoxSize))
        {
        	if(invincibilityMode == false)
        	{
                sound.setBuffer( boomSoundBuffer );
                sound.setVolume( 0.5 );
                sound.play();  
        		playerHp--;
        	}
        	playerScore -= 200;
            scene.remove(MissileEnemyMesh);
            MissileEnemyShooted = false;
            if(playerHp <= 0)
           	{
            	scene.remove(playerMesh);
                sound.setBuffer( looseSoundBuffer );
                sound.setVolume( 0.5 );
                setTimeout(function(){ sound.play(); }, 500); 
                setTimeout(function(){ location.href = 'gameover.html'; }, 2000);
                
            }
        }

        for (var r = 0; r < nbEnemy; r++)
        {    
	        //Collision with Shield
            if(collisionBetween(scene, MissileEnemyMesh, shieldMeshArray0[r], "shieldMesh0" + r, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play();  
	            shieldHpArray[r] --;
                shieldMeshArray0[r].material.opacity -= 0.25;
	            scene.remove(MissileEnemyMesh);
	            MissileEnemyShooted = false;
	            if(shieldHpArray[r] <= 0)
	            {
	                scene.remove(shieldMeshArray0[r]);
	            }
	        }
            if(collisionBetween(scene, MissileEnemyMesh, shieldMeshArray1[r], "shieldMesh1" + r, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[r+10] --;
                shieldMeshArray1[r].material.opacity -= 0.25;
	            scene.remove(MissileEnemyMesh);
	            MissileEnemyShooted = false;
	            if(shieldHpArray[r+10] <= 0)
	            {
	                scene.remove(shieldMeshArray1[r]);
	            }
	        }
            if(collisionBetween(scene, MissileEnemyMesh, shieldMeshArray2[r], "shieldMesh2" + r, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[r+20] --;
                shieldMeshArray2[r].material.opacity -= 0.25;
	            scene.remove(MissileEnemyMesh);
	            MissileEnemyShooted = false;
	            if(shieldHpArray[r+20] <= 0)
	            {
	                scene.remove(shieldMeshArray2[r]);
	            }
	        }
            if(collisionBetween(scene, MissileEnemyMesh, shieldMeshArray3[r], "shieldMesh3" + r, hitBoxSize ))
	        {
                sound.setBuffer( boomSoundBuffer1 );
                sound.setVolume( 0.5 );
                sound.play(); 
	            shieldHpArray[r+30] --;
                shieldMeshArray3[r].material.opacity -= 0.25;
	            scene.remove(MissileEnemyMesh);
	            MissileEnemyShooted = false;
	            if(shieldHpArray[r+30] <= 0)
	            {
	                scene.remove(shieldMeshArray3[r]);
	            }
	        }

	    }

        //Enemy Movement
        var maxX = 0;
        var minX = 0;
        var minY = 50;
        for (var k = 0; k < nbEnemy; k++)
        {
            
            if(enemyMeshArray[k].position.x > maxX && scene.getObjectByName("enemyMesh" + k) != null)
            {
                maxX = enemyMeshArray[k].position.x;
            }
            if(enemyMeshArray[k].position.x < minX && scene.getObjectByName("enemyMesh" + k) != null)
            {
                minX = enemyMeshArray[k].position.x;
            }
            if(enemyMeshArray[k].position.y < minY && scene.getObjectByName("enemyMesh" + k) != null)
            {
                minY = enemyMeshArray[k].position.y;
            }
            
            if(minY < 3)
            {
                sound.setBuffer( looseSoundBuffer );
                sound.setVolume( 0.5 );
                setTimeout(function(){ sound.play(); }, 500);
                scene.remove(playerMesh);
                setTimeout(function(){ location.href = 'gameover.html'; }, 2000);
            }
            
            if (goingRight == true)
            {
                enemyMeshArray[k].position.x += enemySpeedX;
            }
            else if (goingRight == false)
            {
                enemyMeshArray[k].position.x -= enemySpeedX;
            }

        }

        if (minX <= -20)
        {
            goingRight = true;
            for (var l = 0; l < nbEnemy; l++)
            {
                if(invincibilityMode == false)
                {
                    enemyMeshArray[l].position.y -= enemySpeedY;
                }
            }
        }

        if(maxX >= 20)
        {
            goingRight = false;
            for (var l = 0; l < nbEnemy; l++)
            {
                if(invincibilityMode == false)
                {
                    enemyMeshArray[l].position.y -= enemySpeedY;
                }
            }
        }   

        //Enemy Bonus Movement
        enemyMeshArray[nbEnemy].position.x += enemyBonusSpeedX;
        if(nbEnemyDead <= nbEnemy * 0.85 && nbEnemyDead >= nbEnemy * 0.75 
        || nbEnemyDead <= nbEnemy * 0.65 && nbEnemyDead >= nbEnemy * 0.55
        || nbEnemyDead <= nbEnemy * 0.45 && nbEnemyDead >= nbEnemy * 0.35
        || nbEnemyDead <= nbEnemy * 0.25 && nbEnemyDead >= nbEnemy * 0.15)
        {
            scene.add(enemyMeshArray[nbEnemy]);
            enemyMeshArray[nbEnemy].position.x = -31;
            if(enemyMeshArray[nbEnemy].position.x >= 30)
            {
                scene.remove(enemyMeshArray[nbEnemy]);
                enemyMeshArray[nbEnemy].position.x = -30;
            }
        }
        //Camera position 0
        if (keyState[48])
        {
            camera.rotation.x = 0;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
            camera.position.x = 0;
            camera.position.y = 11;
            camera.position.z = 20;
            cameraPosition1 = false;
        }

        //Camera position 1
        if (keyState[49])
        {
            camera.rotation.x = Math.PI/2;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
            camera.position.x = playerMesh.position.x;
            camera.position.y = -5;
            camera.position.z = 2;
            cameraPosition1 = true;
        }
        if(cameraPosition1 == true)
        {
            camera.position.x = playerMesh.position.x;
        }

        //Camera position 2
        if (keyState[50])
        {
            camera.rotation.x = 0;
            camera.rotation.y = Math.PI/2;
            camera.rotation.z = Math.PI/2;
            camera.position.x = 25;
            camera.position.y = 5;
            camera.position.z = 0;
            cameraPosition1 = false;
        }
        //Camera position 3
        if (keyState[51])
        {
            camera.rotation.x = -Math.PI/2;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
            camera.position.x = 0;
            camera.position.y = 35;
            camera.position.z = -5;
            cameraPosition1 = false;
        }
       

        renderer.render(scene, camera);
    };

    animate();
};
