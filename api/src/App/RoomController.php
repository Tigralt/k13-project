<?php
namespace App;

use Silex\Application;
use Base\Controller;

class RoomController extends Controller {
    function __construct(Application $app, $base) {
        $this->table = "room";
        $this->api = array(
            array("room/", "post", "create"),
            array("room/", "get", "readAll"),
            array("room/{member}/{value}", "get", "readAllFrom"),
            array("room/{id}", "get", "read"),
            array("room/{id}", "delete", "delete"),
        );
        $this->members = array("password", "quizz");

        parent::__construct($app, $base, $this->table, $this->api, $this->members);
    }
}