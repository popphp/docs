<?php

/**
 * The documentation routes are generated from new-docs/sitemap.php — one static GET route per
 * page — by new-docs/tools/generate-routes.php. Regenerate after changing the sitemap; do not
 * hand-edit app.docs.php.
 */
$docs = include __DIR__ . '/app.docs.php';

return [
    'routes' => [
        'get' => $docs['routes'] + [
            '/api[/]' => [
                'controller' => 'Pop\Docs\Http\Controller\IndexController',
                'action'     => 'index'
            ],
        ],
        '*' => [
            '*' => [
                'controller' => 'Pop\Docs\Http\Controller\IndexController',
                'action'     => 'error'
            ]
        ]
    ],

    // Page index behind the generated routes: title, section, components and prev/next.
    'docs' => $docs['pages'],

    'http_options_headers' => [
        'Access-Control-Allow-Origin'  => '*',
        'Access-Control-Allow-Headers' => 'Accept, Authorization, Content-Type',
        'Access-Control-Allow-Methods' => 'HEAD, OPTIONS, GET, PUT, POST, PATCH, DELETE',
        'Content-Type'                 => 'application/json'
    ]
];
