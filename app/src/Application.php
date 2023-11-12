<?php

namespace Pop\Docs;

use Pop\Http\Server\Request;
use Pop\Http\Server\Response;
use Pop\View\View;

class Application extends \Pop\Application
{

    /**
     * Application name
     * @var ?string
     */
    protected ?string $name = 'pop-docs';

    /**
     * Application version
     * @var ?string
     */
    protected ?string $version = '5.0.0';

    /**
     * Load application
     *
     * @return Application
     */
    public function load(): Application
    {
        $this->router()?->addControllerParams(
            '*', [
                'application' => $this,
                'request' => new Request(),
                'response' => new Response()
            ]
        );

        return $this;
    }

    /**
     * HTTP error handler method
     *
     * @param  \Exception $exception
     * @return void
     */
    public function httpError(\Exception $exception): void
    {
        $response      = new Response();
        $view          = new View(__DIR__ . '/../view/exception.phtml');
        $view->title   = 'Error';
        $view->message = $exception->getMessage();
        $response->setBody($view->render());
        $response->send(500);
        exit();
    }

}