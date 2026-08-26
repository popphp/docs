<?php

return [
    'routes' => [
        'help' => [
            'controller' => 'Pop\Docs\Console\Controller\ConsoleController',
            'action'     => 'help',
            'help'       => 'Show the help screen'
        ],
        '*'    => [
            'controller' => 'Pop\Docs\Console\Controller\ConsoleController',
            'action'     => 'error'
        ]
    ],

];
