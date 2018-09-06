<?php
namespace WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Room implements MessageComponentInterface
{
    protected $clients;
    protected $rooms;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->rooms = array();
    }

    /**
     * Default
     */

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection #{$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $message = explode("|", $msg);

        switch($message[0]) {
            // Room mgmt
            case "joinRoom": $this->handleJoinRoom($from, $message); break;
            case "quitRoom": $this->handleQuitRoom($from, $message); break;

            // Question mgmt
            case "startQuestion": $this->handleStartQuestion($message); break;
            case "pauseQuestion": $this->handlePauseQuestion($message); break;
            case "nextQuestion": $this->handleNextQuestion($message); break;

            // Team mgmt
            case "playerBuzzQuestion": $this->handlePlayerBuzzQuestion($message); break;
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection #{$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /**
     * Room
     */

    /**
     * message[3]:
     *     0: "joinRoom",
     *     1: room_id,
     *     2: role ("screen", "controller", "player")
     */
    private function handleJoinRoom($conn, $message) {
        if (count($message) < 3) return;

        $room_id = (int) $message[1];
        $role = $message[2];

        if (!in_array($role, array("screen", "controller", "player"))) return;
        if (!array_key_exists($room_id, $this->rooms)) $this->rooms[$room_id] = array();
        if (!array_key_exists($role, $this->rooms[$room_id])) $this->rooms[$room_id][$role] = array();

        $this->rooms[$room_id][$role][$conn->resourceId] = $conn;

        echo "Room #$room_id joined ($role)\n";
    }
    
    /**
     * message[3]:
     *     0: "quitRoom",
     *     1: room_id,
     *     2: role ("screen", "controller", "player")
     */
    private function handleQuitRoom($conn, $message) {
        if (count($message) < 3) return;

        $room_id = (int) $message[1];
        $role = $message[2];

        if (!in_array($role, array("screen", "controller", "player"))) return;
        if (!array_key_exists($room_id, $this->rooms)) return;
        if (!array_key_exists($role, $this->rooms[$room_id])) return;

        if (in_array($role, array("player", "screen"))) { // Quit player/screen
            unset($this->rooms[$room_id][$role][$conn->resourceId]);
            if (empty($this->rooms[$room_id][$role])) unset($this->rooms[$room_id][$role]);
            if (empty($this->rooms[$room_id])) unset($this->rooms[$room_id]);
        } else { // Close everything
            $roles = $this->rooms[$room_id];
            foreach($roles["player"] as $player) $player->send("quitRoom");
            foreach($roles["screen"] as $screen) $screen->send("quitRoom");
            unset($this->rooms[$room_id]);
        }

        echo "Room #$room_id quit ($role)\n";
    }

    /**
     * Question
     */

    /**
     * message[2]:
     *     0: "startQuestion",
     *     1: room_id
     */
    private function handleStartQuestion($message) {
        if (count($message) < 2) return;

        $room_id = (int) $message[1];
        $roles = $this->rooms[$room_id];

        foreach($roles["player"] as $player)
            $player->send("startQuestion");

        foreach($roles["screen"] as $screen)
            $screen->send("startQuestion");
    }

    /**
     * message[2]:
     *     0: "pauseQuestion",
     *     1: room_id
     */
    private function handlePauseQuestion($message) {
        if (count($message) < 2) return;

        $room_id = (int) $message[1];
        $roles = $this->rooms[$room_id];

        foreach($roles["player"] as $player)
            $player->send("pauseQuestion");

        foreach($roles["screen"] as $screen)
            $screen->send("pauseQuestion");
    }

    /**
     * message[2]:
     *     0: "nextQuestion",
     *     1: room_id
     */
    private function handleNextQuestion($message) {
        if (count($message) < 2) return;

        $room_id = (int) $message[1];
        $roles = $this->rooms[$room_id];

        foreach($roles["player"] as $player)
            $player->send("nextQuestion");

        foreach($roles["screen"] as $screen)
            $screen->send("nextQuestion");
    }

    /**
     * Team
     */
    
    /**
     * message[3]:
     *     0: "playerBuzzQuestion",
     *     1: room_id
     *     2: player_name
     */
    private function handlePlayerBuzzQuestion($message) {
        if (count($message) < 3) return;

        $room_id = (int) $message[1];
        $player_name = $message[2];

        foreach($roles["player"] as $player)
            $player->send("buzzQuestion");

        foreach($roles["screen"] as $screen)
            $screen->send("buzzQuestion|$player_name");

        foreach($roles["controller"] as $controller)
            $screen->send("buzzQuestion|$player_name");
    }    
}