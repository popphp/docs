<?php

$autoloader = include __DIR__ . '/../vendor/autoload.php';
$autoloader->addPsr4('Pop\Docs\\', __DIR__ . '/../app/src');

try {
    $app = new Pop\Docs\Application($autoloader, include __DIR__ . '/../app/config/app.http.php');
    $app->load();
    $app->run();
} catch (\Exception $exception) {
    $app = new Pop\Docs\Application();
    $app->httpError($exception);
}


