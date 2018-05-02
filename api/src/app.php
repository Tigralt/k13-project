<?php

use Silex\Application;
use Silex\Provider\AssetServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\HttpFragmentServiceProvider;
use Silex\Provider\RoutingServiceProvider;
use Silex\Provider\DoctrineServiceProvider;

$app = new Application();
$app->register(new ServiceControllerServiceProvider());
$app->register(new AssetServiceProvider());
$app->register(new TwigServiceProvider());
$app->register(new HttpFragmentServiceProvider());
$app->register(new RoutingServiceProvider());
$app->register(new DoctrineServiceProvider(), array(
    "db.options" => array(
        'driver'   => 'pdo_mysql',
        'host'     => 'localhost',
        'dbname'   => 'k13-project',
        'user'     => 'root',
        'password' => 'root',
    )
));

return $app;
