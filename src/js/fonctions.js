function collisionBetween(_scene, _mesh1, _mesh2, _nameMesh2, _hBSize ) {
    if(_scene.getObjectByName(_nameMesh2) != null &&
        _mesh1.position.y > _mesh2.position.y - _hBSize &&
        _mesh1.position.y < _mesh2.position.y + _hBSize &&
        _mesh1.position.x < _mesh2.position.x + _hBSize &&
        _mesh1.position.x > _mesh2.position.x - _hBSize)
	{
    	return true;
   	}
    else
    {
    	return false;
    }
}

function help(){
    alert("0 : Caméra normale \n1 : Caméra 3eme personne \n2 : Camera de côté\n3 : Caméra côté aliens\nh : Help\ni : Mode Invincible \nk : Tuer tous les ennemies");
}
