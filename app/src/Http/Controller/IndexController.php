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
        $uri      = str_replace('/6.x', '', $_SERVER['REQUEST_URI']);
        $template = (($uri == '') || ($uri == '/')) ? '/index' : $uri;

        if ($template == '/search') {
            $this->search();
        } else {
            if (file_exists($this->viewPath . $template . '.phtml')) {
                $this->prepareView($template);
                $this->view->version = '/6.x';
                $this->send();
            } else {
                $this->error();
            }
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
        $version     = '/6.x';

        $this->prepareView('search');
        $this->view->query   = $query;
        $this->view->version = '/6.x';
        $this->view->results = (!empty($query)) ? $searchModel->search($query, $version) : [];

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
        $this->view->title   = '404 : Page Not Found';
        $this->view->version = '/6.x';
        $this->send(404);
    }

    /**
     * Maintenance action
     *
     * @return void
     */
    public function maintenance(): void
    {
        $this->prepareView('maintenance');
        $this->view->title   = 'Down for Maintenance';
        $this->view->version = '/6.x';
        $this->send(503);
    }

}
