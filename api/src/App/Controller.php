<?php
namespace App;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class Controller {
    private $app;
    private $table;
    public $api;
    public $members;

    public function __construct(Application $app, $base, $table, $api, $members) {
        $this->app = $app;
        $this->table = $table;
        $this->api = $api;
        $this->members = $members;

        foreach ($this->api as $value) {
            $app->{$value[1]}($base.$value[0], [$this, $value[2]]);
        }
    }

    /**
     * CREATE
     */

    public function create() {
        $request = $this->app['request_stack']->getCurrentRequest()->request->all();

        // Generate values
        $values = array();
        foreach ($this->members as $member)
            $values[$member] = $request[$member];
        
        // Insert
        $this->app['db']->insert($this->table, $values);

        // Return object
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $id = $this->app['db']->lastInsertId();
        $result = $this->app['db']->fetchAssoc($query, array($id));

        return new JsonResponse($result);
    }

    /**
     * READ
     */

    public function readAll() {
        $query = "SELECT * FROM " . $this->table; 
        $result = $this->app['db']->fetchAll($query);

        return new JsonResponse($result);
    }

    public function read(int $id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $result = $this->app['db']->fetchAssoc($query, array($id));

        return new JsonResponse($result);
    }

    /**
     * UPDATE
     */
    
    public function update(int $id) {
        $request = $this->app['request_stack']->getCurrentRequest()->request->all();

        // Generate values
        $values = array();
        foreach ($this->members as $member)
            $values[$member] = $request[$member];
        
        // Update
        $this->app['db']->update($this->table, $values, array("id" => $id));

        // Return object
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        $result = $this->app['db']->fetchAssoc($query, array($id));

        return new JsonResponse($result);
    }

    /**
     * DELETE
     */
    public function delete(int $id) {
        $request = $this->app['request_stack']->getCurrentRequest()->request->all();
        $result = $this->app['db']->delete($this->table, array("id" => $id));

        return new JsonResponse($result);
    }
}