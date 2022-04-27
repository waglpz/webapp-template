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
    '$DefaultPDO'                => [
        'shared'          => true,
        'instanceOf'      => ExtendedPdo::class,
        'constructParams' => [
            /** @phpstan-ignore-next-line */
            config('db')['dsn'],
            /** @phpstan-ignore-next-line */
            config('db')['username'],
            /** @phpstan-ignore-next-line */
            config('db')['password'],
            /** @phpstan-ignore-next-line */
            config('db')['options'] ?? null,
            /** @phpstan-ignore-next-line */
            config('db')['queries'] ?? null,
            /** @phpstan-ignore-next-line */
            config('db')['profiler'] ?? null,
        ],
    ],
    '$DefaultLogger'             => [
        'shared'     => true,
        'instanceOf' => LoggerFactory::class,
        'call'       => [
            [
                'create',
                [
                    'default',
                    /** @phpstan-ignore-next-line */
                    config('logger')['default'],
                ],
                Dice::CHAIN_CALL,
            ],
        ],
    ],
];
