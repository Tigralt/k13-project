<?php
namespace WebSocket;

use Ratchet\Server\IoServer;
use WebSocket\AsyncTask;
use WebSocket\Room;

class Server extends AsyncTask
{
    protected function doInBackground($parameters)
    {
        $port = is_null($parameters) ? 8080 : $parameters;
        $server = IoServer::factory(
            new Room(),
            $port
        );

        $server->run();

        return null;
    }
}