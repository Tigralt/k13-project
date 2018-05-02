<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Base\Loader;

$base = "/api/";
$loader = new Loader($app, $base);

// Documentation
$app->get($base, function () use ($app) {
    $documentation = array(
        "objects" => array(
            "question" => array("text"),
            "answer" => array("text", "points"),
            "quizz" => array("name", "access_id"),
            "room" => array("password"),
            "player" => array("name", "score")
        ),
        "permissions" => array(
            "question" => array("GET", "POST", "PUT", "DELETE"),
            "answer" => array("GET", "POST", "PUT", "DELETE"),
            "quizz" => array("GET", "POST", "PUT", "DELETE"),
            "room" => array("GET", "POST", "PUT"),
            "player" => array("GET", "POST", "PUT", "DELETE")
        )
    );
    
    return new JsonResponse($documentation);
});