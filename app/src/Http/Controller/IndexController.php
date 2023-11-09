<?php

namespace Pop\Docs\Http\Controller;

class IndexController extends AbstractController
{

    /**
     * Index action
     *
     * @return void
     */
    public function index(): void
    {
        $this->prepareView('index.phtml');
        $this->view->title = 'Home';
        $this->send();
    }

    /**
     * Error action
     *
     * @return void
     */
    public function error(): void
    {
        $this->prepareView('error.phtml');
        $this->view->title = 'Error';
        $this->send(404);
    }

}