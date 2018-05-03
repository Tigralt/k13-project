<?php
namespace App;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Base\Controller;

class QuizzController extends Controller {
    function __construct(Application $app, $base) {
        $this->table = "quizz";
        $this->api = array(
            array("quizz/", "post", "create"),
            array("quizz/", "get", "readAll"),
            array("quizz/{member}/{value}", "get", "readAllFrom"),
            array("quizz/{id}", "get", "read"),
            array("quizz/{id}", "put", "update"),
            array("quizz/{id}", "delete", "delete"),
        );
        $this->members = array("name", "player");
        $this->app = $app;

        parent::__construct($app, $base, $this->table, $this->api, $this->members);
    }
}