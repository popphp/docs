<?php

return [
    'routes' => [
        '/search' => [
            'controller' => 'Pop\Docs\Http\Controller\IndexController',
            'action'     => 'search'
        ],
        '*' => [
            'controller' => 'Pop\Docs\Http\Controller\IndexController',
            'action'     => 'route',
            'default'    => true
        ]
    ],
    'database' => include __DIR__ . '/database.php',
    'version'  => $_ENV['CURRENT_VERSION']
];