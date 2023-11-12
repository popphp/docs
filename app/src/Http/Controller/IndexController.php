<?php

namespace Pop\Docs\Http\Controller;

class IndexController extends AbstractController
{

    /**
     * Route action
     *
     * @return void
     */
    public function route(): void
    {
        $uri      = $this->request->getUriAsString();
        $template = (($uri == '') || ($uri == '/')) ? '/index' : $uri;

        if (file_exists($this->viewPath . $template . '.phtml')) {
            $this->prepareView($template);
            $this->send();
        } else {
            $this->error();
        }
    }

    /**
     * Error action
     *
     * @return void
     */
    public function error(): void
    {
        $this->prepareView('error');
        $this->view->title = '404 : Page Not Found';
        $this->send(404);
    }

}