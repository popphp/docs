<?php

return [
    'routes' => [
        '[/]' => [
            'controller' => 'Pop\Docs\Http\Controller\IndexController',
            'action'     => 'index'
        ],
        '*'    => [
            'controller' => 'Pop\Docs\Http\Controller\IndexController',
            'action'     => 'error'
        ]
    ],
    'database' => include __DIR__ . '/database.php'
];