<?php

require_once dirname(__FILE__).'/lib/php-activerecord/ActiveRecord.php';

ActiveRecord\Config::initialize(function($cfg) {
    $cfg->set_model_directory(dirname(__FILE__).'/models');
    $cfg->set_connections(array(
        'development' => 'mysql://root:juX2p0mX@localhost/p2p'
    ));
});

$config = array(
    // 'googlekey' => 'ABQIAAAAHOITiVvSWeOehA_yhs9LiRTbUuyDEoguILq6DjsgiInI3jXx4hSG0CFF4kKqhJFtuTI-zOAWwIWs3w'
);

?>