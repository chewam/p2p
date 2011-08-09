<?php

function registerUser($data) {
    if ($data && isset($data['cirrus_id']) && isset($data['name'])) {
        $connection = Connection::find_by_cirrus_id($data['cirrus_id']);
        if (!$connection) {
            $connection = Connection::create(array(
                'name' => $data['name'],
                'cirrus_id' => $data['cirrus_id']
            ));
        } else {
            $connection->name = $data['name'];
            $connection->save();
        }
    }
}

function cleanList() {
    Connection::connection()->query('DELETE FROM connections WHERE updated_at < NOW() - INTERVAL 30 SECOND');
}

function getUserList() {
    $data = array();
    $connections = Connection::all(array(
        'order' => 'name asc',
    ));
    foreach($connections as $connection) {
        $data[] = array(
            'name' => $connection->name,
            'cirrus_id' => $connection->cirrus_id,
        );
    }
    return $data;
}

?>