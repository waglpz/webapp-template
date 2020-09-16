<?php

declare(strict_types=1);

use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogHandler;
use Monolog\Logger;
use Monolog\Processor\PsrLogMessageProcessor;

return [
    'default' => [
        'handlers'   => [
            [
                'name'   => StreamHandler::class,
                'params' => [
                    'stream' => __DIR__ . '/../var/log/webapp.dev.log',
                    'level'  => Logger::DEBUG,
                ],
            ],
            [
                'name'   => SyslogHandler::class,
                'params' => [
                    'ident'    => 'webapp.dev',
                    'facility' => 'local0',
                    'level'    => Logger::DEBUG,
                ],
            ],
            [
                'name'   => StreamHandler::class,
                'params' => [
                    'stream' => 'php://STDOUT',
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
