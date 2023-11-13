<?php

namespace Pop\Docs\Http\Controller;

use Pop\Docs\Model;

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
     * Search action
     *
     * @return void
     */
    public function search(): void
    {
        $searchModel = new Model\Search();
        $query       = htmlentities(strip_tags($this->request->getQuery('query')), ENT_QUOTES, 'UTF-8');

        $this->prepareView('search');
        $this->view->query   = $query;
        $this->view->results = (!empty($query)) ? $searchModel->search($query) : [];

        $this->send();
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