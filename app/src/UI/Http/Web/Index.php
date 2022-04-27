<?php

declare(strict_types=1);

namespace @PROJECT_NS@\UI\Http\Web;

use Aura\Sql\ExtendedPdoInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use Slim\Views\PhpRenderer;
use Waglpz\Webapp\WebController;

class Index extends WebController
{
    private ExtendedPdoInterface $pdo;
    private LoggerInterface $logger;

    public function __construct(
        PhpRenderer $view,
        ExtendedPdoInterface $pdo,
        LoggerInterface $logger
    ) {
        parent::__construct($view);
        $this->pdo    = $pdo;
        $this->logger = $logger;
    }

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $this->logger->debug('TEST INDEX PAGE LOGGING');

        $data  = $this->pdo->fetchAll('SELECT * FROM __migrations');
        $model = ['data' => $data];

        return $this->render($model);
    }
}
