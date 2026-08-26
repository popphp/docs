<?php

/**
 * The documentation routes are generated from new-docs/sitemap.php — one static GET route per
 * page — by new-docs/tools/generate-routes.php. Regenerate after changing the sitemap; do not
 * hand-edit app.docs.php.
 */
$docs = include __DIR__ . '/app.docs.php';
$toc  = include __DIR__ . '/app.docs-toc.php';

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

    // Page index behind the generated routes: title, section, components and prev/next, plus
    // the on-this-page headings the view builder recorded while rendering each page.
    'docs' => array_combine(
        array_keys($docs['pages']),
        array_map(
            static fn(array $page, string $slug): array => $page + ['headings' => $toc[$slug] ?? []],
            $docs['pages'],
            array_keys($docs['pages'])
        )
    ),

    'http_options_headers' => [
        'Access-Control-Allow-Origin'  => '*',
        'Access-Control-Allow-Headers' => 'Accept, Authorization, Content-Type',
        'Access-Control-Allow-Methods' => 'HEAD, OPTIONS, GET, PUT, POST, PATCH, DELETE',
        'Content-Type'                 => 'application/json'
    ]
];
