<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $appointments = json_decode($input, true);
    
    if ($appointments !== null) {
        // Guardar en archivo JSON
        if (file_put_contents('../data/appointments.json', json_encode($appointments, JSON_PRETTY_PRINT))) {
            // Actualizar timestamp de backup
            $backupInfo = [
                'lastBackup' => date('c'),
                'totalAppointments' => count($appointments, COUNT_RECURSIVE) - count($appointments),
                'version' => '1.0'
            ];
            file_put_contents('../data/backup_info.json', json_encode($backupInfo, JSON_PRETTY_PRINT));
            
            echo json_encode(['success' => true, 'message' => 'Datos guardados correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al guardar datos']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>