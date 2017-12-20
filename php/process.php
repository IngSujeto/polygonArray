<?php  
	
	include 'Conexion.php';

	$data = json_decode( $_POST["data"] );

	$op = $data[0]->{"option"};

	$conexion = new Conexion();
	$cnn = $conexion->getConexion();
	$sql = "";
	$statement = null;
	$valor = null;

	switch ($op->{"option"}) {
		case 1:
			$sql = "SELECT * FROM collection";
			$statement = $cnn->prepare($sql);
			$valor = $statement->execute();

			if( $valor ){
				while( $resultado = $statement->fetch(PDO::FETCH_ASSOC)){
					$polygones["data"][] = $resultado;
				}
				echo json_encode($polygones);
				}else{
					echo "error";
				}

				$statement->closeCursor();
				$conexion = null;

			break;
		
		case 2:
			$search = $data[1]->{"search"};
			$sql = "SELECT pointY AS lat, pointX AS lng FROM points WHERE idPolygone = ".$search->{"search"}."";
			$statement = $cnn->prepare($sql);
			$valor = $statement->execute();

			if( $valor ){
				while( $resultado = $statement->fetch(PDO::FETCH_ASSOC)){
					$polygones["points"][] = $resultado;
				}
				echo json_encode($polygones);
				}else{
					echo "error";
				}

				$statement->closeCursor();
				$conexion = null;
			break;

		case 3:
			$namePoly = $data[1]->{"namePoly"};
			$points = $data[2]->{"points"};

			try {  
				$statement = $cnn;
				$statement ->beginTransaction();
				$sql = "SELECT MAX(idPolygone) AS id FROM collection";

				$idQuery = $cnn->prepare($sql);
				$idQuery->execute();

				$resultado = $idQuery->fetch(PDO::FETCH_ASSOC);

				$id = (string)($resultado["id"]+1);

				$sql = "INSERT INTO  collection (idPolygone, Name) values (".$id.",'".$namePoly->{"name"}."')";
				$statement -> exec($sql);

				for ($i=0; $i < count($points); $i++) { 
					$sql = "INSERT INTO points (idPolygone, pointX, pointY) values (".$id.", ".$points[$i]->{"lng"}.", ".$points[$i]->{"lat"}.")";
					$statement -> exec($sql);
				}
				
				$statement -> commit();
				echo true;
			} catch (Exception $e) {
				 $statement -> rollBack();
				 echo "Fallo: " . $e->getMessage();
			}
			$conexion = null;
			
	}
