<?php

declare(strict_types=1);

use Aura\Sql\ExtendedPdo;
use Aura\Sql\ExtendedPdoInterface;
use Dice\Dice;
use MonologFactory\LoggerFactory;
use Psr\Log\LoggerInterface;
use Waglpz\Webapp\ExceptionHandler;
use Waglpz\Webapp\ExceptionHandlerInvokable;

use function Waglpz\Webapp\config;

return [
    '*'                          => [
        'substitutions' => [
            ExtendedPdoInterface::class      => '$DefaultPDO',
            LoggerInterface::class           => '$DefaultLogger',
            ExceptionHandlerInvokable::class => '$DefaultExceptionHandler',
        ],
    ],
    '$DefaultExceptionHandler'   => [
        'shared'          => true,
        'instanceOf'      => ExceptionHandler::class,
        'constructParams' => [config('logErrorsDir'), config('anonymizeLog')],
    ],
    //-> Web App
    '$DefaultPDO'                => [
        'shared'          => true,
        'instanceOf'      => ExtendedPdo::class,
        'constructParams' => [
            config('db')['dsn'],
            config('db')['username'],
            config('db')['password'],
            config('db')['options'] ?? null,
            config('db')['queries'] ?? null,
            config('db')['profiler'] ?? null,
        ],
    ],
    //<- Web App
    '$DefaultLogger'             => [
        'shared'     => true,
        'instanceOf' => LoggerFactory::class,
        'call'       => [['create', ['default', config('logger')['default']], Dice::CHAIN_CALL]],
    ],
];
