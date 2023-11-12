<?php

return [
    'routes' => [
        '*' => [
            'controller' => 'Pop\Docs\Http\Controller\IndexController',
            'action'     => 'route',
            'default'    => true
        ]
    ],
    'database' => include __DIR__ . '/database.php'
];