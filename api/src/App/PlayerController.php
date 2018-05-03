<?php
namespace App;

use Silex\Application;
use Base\Controller;

class PlayerController extends Controller {
    function __construct(Application $app, $base) {
        $this->table = "player";
        $this->api = array(
            array("player/", "post", "create"),
            array("player/", "get", "readAll"),
            array("player/{member}/{value}", "get", "readAllFrom"),
            array("player/{id}", "get", "read"),
            array("player/{id}", "put", "update"),
            array("player/{id}", "delete", "delete"),
        );
        $this->members = array("name", "score", "room");

        parent::__construct($app, $base, $this->table, $this->api, $this->members);
    }
}