<?php

namespace Pop\Docs\Http\Controller;

use Pop\Application;
use Pop\Http\Server\Request;
use Pop\Http\Server\Response;
use Pop\View\View;

abstract class AbstractController extends \Pop\Controller\AbstractController
{

    /**
     * Application object
     * @var ?Application
     */
    protected ?Application $application = null;

    /**
     * Request object
     * @var ?Request
     */
    protected ?Request $request = null;

    /**
     * Response object
     * @var ?Response
     */
    protected ?Response $response = null;

    /**
     * View path
     * @var string
     */
    protected string $viewPath = __DIR__ . '/../../../view';

    /**
     * View object
     * @var ?View
     */
    protected ?View $view = null;

    /**
     * Default action
     * @var string
     */
    protected string $defaultAction = 'route';

    /**
     * Constructor for the controller
     *
     * @param  Application $application
     * @param  Request     $request
     * @param  Response    $response
     */
    public function __construct(Application $application, Request $request, Response $response)
    {
        $this->application = $application;
        $this->request     = $request;
        $this->response    = $response;
    }

    /**
     * Get application object
     *
     * @return Application
     */
    public function application(): Application
    {
        return $this->application;
    }

    /**
     * Get request object
     *
     * @return Request
     */
    public function request(): Request
    {
        return $this->request;
    }

    /**
     * Get response object
     *
     * @return Response
     */
    public function response(): Response
    {
        return $this->response;
    }

    /**
     * Get view object
     *
     * @return View
     */
    public function getView(): View
    {
        return $this->view;
    }

    /**
     * Determine if the controller has a view
     *
     * @return bool
     */
    public function hasView(): bool
    {
        return ($this->view !== null);
    }

    /**
     * Redirect method
     *
     * @param  string $url
     * @param  int    $code
     * @param  string $version
     * @return void
     */
    public function redirect(string $url, int $code = 302, string $version = '1.1'): void
    {
        Response::redirect($url, $code, $version);
        exit();
    }

    /**
     * Send method
     *
     * @param  int     $code
     * @param  mixed   $body
     * @param  ?string $message
     * @param  ?array  $headers
     * @return void
     */
    public function send(int $code = 200, mixed $body = null, ?string $message = null, ?array $headers = null): void
    {
        if (($body === null) && ($this->view !== null)) {
            $body = $this->view->render();
        }

        if ($message !== null) {
            $this->response->setMessage($message);
        }

        $this->response->setCode($code);
        $this->response->setBody($body . PHP_EOL . PHP_EOL);
        $this->response->send(null, $headers);
    }

    /**
     * Prepare view
     *
     * @param  string $template
     * @return void
     */
    protected function prepareView(string $template): void
    {
        $segments = array_values(array_map(function ($value) {
            return str_replace('-', ' ', $value);
        }, array_filter(explode('/', $template))));

        $title      = ucwords(end($segments));
        $this->view = new View($this->viewPath . '/' . $template . '.phtml');

        $this->view->nav1Active = (($title == 'Index') || (str_contains($template, '/overview'))) ? 'true' : 'false';
        $this->view->nav2Active = (str_contains($template, '/installation')) ? 'true' : 'false';
        $this->view->nav3Active = (str_contains($template, '/getting-started')) ? 'true' : 'false';
        $this->view->nav4Active = (str_contains($template, '/user-guide')) ? 'true' : 'false';
        $this->view->nav5Active = (str_contains($template, '/reference')) ? 'true' : 'false';
        $this->view->nav6Active = (str_contains($template, '/changelog')) ? 'true' : 'false';

//        $this->view->versions = [
//            '/'    => '5.0',
//            '/4.8' => '4.8',
//            '/4.7' => '4.7',
//            '/4.6' => '4.6',
//            '/4.5' => '4.5'
//        ];

        if ($title == 'Index') {
            $this->view->title      = 'Home';
            $this->view->segments   = [];
        } else {
            $this->view->title    = $title;
            $this->view->segments = $segments;
        }
    }

}
