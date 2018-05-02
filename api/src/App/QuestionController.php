<?php
namespace App;

use Silex\Application;
use Base\Controller;

class QuestionController extends Controller {
    function __construct(Application $app, $base) {
        $this->table = "question";
        $this->api = array(
            array("question/", "post", "create"),
            array("question/", "get", "readAll"),
            array("question/{id}", "get", "read"),
            array("question/{id}", "put", "update"),
            array("question/{id}", "delete", "delete"),
        );
        $this->members = array("text", "quizz");

        parent::__construct($app, $base, $this->table, $this->api, $this->members);
    }
}