<?php
header("content-type: text/javascript");

include('config.php');
include('functions.php');

$R =& $_REQUEST;

registerUser($R);
cleanList();
$list = getUserList();

$json = array(
    'success' => true,
    'data' => $list
);

print $R['callback'] . '('.json_encode($json).');';


?>