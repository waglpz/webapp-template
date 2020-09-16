<?php

declare(strict_types=1);

use Monolog\Handler\SyslogHandler;
use Monolog\Processor\PsrLogMessageProcessor;

return [
    'default' => [
        'handlers'   => [
            [
                'name'         => SyslogHandler::class,
                'params'       => [
                    'ident'    => 'ZaehlerstandSelbstablesung',
                    'facility' => 'local0',
                    'level'    => $_SERVER['LOG_LEVEL'],
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
