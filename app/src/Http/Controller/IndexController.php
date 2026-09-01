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
        if ($this->request->acceptsHtml()) {
            $this->prepareView('index.phtml');
            $this->view->title = 'Welcome';
            $this->send();
        } else {
            $this->sendJson(200, ['message' => 'Index page']);
        }
    }

}
