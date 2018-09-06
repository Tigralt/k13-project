<?php
namespace WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Room implements MessageComponentInterface
{
    protected $clients;
    protected $roles;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->roles = array();
    }

    /**
     * Default
     */

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /**
     * Room
     */

    // public function onStartQuestion(ConnectionInterface $from, $room_id) {
        
    // }

    // public function onStopQuestion(ConnectionInterface $from, $room_id) {

    // }

    // public function onNextQuestion(ConnectionInterface $from, $room_id) {

    // }

    // public function onOpenRoom(ConnectionInterface $from, $room) {
    //     // if (array_key_exists($room["role"], $this->rooms[$room["id"]]))
    //     //     $this->rooms[$room["id"]][$room["role"]] = new \SplObjectStorage();

    //     // $this->rooms[$room["id"]][$room["role"]]->attach($from);
    // }

    // public function onQuitRoom(ConnectionInterface $from, $room) {

    // }

    // public function onBuzz(ConnectionInterface $from, $room_id) {

    // }
}