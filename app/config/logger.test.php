<?php

declare(strict_types=1);

use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\PsrLogMessageProcessor;

return [
    'default' => [
        'handlers'   => [
            [
                'name'   => StreamHandler::class,
                'params' => [
                    'stream' => __DIR__ . '/../var/log/test.log',
                    'level'  => Logger::DEBUG,
                ],
            ],
        ],
        'processors' => [
            [
                'name' => PsrLogMessageProcessor::class,
            ],
        ],
    ],
];
