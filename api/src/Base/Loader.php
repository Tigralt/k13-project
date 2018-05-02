<?php
namespace Base;

use Silex\Application;

class Loader
{
    private $namespace = "App";
    private $classes = array();
    private $directory;

    public function __construct(Application $app, $base) {
        $this->directory = __DIR__ . "/../" . $this->namespace . "/";
        $files = array_diff(scandir($this->directory), array('..', '.'));

        foreach ($files as $file) {
            require_once $this->directory . $file;

            $info = explode(".", $file);
            $class = "\\" . $this->namespace . "\\" . $info[0];
            $this->classes[] = new $class($app, $base);
        }
    }
}