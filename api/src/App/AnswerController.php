<?php
namespace App;

use Silex\Application;
use Base\Controller;

class AnswerController extends Controller {
    function __construct(Application $app, $base) {
        $this->table = "answer";
        $this->api = array(
            array("answer/", "post", "create"),
            array("answer/", "get", "readAll"),
            array("answer/{id}", "get", "read"),
            array("answer/{id}", "put", "update"),
            array("answer/{id}", "delete", "delete"),
        );
        $this->members = array("text", "points", "question");

        parent::__construct($app, $base, $this->table, $this->api, $this->members);
    }
}