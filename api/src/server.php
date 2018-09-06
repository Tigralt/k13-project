<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WebSocket\Room;

$port = 8080;
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Room()
        )
    ),
    $port
);

return $server;