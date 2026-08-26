<?php

return [
    'routes' => [
        '/6.x' => [
            '/search' => [
                'controller' => 'Pop\Docs\Http\Controller\IndexController',
                'action'     => 'search'
            ],
            '*' => [
                'controller' => 'Pop\Docs\Http\Controller\IndexController',
                'action'     => 'route',
                'default'    => true
            ]
        ]
    ],
    'database' => include __DIR__ . '/database.php',
    'version'  => '6.0.0'
];
